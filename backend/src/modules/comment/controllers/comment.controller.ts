import { Request, Response, NextFunction } from 'express';
import { commentService } from '../services/comment.service';
import { CreateCommentDTO, UpdateCommentDTO } from '../domain/comment.dto';
import { logger } from '../../../shared/utils/logger';

export class CommentController {
    async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: CreateCommentDTO = req.body;
            const userId = (req as any).user.id;

            const comment = await commentService.createComment(dto, userId);

            res.status(201).json({
                success: true,
                message: 'Comment created successfully',
                data: comment,
            });
        } catch (error) {
            logger.error('Error in createComment controller:', error);
            next(error);
        }
    }

    async getCommentsByBlogId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blogId } = req.params;
            const comments = await commentService.getCommentsByBlogId(blogId as string);

            res.status(200).json({
                success: true,
                data: comments,
                count: comments.length,
            });
        } catch (error) {
            logger.error('Error in getCommentsByBlogId controller:', error);
            next(error);
        }
    }

    async updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const dto: UpdateCommentDTO = req.body;
            const userId = (req as any).user.id;

            const comment = await commentService.updateComment(id as string, dto, userId);

            res.status(200).json({
                success: true,
                message: 'Comment updated successfully',
                data: comment,
            });
        } catch (error) {
            logger.error('Error in updateComment controller:', error);
            next(error);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;

            await commentService.deleteComment(id as string, userId);

            res.status(200).json({
                success: true,
                message: 'Comment deleted successfully',
            });
        } catch (error) {
            logger.error('Error in deleteComment controller:', error);
            next(error);
        }
    }
}

export const commentController = new CommentController();
