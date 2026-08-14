import { authDAO } from '../dao/auth.dao';
import { RegisterDTO, LoginDTO, AuthResponseDTO, UserProfileDTO } from '../domain/auth.dto';
import { logger } from '../../../shared/utils/logger';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../../config/config';

export class AuthService {
    async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
        try {
            const existingUser = await authDAO.findByEmail(dto.email);
            if (existingUser) {
                logger.warn(`[AUTH] Registration blocked - email already exists: ${dto.email}`);
                throw new Error('User with this email already exists');
            }

            const password_hash = await bcrypt.hash(dto.password, 10);
            const userData = { name: dto.name, email: dto.email, password_hash, role: 'USER' as const, is_active: true };
            const user = await authDAO.createUser(userData);
            const token = this.generateToken(user.id!, user.email, user.role);
            logger.info(`[AUTH] New user created - userId=${user.id} email=${dto.email}`);

            return { user: { id: user.id!, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url }, token };
        } catch (error) {
            logger.error(`[AUTH] Register service error - ${(error as Error).message}`);
            throw error;
        }
    }

    async login(dto: LoginDTO): Promise<AuthResponseDTO> {
        try {
            const user = await authDAO.findByEmail(dto.email);
            if (!user) {
                logger.warn(`[AUTH] Login failed - user not found: ${dto.email}`);
                throw new Error('Invalid credentials');
            }

            if (!user.is_active) {
                logger.warn(`[AUTH] Login blocked - account deactivated: ${dto.email}`);
                throw new Error('Account is deactivated');
            }

            const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash!);
            if (!isPasswordValid) {
                logger.warn(`[AUTH] Login failed - invalid password: ${dto.email}`);
                throw new Error('Invalid credentials');
            }

            const token = this.generateToken(user.id!, user.email, user.role);
            logger.info(`[AUTH] Login success - userId=${user.id} role=${user.role}`);

            return { user: { id: user.id!, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url }, token };
        } catch (error) {
            logger.error(`[AUTH] Login service error - ${(error as Error).message}`);
            throw error;
        }
    }

    async getProfile(userId: string): Promise<UserProfileDTO | null> {
        try {
            const user = await authDAO.findById(userId);
            if (!user) {
                logger.warn(`[AUTH] Profile not found - userId=${userId}`);
                return null;
            }
            return { id: user.id!, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url, bio: user.bio, created_at: user.created_at! };
        } catch (error) {
            logger.error(`[AUTH] Get profile service error - ${(error as Error).message}`);
            throw error;
        }
    }

    private generateToken(userId: string, email: string, role: string): string {
        return jwt.sign({ id: userId, email, role }, config.jwt.secret, { expiresIn: '7d' });
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (error) {
            logger.warn(`[AUTH] Token verification failed - ${(error as Error).message}`);
            throw new Error('Invalid token');
        }
    }
}

export const authService = new AuthService();
