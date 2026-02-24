import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service';
import { CreateBlogDTO, UpdateBlogDTO } from '../domain/blog.dto';
import { logger } from '../../../shared/utils/logger';

export class BlogController {
    async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: CreateBlogDTO = req.body;
            const authorId = (req as any).user.id;

            const blog = await blogService.createBlog(dto, authorId);

            res.status(201).json({
                success: true,
                message: 'Blog created successfully',
                data: blog,
            });
        } catch (error) {
            logger.error('Error in createBlog controller:', error);
            next(error);
        }
    }

    async getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { category_id, limit = 10, offset = 0 } = req.query;

            const blogs = await blogService.getAllBlogs({
                category_id: category_id as string,
                limit: Number(limit),
                offset: Number(offset),
            });

            res.status(200).json({
                success: true,
                data: blogs,
                count: blogs.length,
            });
        } catch (error) {
            logger.error('Error in getAllBlogs controller:', error);
            next(error);
        }
    }

    async getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const blog = await blogService.getBlogById(id as string);

            if (!blog) {
                res.status(404).json({
                    success: false,
                    message: 'Blog not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: blog,
            });
        } catch (error) {
            logger.error('Error in getBlogById controller:', error);
            next(error);
        }
    }

    async getBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { slug } = req.params;
            const blog = await blogService.getBlogBySlug(slug as string);

            if (!blog) {
                res.status(404).json({
                    success: false,
                    message: 'Blog not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: blog,
            });
        } catch (error) {
            logger.error('Error in getBlogBySlug controller:', error);
            next(error);
        }
    }

    async updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const dto: UpdateBlogDTO = req.body;
            const userId = (req as any).user.id;

            const blog = await blogService.updateBlog(id as string, dto, userId);

            res.status(200).json({
                success: true,
                message: 'Blog updated successfully',
                data: blog,
            });
        } catch (error) {
            logger.error('Error in updateBlog controller:', error);
            next(error);
        }
    }

    async deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;

            await blogService.deleteBlog(id as string, userId);

            res.status(200).json({
                success: true,
                message: 'Blog deleted successfully',
            });
        } catch (error) {
            logger.error('Error in deleteBlog controller:', error);
            next(error);
        }
    }

    async getMyBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const blogs = await blogService.getBlogsByAuthor(userId);

            res.status(200).json({
                success: true,
                data: blogs,
                count: blogs.length,
            });
        } catch (error) {
            logger.error('Error in getMyBlogs controller:', error);
            next(error);
        }
    }

    async searchBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { q } = req.query;

            if (!q || typeof q !== 'string' || q.trim().length === 0) {
                res.status(400).json({ success: false, message: 'Search query is required' });
                return;
            }

            const blogs = await blogService.searchBlogs(q);

            res.status(200).json({
                success: true,
                data: blogs,
                count: blogs.length,
                query: q,
            });
        } catch (error) {
            logger.error('Error in searchBlogs controller:', error);
            next(error);
        }
    }
}

export const blogController = new BlogController();
