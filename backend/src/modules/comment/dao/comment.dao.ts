import { supabase } from '../../../config/supabaseClient';
import { CommentModel } from '../models/comment.model';
import { logger } from '../../../shared/utils/logger';

export class CommentDAO {
    private tableName = 'comments';

    async create(data: CommentModel): Promise<CommentModel> {
        try {
            const { data: comment, error } = await supabase
                .from(this.tableName)
                .insert(data)
                .select(`
                    *,
                    user:users(id, name, avatar_url)
                `)
                .single();

            if (error) throw error;
            return comment;
        } catch (error) {
            logger.error('Error creating comment in DAO:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<CommentModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select(`
                    *,
                    user:users(id, name, avatar_url)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('Error finding comment by ID in DAO:', error);
            return null;
        }
    }

    async findByBlogId(blogId: string): Promise<CommentModel[]> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select(`
                    *,
                    user:users(id, name, avatar_url)
                `)
                .eq('blog_id', blogId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('Error finding comments by blog ID in DAO:', error);
            throw error;
        }
    }

    async update(id: string, data: Partial<CommentModel>): Promise<CommentModel> {
        try {
            const { data: comment, error } = await supabase
                .from(this.tableName)
                .update({ ...data, is_edited: true, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return comment;
        } catch (error) {
            logger.error('Error updating comment in DAO:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            logger.error('Error deleting comment in DAO:', error);
            throw error;
        }
    }
}

export const commentDAO = new CommentDAO();
