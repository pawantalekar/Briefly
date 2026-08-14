import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { logger } from '../../../shared/utils/logger';

export const adminController = {
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info(`[ADMIN] Get stats`);
            const stats = await adminService.getStats();
            logger.info(`[ADMIN] Stats fetched - users=${stats.totalUsers} blogs=${stats.totalBlogs} comments=${stats.totalComments}`);
            res.json(stats);
        } catch (error: any) {
            logger.error(`[ADMIN] Get stats failed - ${error.message}`);
            next(error);
        }
    },

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info(`[ADMIN] Get all users`);
            const users = await adminService.getAllUsers();
            logger.info(`[ADMIN] Fetched ${users.length} users`);
            res.json(users);
        } catch (error: any) {
            logger.error(`[ADMIN] Get all users failed - ${error.message}`);
            next(error);
        }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const adminId = (req as any).user?.id;
            logger.info(`[ADMIN] Delete user - targetUserId=${userId} adminId=${adminId}`);
            await adminService.deleteUser(userId as string);
            logger.info(`[ADMIN] User deleted - userId=${userId}`);
            res.status(204).send();
        } catch (error: any) {
            logger.error(`[ADMIN] Delete user failed - userId=${req.params.userId} - ${error.message}`);
            next(error);
        }
    },

    async updateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { role } = req.body;
            const adminId = (req as any).user?.id;
            logger.info(`[ADMIN] Update user role - targetUserId=${userId} newRole=${role} adminId=${adminId}`);
            await adminService.updateUserRole(userId as string, role);
            logger.info(`[ADMIN] User role updated - userId=${userId} role=${role}`);
            res.json({ message: 'User role updated successfully' });
        } catch (error: any) {
            logger.error(`[ADMIN] Update user role failed - userId=${req.params.userId} - ${error.message}`);
            next(error);
        }
    },

    async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { is_active } = req.body;
            const adminId = (req as any).user?.id;
            logger.info(`[ADMIN] Toggle user status - targetUserId=${userId} is_active=${is_active} adminId=${adminId}`);
            await adminService.toggleUserStatus(userId as string, is_active);
            logger.info(`[ADMIN] User status updated - userId=${userId} is_active=${is_active}`);
            res.json({ message: 'User status updated successfully' });
        } catch (error: any) {
            logger.error(`[ADMIN] Toggle user status failed - userId=${req.params.userId} - ${error.message}`);
            next(error);
        }
    },

    async getAllBlogs(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info(`[ADMIN] Get all blogs`);
            const blogs = await adminService.getAllBlogs();
            logger.info(`[ADMIN] Fetched ${blogs.length} blogs`);
            res.json(blogs);
        } catch (error: any) {
            logger.error(`[ADMIN] Get all blogs failed - ${error.message}`);
            next(error);
        }
    },

    async deleteBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const { blogId } = req.params;
            const adminId = (req as any).user?.id;
            logger.info(`[ADMIN] Delete blog - blogId=${blogId} adminId=${adminId}`);
            await adminService.deleteBlog(blogId as string);
            logger.info(`[ADMIN] Blog deleted - blogId=${blogId}`);
            res.status(204).send();
        } catch (error: any) {
            logger.error(`[ADMIN] Delete blog failed - blogId=${req.params.blogId} - ${error.message}`);
            next(error);
        }
    },

    async toggleBlogPublish(req: Request, res: Response, next: NextFunction) {
        try {
            const { blogId } = req.params;
            const { is_published } = req.body;
            const adminId = (req as any).user?.id;
            logger.info(`[ADMIN] Toggle blog publish - blogId=${blogId} is_published=${is_published} adminId=${adminId}`);
            await adminService.toggleBlogPublish(blogId as string, is_published);
            logger.info(`[ADMIN] Blog publish status updated - blogId=${blogId} is_published=${is_published}`);
            res.json({ message: 'Blog status updated successfully' });
        } catch (error: any) {
            logger.error(`[ADMIN] Toggle blog publish failed - blogId=${req.params.blogId} - ${error.message}`);
            next(error);
        }
    },
};
