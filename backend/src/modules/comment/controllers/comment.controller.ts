import { Request, Response, NextFunction } from 'express';
import { commentService } from '../services/comment.service';
import { CreateCommentDTO, UpdateCommentDTO } from '../domain/comment.dto';
import { logger } from '../../../shared/utils/logger';

export class CommentController {
    async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: CreateCommentDTO = req.body;
            const userId = (req as any).user.id;
            logger.info(`[COMMENT] Create comment - userId=${userId} blogId=${dto.blog_id} parentId=${dto.parent_id || 'none'}`);
            const comment = await commentService.createComment(dto, userId);
            logger.info(`[COMMENT] Comment created - commentId=${comment.id}`);
            res.status(201).json({ success: true, message: 'Comment created successfully', data: comment });
        } catch (error: any) {
            logger.error(`[COMMENT] Create comment failed - ${error.message}`);
            next(error);
        }
    }

    async getCommentsByBlogId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { blogId } = req.params;
            logger.info(`[COMMENT] Get comments - blogId=${blogId}`);
            const comments = await commentService.getCommentsByBlogId(blogId as string);
            logger.info(`[COMMENT] Fetched ${comments.length} comments for blogId=${blogId}`);
            res.status(200).json({ success: true, data: comments, count: comments.length });
        } catch (error: any) {
            logger.error(`[COMMENT] Get comments failed - blogId=${req.params.blogId} - ${error.message}`);
            next(error);
        }
    }

    async updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const dto: UpdateCommentDTO = req.body;
            const userId = (req as any).user.id;
            logger.info(`[COMMENT] Update comment - commentId=${id} userId=${userId}`);
            const comment = await commentService.updateComment(id as string, dto, userId);
            logger.info(`[COMMENT] Comment updated - commentId=${id}`);
            res.status(200).json({ success: true, message: 'Comment updated successfully', data: comment });
        } catch (error: any) {
            logger.error(`[COMMENT] Update comment failed - commentId=${req.params.id} - ${error.message}`);
            next(error);
        }
    }

    async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            logger.info(`[COMMENT] Delete comment - commentId=${id} userId=${userId}`);
            await commentService.deleteComment(id as string, userId);
            logger.info(`[COMMENT] Comment deleted - commentId=${id}`);
            res.status(200).json({ success: true, message: 'Comment deleted successfully' });
        } catch (error: any) {
            logger.error(`[COMMENT] Delete comment failed - commentId=${req.params.id} - ${error.message}`);
            next(error);
        }
    }
}

export const commentController = new CommentController();
