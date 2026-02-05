import { supabase } from '../../../config/supabaseClient';
import { LikeModel } from '../models/like.model';
import { logger } from '../../../shared/utils/logger';

export class LikeDAO {
    private tableName = 'likes';

    async create(data: LikeModel): Promise<LikeModel> {
        try {
            const { data: like, error } = await supabase
                .from(this.tableName)
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return like;
        } catch (error) {
            logger.error('Error creating like in DAO:', error);
            throw error;
        }
    }

    async findByUserAndBlog(userId: string, blogId: string): Promise<LikeModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('user_id', userId)
                .eq('blog_id', blogId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') return null;
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('Error finding like by user and blog in DAO:', error);
            return null;
        }
    }

    async countByBlogId(blogId: string): Promise<number> {
        try {
            const { count, error } = await supabase
                .from(this.tableName)
                .select('*', { count: 'exact', head: true })
                .eq('blog_id', blogId);

            if (error) throw error;
            return count || 0;
        } catch (error) {
            logger.error('Error counting likes by blog ID in DAO:', error);
            return 0;
        }
    }

    async delete(userId: string, blogId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('user_id', userId)
                .eq('blog_id', blogId);

            if (error) throw error;
        } catch (error) {
            logger.error('Error deleting like in DAO:', error);
            throw error;
        }
    }
}

export const likeDAO = new LikeDAO();
