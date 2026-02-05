import { adminDAO } from '../dao/admin.dao';
import { blogDAO } from '../../blog/dao/blog.dao';

export const adminService = {
    async getStats() {
        const [users, blogs, comments, likes] = await Promise.all([
            adminDAO.getUserCount(),
            adminDAO.getBlogCount(),
            adminDAO.getCommentCount(),
            adminDAO.getLikeCount()
        ]);

        return {
            totalUsers: users,
            totalBlogs: blogs,
            totalComments: comments,
            totalLikes: likes
        };
    },

    async getAllUsers() {
        return await adminDAO.getAllUsers();
    },

    async deleteUser(userId: string) {
        return await adminDAO.deleteUser(userId);
    },

    async updateUserRole(userId: string, role: string) {
        return await adminDAO.updateUserRole(userId, role);
    },

    async toggleUserStatus(userId: string, isActive: boolean) {
        return await adminDAO.toggleUserStatus(userId, isActive);
    },

    async getAllBlogs() {
        return await blogDAO.findAll({});
    },

    async deleteBlog(blogId: string) {
        return await blogDAO.delete(blogId);
    },

    async toggleBlogPublish(blogId: string, isPublished: boolean) {
        return await adminDAO.toggleBlogPublish(blogId, isPublished);
    }
};
