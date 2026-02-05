import { likeDAO } from '../dao/like.dao';
import { CreateLikeDTO, LikeResponseDTO, LikeStatsDTO } from '../domain/like.dto';
import { logger } from '../../../shared/utils/logger';

export class LikeService {
    async toggleLike(dto: CreateLikeDTO, userId: string): Promise<{ liked: boolean; message: string }> {
        try {
            const existingLike = await likeDAO.findByUserAndBlog(userId, dto.blog_id);

            if (existingLike) {

                await likeDAO.delete(userId, dto.blog_id);
                return { liked: false, message: 'Blog unliked successfully' };
            } else {

                await likeDAO.create({
                    user_id: userId,
                    blog_id: dto.blog_id,
                });
                return { liked: true, message: 'Blog liked successfully' };
            }
        } catch (error) {
            logger.error('Error in toggleLike service:', error);
            throw new Error('Failed to toggle like');
        }
    }

    async getLikeStats(blogId: string, userId?: string): Promise<LikeStatsDTO> {
        try {
            const totalLikes = await likeDAO.countByBlogId(blogId);
            let userLiked = false;

            if (userId) {
                const existingLike = await likeDAO.findByUserAndBlog(userId, blogId);
                userLiked = !!existingLike;
            }

            return {
                blog_id: blogId,
                total_likes: totalLikes,
                user_liked: userLiked,
            };
        } catch (error) {
            logger.error('Error in getLikeStats service:', error);
            throw new Error('Failed to retrieve like stats');
        }
    }
}

export const likeService = new LikeService();
