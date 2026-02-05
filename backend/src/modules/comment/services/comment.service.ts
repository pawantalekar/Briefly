import { commentDAO } from '../dao/comment.dao';
import { CreateCommentDTO, UpdateCommentDTO, CommentResponseDTO } from '../domain/comment.dto';
import { logger } from '../../../shared/utils/logger';

export class CommentService {
    async createComment(dto: CreateCommentDTO, userId: string): Promise<CommentResponseDTO> {
        try {
            const commentData = {
                content: dto.content,
                blog_id: dto.blog_id,
                user_id: userId,
                parent_id: dto.parent_id,
                is_edited: false,
            };

            const comment = await commentDAO.create(commentData);
            return comment as unknown as CommentResponseDTO;
        } catch (error) {
            logger.error('Error in createComment service:', error);
            throw new Error('Failed to create comment');
        }
    }

    async getCommentsByBlogId(blogId: string): Promise<CommentResponseDTO[]> {
        try {
            const comments = await commentDAO.findByBlogId(blogId);
            return comments as unknown as CommentResponseDTO[];
        } catch (error) {
            logger.error('Error in getCommentsByBlogId service:', error);
            throw new Error('Failed to retrieve comments');
        }
    }

    async updateComment(id: string, dto: UpdateCommentDTO, userId: string): Promise<CommentResponseDTO> {
        try {
            const existingComment = await commentDAO.findById(id);

            if (!existingComment) {
                throw new Error('Comment not found');
            }

            if (existingComment.user_id !== userId) {
                throw new Error('Unauthorized to update this comment');
            }

            const updatedComment = await commentDAO.update(id, { content: dto.content });
            return updatedComment as unknown as CommentResponseDTO;
        } catch (error) {
            logger.error('Error in updateComment service:', error);
            throw error;
        }
    }

    async deleteComment(id: string, userId: string): Promise<void> {
        try {
            const existingComment = await commentDAO.findById(id);

            if (!existingComment) {
                throw new Error('Comment not found');
            }

            if (existingComment.user_id !== userId) {
                throw new Error('Unauthorized to delete this comment');
            }

            await commentDAO.delete(id);
        } catch (error) {
            logger.error('Error in deleteComment service:', error);
            throw error;
        }
    }
}

export const commentService = new CommentService();
