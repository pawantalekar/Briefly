import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';

export const adminController = {
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await adminService.getStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    },

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await adminService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    },

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            await adminService.deleteUser(userId as string);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    async updateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { role } = req.body;
            await adminService.updateUserRole(userId as string, role);
            res.json({ message: 'User role updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { is_active } = req.body;
            await adminService.toggleUserStatus(userId as string, is_active);
            res.json({ message: 'User status updated successfully' });
        } catch (error) {
            next(error);
        }
    },

    async getAllBlogs(req: Request, res: Response, next: NextFunction) {
        try {
            const blogs = await adminService.getAllBlogs();
            res.json(blogs);
        } catch (error) {
            next(error);
        }
    },

    async deleteBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const { blogId } = req.params;
            await adminService.deleteBlog(blogId as string);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    async toggleBlogPublish(req: Request, res: Response, next: NextFunction) {
        try {
            const { blogId } = req.params;
            const { is_published } = req.body;
            await adminService.toggleBlogPublish(blogId as string, is_published);
            res.json({ message: 'Blog status updated successfully' });
        } catch (error) {
            next(error);
        }
    }
};
