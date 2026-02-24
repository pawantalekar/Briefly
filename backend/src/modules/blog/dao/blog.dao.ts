import { supabase } from '../../../config/supabaseClient';
import { BlogModel } from '../models/blog.model';
import { logger } from '../../../shared/utils/logger';

export class BlogDAO {
    private tableName = 'blogs';

    async create(data: BlogModel): Promise<BlogModel> {
        try {
            const { data: blog, error } = await supabase
                .from(this.tableName)
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return blog;
        } catch (error) {
            logger.error('Error creating blog in DAO:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<BlogModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select(`
                    *,
                    author:users(id, name, email),
                    category:categories(id, name, slug),
                    tags:blog_tags(tag:tags(id, name))
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('Error finding blog by ID in DAO:', error);
            return null;
        }
    }

    async findBySlug(slug: string): Promise<BlogModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select(`
                    *,
                    author:users(id, name, email),
                    category:categories(id, name, slug),
                    tags:blog_tags(tag:tags(id, name))
                `)
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('Error finding blog by slug in DAO:', error);
            return null;
        }
    }

    async findAll(filters?: { category_id?: string; is_published?: boolean; limit?: number; offset?: number }): Promise<BlogModel[]> {
        try {
            let query = supabase
                .from(this.tableName)
                .select(`
                    *,
                    author:users(id, name),
                    category:categories(id, name, slug)
                `)
                .order('created_at', { ascending: false });

            if (filters?.category_id) {
                query = query.eq('category_id', filters.category_id);
            }

            if (filters?.is_published !== undefined) {
                query = query.eq('is_published', filters.is_published);
            }

            if (filters?.limit) {
                query = query.limit(filters.limit);
            }

            if (filters?.offset) {
                query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('Error finding all blogs in DAO:', error);
            throw error;
        }
    }

    async update(id: string, data: Partial<BlogModel>): Promise<BlogModel> {
        try {
            const { data: blog, error } = await supabase
                .from(this.tableName)
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return blog;
        } catch (error) {
            logger.error('Error updating blog in DAO:', error);
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
            logger.error('Error deleting blog in DAO:', error);
            throw error;
        }
    }

    async incrementViews(id: string): Promise<void> {
        try {
            const { error } = await supabase.rpc('increment_blog_views', { blog_id: id });
            if (error) throw error;
        } catch (error) {
            logger.error('Error incrementing views in DAO:', error);
            throw error;
        }
    }

    async getBlogsByAuthor(authorId: string): Promise<BlogModel[]> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('author_id', authorId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('Error getting blogs by author in DAO:', error);
            throw error;
        }
    }
    async search(query: string): Promise<BlogModel[]> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select(`
                    *,
                    author:users(id, name),
                    category:categories(id, name, slug)
                `)
                .textSearch('title', query, { type: 'websearch', config: 'english' })
                .eq('is_published', true)
                .order('views_count', { ascending: false })
                .limit(20);

            if (error) throw error;

            if (!data || data.length === 0) {
                const { data: fallback } = await supabase
                    .from(this.tableName)
                    .select(`*, author:users(id, name), category:categories(id, name, slug)`)
                    .eq('is_published', true)
                    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
                    .order('views_count', { ascending: false })
                    .limit(20);
                return fallback || [];
            }

            return data;
        } catch (error) {
            logger.error('Error searching blogs in DAO:', error);
            throw error;
        }
    }
}

export const blogDAO = new BlogDAO();
