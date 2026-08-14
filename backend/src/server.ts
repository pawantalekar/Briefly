import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { config } from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import { logger } from './shared/utils/logger';

dotenv.config();

const app: Application = express();
const PORT = config.port;

app.use(cookieParser());

// Trust proxy is required for secure cookies to work behind a load balancer/proxy (e.g. Vercel, Render)
app.set('trust proxy', 1);

// Disable ETags globally — prevents Express from sending 304 Not Modified
// responses that cause browsers to replay stale/empty cached API data.
app.set('etag', false);

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5175',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// No-cache headers for all API responses
// Prevents browsers from caching API responses and serving stale data.
app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use((req, res, next) => {
    const start = Date.now();
    const ip = req.ip || req.socket.remoteAddress;
    res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
        logger[level](`[${res.statusCode}] ${req.method} ${req.path} - ${ip} - ${duration}ms`);
    });
    next();
});

app.use('/api', routes);


app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(` Server running on http://localhost:${PORT}`);
    logger.info(` API available at http://localhost:${PORT}/api`);
    logger.info(` Health check: http://localhost:${PORT}/api/health`);
    logger.info(` Environment: ${process.env.NODE_ENV}`);

    // ── Keep-alive self-ping ──────────────────────────────────────────────
    // Render's free tier sleeps after 15 min of inactivity. Pinging every
    // 14 min from inside the process keeps it warm as a secondary defence.
    // Primary: use UptimeRobot (external) for more reliable keep-alive.
    if (process.env.NODE_ENV === 'production') {
        const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

        setInterval(() => {
            const http = require('http');
            const req = http.get(
                `http://localhost:${PORT}/api/health`,
                (res: any) => {
                    logger.info(`Keep-alive ping → ${res.statusCode}`);
                    res.resume(); // discard response body to free memory
                }
            );
            req.on('error', (err: Error) => {
                logger.warn(`Keep-alive ping failed: ${err.message}`);
            });
            req.end();
        }, PING_INTERVAL_MS);

        logger.info(' Keep-alive ping scheduled every 14 minutes');
    }
});

export default app;
