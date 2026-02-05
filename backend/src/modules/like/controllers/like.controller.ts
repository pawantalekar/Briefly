import { Request, Response, NextFunction } from 'express';
import { likeService } from '../services/like.service';
import { CreateLikeDTO } from '../domain/like.dto';
import { logger } from '../../../shared/utils/logger';

export class LikeController {
    async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: CreateLikeDTO = req.body;
            const userId = (req as any).user.id;

            const result = await likeService.toggleLike(dto, userId);

            res.status(200).json({
                success: true,
                message: result.message,
                data: { liked: result.liked },
            });
        } catch (error) {
            logger.error('Error in toggleLike controller:', error);
            next(error);
        }
    }

    async getLikeStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blogId } = req.params;
            const userId = (req as any).user?.id;

            const stats = await likeService.getLikeStats(blogId as string, userId);

            res.status(200).json({
                success: true,
                data: stats,
            });
        } catch (error) {
            logger.error('Error in getLikeStats controller:', error);
            next(error);
        }
    }
}

export const likeController = new LikeController();
