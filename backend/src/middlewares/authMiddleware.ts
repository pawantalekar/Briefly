import { Request, Response, NextFunction } from 'express';
import { authService } from '../modules/auth/services/auth.service';
import { logger } from '../shared/utils/logger';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;

        if (req.cookies?.access_token) {
            token = req.cookies.access_token;
        } else if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
        }

        if (!token) {
            logger.warn(`[401] ${req.method} ${req.path} - No token provided`);
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = authService.verifyToken(token);
        (req as any).user = decoded;
        logger.info(`[AUTH] ${req.method} ${req.path} - user=${decoded.id} role=${decoded.role}`);

        next();
    } catch (error) {
        logger.warn(`[401] ${req.method} ${req.path} - Invalid or expired token`);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
