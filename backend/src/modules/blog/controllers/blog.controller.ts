import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service';
import { CreateBlogDTO, UpdateBlogDTO } from '../domain/blog.dto';
import { logger } from '../../../shared/utils/logger';

export class BlogController {
    async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dto: CreateBlogDTO = req.body;
            const authorId = (req as any).user.id;
            logger.info(`[BLOG] Create blog - authorId=${authorId} title="${dto.title}"`);
            const blog = await blogService.createBlog(dto, authorId);
            logger.info(`[BLOG] Blog created - blogId=${blog.id} slug=${blog.slug}`);
            res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
        } catch (error: any) {
            logger.error(`[BLOG] Create blog failed - ${error.message}`);
            next(error);
        }
    }

    async getAllBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { category_id, tag_id, limit = 10, offset = 0 } = req.query;
            logger.info(`[BLOG] Get all blogs - category=${category_id || 'all'} tag=${tag_id || 'all'} limit=${limit} offset=${offset}`);
            const blogs = await blogService.getAllBlogs({
                category_id: category_id as string,
                tag_id: tag_id as string,
                limit: Number(limit),
                offset: Number(offset),
            });
            logger.info(`[BLOG] Fetched ${blogs.length} blogs`);
            res.status(200).json({ success: true, data: blogs, count: blogs.length });
        } catch (error: any) {
            logger.error(`[BLOG] Get all blogs failed - ${error.message}`);
            next(error);
        }
    }

    async getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            logger.info(`[BLOG] Get blog by id - blogId=${id}`);
            const blog = await blogService.getBlogById(id as string);
            if (!blog) {
                logger.warn(`[BLOG] Blog not found - blogId=${id}`);
                res.status(404).json({ success: false, message: 'Blog not found' });
                return;
            }
            res.status(200).json({ success: true, data: blog });
        } catch (error: any) {
            logger.error(`[BLOG] Get blog by id failed - ${error.message}`);
            next(error);
        }
    }

    async getBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { slug } = req.params;
            logger.info(`[BLOG] Get blog by slug - slug=${slug}`);
            const blog = await blogService.getBlogBySlug(slug as string);
            if (!blog) {
                logger.warn(`[BLOG] Blog not found - slug=${slug}`);
                res.status(404).json({ success: false, message: 'Blog not found' });
                return;
            }
            res.status(200).json({ success: true, data: blog });
        } catch (error: any) {
            logger.error(`[BLOG] Get blog by slug failed - ${error.message}`);
            next(error);
        }
    }

    async updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const dto: UpdateBlogDTO = req.body;
            const userId = (req as any).user.id;
            logger.info(`[BLOG] Update blog - blogId=${id} userId=${userId}`);
            const blog = await blogService.updateBlog(id as string, dto, userId);
            logger.info(`[BLOG] Blog updated - blogId=${id}`);
            res.status(200).json({ success: true, message: 'Blog updated successfully', data: blog });
        } catch (error: any) {
            logger.error(`[BLOG] Update blog failed - blogId=${req.params.id} - ${error.message}`);
            next(error);
        }
    }

    async deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;
            logger.info(`[BLOG] Delete blog - blogId=${id} userId=${userId}`);
            await blogService.deleteBlog(id as string, userId);
            logger.info(`[BLOG] Blog deleted - blogId=${id}`);
            res.status(200).json({ success: true, message: 'Blog deleted successfully' });
        } catch (error: any) {
            logger.error(`[BLOG] Delete blog failed - blogId=${req.params.id} - ${error.message}`);
            next(error);
        }
    }

    async getMyBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.id;
            logger.info(`[BLOG] Get my blogs - userId=${userId}`);
            const blogs = await blogService.getBlogsByAuthor(userId);
            logger.info(`[BLOG] Fetched ${blogs.length} blogs for userId=${userId}`);
            res.status(200).json({ success: true, data: blogs, count: blogs.length });
        } catch (error: any) {
            logger.error(`[BLOG] Get my blogs failed - ${error.message}`);
            next(error);
        }
    }

    async searchBlogs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { q } = req.query;
            if (!q || typeof q !== 'string' || q.trim().length === 0) {
                logger.warn(`[BLOG] Search failed - empty query`);
                res.status(400).json({ success: false, message: 'Search query is required' });
                return;
            }
            logger.info(`[BLOG] Search blogs - query="${q}"`);
            const blogs = await blogService.searchBlogs(q);
            logger.info(`[BLOG] Search returned ${blogs.length} results for query="${q}"`);
            res.status(200).json({ success: true, data: blogs, count: blogs.length, query: q });
        } catch (error: any) {
            logger.error(`[BLOG] Search blogs failed - ${error.message}`);
            next(error);
        }
    }
}

export const blogController = new BlogController();
