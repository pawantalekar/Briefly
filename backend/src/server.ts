import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config/config';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';
import { logger } from './shared/utils/logger';

dotenv.config();

const app: Application = express();
const PORT = config.port;

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5175',
    process.env.FRONTEND_URL, // Add this to Render environment variables
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


app.use('/api', routes);


app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📚 API available at http://localhost:${PORT}/api`);
    logger.info(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
