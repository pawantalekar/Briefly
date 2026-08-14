import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../domain/auth.dto';
import { logger } from '../../../shared/utils/logger';

export class AuthController {
    private getCookieOptions() {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        } as const;
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: RegisterDTO = req.body;
            logger.info(`[AUTH] Register attempt - email=${dto.email}`);
            const result = await authService.register(dto);
            res.cookie('access_token', result.token, this.getCookieOptions());
            logger.info(`[AUTH] Register success - userId=${result.user.id} email=${dto.email}`);
            res.status(201).json({ success: true, message: 'User registered successfully', data: result });
        } catch (error: any) {
            logger.error(`[AUTH] Register failed - email=${req.body?.email} - ${error.message}`);
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: LoginDTO = req.body;
            logger.info(`[AUTH] Login attempt - email=${dto.email}`);
            const result = await authService.login(dto);
            res.cookie('access_token', result.token, this.getCookieOptions());
            logger.info(`[AUTH] Login success - userId=${result.user.id} role=${result.user.role}`);
            res.status(200).json({ success: true, message: 'Login successful', data: result });
        } catch (error: any) {
            logger.warn(`[AUTH] Login failed - email=${req.body?.email} - ${error.message}`);
            next(error);
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.id;
            logger.info(`[AUTH] Get profile - userId=${userId}`);
            const profile = await authService.getProfile(userId);
            if (!profile) {
                logger.warn(`[AUTH] Profile not found - userId=${userId}`);
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            res.status(200).json({ success: true, data: profile });
        } catch (error: any) {
            logger.error(`[AUTH] Get profile error - ${error.message}`);
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            res.clearCookie('access_token', this.getCookieOptions());
            logger.info(`[AUTH] Logout - userId=${userId}`);
            res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch (error: any) {
            logger.error(`[AUTH] Logout error - ${error.message}`);
            next(error);
        }
    }
}

export const authController = new AuthController();
