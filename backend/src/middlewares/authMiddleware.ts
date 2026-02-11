import { Request, Response, NextFunction } from 'express';
import { authService } from '../modules/auth/services/auth.service';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;

        if (req.cookies && req.cookies.access_token) {
            token = req.cookies.access_token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }

        const decoded = authService.verifyToken(token);
        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
