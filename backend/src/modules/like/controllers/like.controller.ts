import { Request, Response, NextFunction } from 'express';
import { likeService } from '../services/like.service';
import { CreateLikeDTO } from '../domain/like.dto';
import { logger } from '../../../shared/utils/logger';

export class LikeController {
    async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: CreateLikeDTO = req.body;
            const userId = (req as any).user.id;
            logger.info(`[LIKE] Toggle like - userId=${userId} blogId=${dto.blog_id}`);
            const result = await likeService.toggleLike(dto, userId);
            logger.info(`[LIKE] Like toggled - userId=${userId} blogId=${dto.blog_id} liked=${result.liked}`);
            res.status(200).json({ success: true, message: result.message, data: { liked: result.liked } });
        } catch (error: any) {
            logger.error(`[LIKE] Toggle like failed - ${error.message}`);
            next(error);
        }
    }

    async getLikeStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blogId } = req.params;
            const userId = (req as any).user?.id;
            logger.info(`[LIKE] Get like stats - blogId=${blogId} userId=${userId || 'guest'}`);
            const stats = await likeService.getLikeStats(blogId as string, userId);
            res.status(200).json({ success: true, data: stats });
        } catch (error: any) {
            logger.error(`[LIKE] Get like stats failed - blogId=${req.params.blogId} - ${error.message}`);
            next(error);
        }
    }
}

export const likeController = new LikeController();
