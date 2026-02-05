import { blogDAO } from '../dao/blog.dao';
import { CreateBlogDTO, UpdateBlogDTO, BlogResponseDTO } from '../domain/blog.dto';
import { generateSlug } from '../../../shared/utils/slugGenerator';
import { logger } from '../../../shared/utils/logger';

export class BlogService {
    async createBlog(dto: CreateBlogDTO, authorId: string): Promise<BlogResponseDTO> {
        try {
            const slug = generateSlug(dto.title);

            const blogData = {
                title: dto.title,
                content: dto.content,
                slug,
                excerpt: dto.excerpt,
                cover_image: dto.cover_image,
                author_id: authorId,
                category_id: dto.category_id,
                is_published: dto.is_published || false,
                published_at: dto.is_published ? new Date().toISOString() : undefined,
                views_count: 0,
                likes_count: 0,
            };

            const blog = await blogDAO.create(blogData);


            if (dto.tags && dto.tags.length > 0) {

                logger.info(`Tags to be associated: ${dto.tags.join(', ')}`);
            }

            return blog as unknown as BlogResponseDTO;
        } catch (error) {
            logger.error('Error in createBlog service:', error);
            throw new Error('Failed to create blog');
        }
    }

    async getBlogById(id: string): Promise<BlogResponseDTO | null> {
        try {
            const blog = await blogDAO.findById(id);
            if (blog) {
                await blogDAO.incrementViews(id);
            }
            return blog as BlogResponseDTO | null;
        } catch (error) {
            logger.error('Error in getBlogById service:', error);
            throw new Error('Failed to retrieve blog');
        }
    }

    async getBlogBySlug(slug: string): Promise<BlogResponseDTO | null> {
        try {
            const blog = await blogDAO.findBySlug(slug);
            if (blog && blog.id) {
                await blogDAO.incrementViews(blog.id);
            }
            return blog as BlogResponseDTO | null;
        } catch (error) {
            logger.error('Error in getBlogBySlug service:', error);
            throw new Error('Failed to retrieve blog');
        }
    }

    async getAllBlogs(filters?: { category_id?: string; limit?: number; offset?: number }): Promise<BlogResponseDTO[]> {
        try {
            const blogs = await blogDAO.findAll({ ...filters, is_published: true });
            return blogs as unknown as BlogResponseDTO[];
        } catch (error) {
            logger.error('Error in getAllBlogs service:', error);
            throw new Error('Failed to retrieve blogs');
        }
    }

    async updateBlog(id: string, dto: UpdateBlogDTO, userId: string): Promise<BlogResponseDTO> {
        try {
            const existingBlog = await blogDAO.findById(id);

            if (!existingBlog) {
                throw new Error('Blog not found');
            }


            if (existingBlog.author_id !== userId) {
                throw new Error('Unauthorized to update this blog');
            }

            const updateData: any = { ...dto };


            if (dto.title) {
                updateData.slug = generateSlug(dto.title);
            }


            if (dto.is_published && !existingBlog.is_published) {
                updateData.published_at = new Date().toISOString();
            }

            const updatedBlog = await blogDAO.update(id, updateData);
            return updatedBlog as unknown as BlogResponseDTO;
        } catch (error) {
            logger.error('Error in updateBlog service:', error);
            throw error;
        }
    }

    async deleteBlog(id: string, userId: string): Promise<void> {
        try {
            const existingBlog = await blogDAO.findById(id);

            if (!existingBlog) {
                throw new Error('Blog not found');
            }

            if (existingBlog.author_id !== userId) {
                throw new Error('Unauthorized to delete this blog');
            }

            await blogDAO.delete(id);
        } catch (error) {
            logger.error('Error in deleteBlog service:', error);
            throw error;
        }
    }

    async getBlogsByAuthor(authorId: string): Promise<BlogResponseDTO[]> {
        try {
            const blogs = await blogDAO.getBlogsByAuthor(authorId);
            return blogs as unknown as BlogResponseDTO[];
        } catch (error) {
            logger.error('Error in getBlogsByAuthor service:', error);
            throw new Error('Failed to retrieve author blogs');
        }
    }
}

export const blogService = new BlogService();
