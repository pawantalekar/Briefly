import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDTO, LoginDTO } from '../domain/auth.dto';
import { logger } from '../../../shared/utils/logger';

export class AuthController {
    private getCookieOptions() {
        const isProduction = process.env.NODE_ENV === 'production';

        const options = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        } as const;

        logger.info(`🍪 Setting Cookie: isProduction=${isProduction}, secure=${options.secure}, sameSite=${options.sameSite}`);
        return options;
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: RegisterDTO = req.body;
            const result = await authService.register(dto);

            // Set HttpOnly cookie
            res.cookie('access_token', result.token, this.getCookieOptions());

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
            res.cookie('access_token', result.token, this.getCookieOptions());

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
            res.clearCookie('access_token', this.getCookieOptions());

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
