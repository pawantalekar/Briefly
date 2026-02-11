import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../domain/auth.dto';
import { logger } from '../../../shared/utils/logger';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: RegisterDTO = req.body;
            const result = await authService.register(dto);

            // Set HttpOnly cookie
            res.cookie('access_token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'lax', // Protect against CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/'
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        } catch (error: any) {
            logger.error('Error in register controller:', error);
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: LoginDTO = req.body;
            const result = await authService.login(dto);

            // Set HttpOnly cookie
            res.cookie('access_token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/'
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error: any) {
            logger.error('Error in login controller:', error);
            next(error);
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const profile = await authService.getProfile(userId);

            if (!profile) {
                res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: profile,
            });
        } catch (error: any) {
            logger.error('Error in getProfile controller:', error);
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie('access_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error: any) {
            logger.error('Error in logout controller:', error);
            next(error);
        }
    }
}

export const authController = new AuthController();
