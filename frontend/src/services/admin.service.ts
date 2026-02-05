import axios from '../utils/axios';
import type { Blog, UserModel } from '../types';

interface AdminStats {
    totalUsers: number;
    totalBlogs: number;
    totalComments: number;
    totalLikes: number;
}

export const adminService = {

    async getStats(): Promise<AdminStats> {
        try {
            const response = await axios.get('/admin/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalUsers: 0,
                totalBlogs: 0,
                totalComments: 0,
                totalLikes: 0
            };
        }
    },


    async getAllUsers(): Promise<UserModel[]> {
        try {
            const response = await axios.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    async deleteUser(userId: string): Promise<void> {
        await axios.delete(`/admin/users/${userId}`);
    },

    async updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<void> {
        await axios.patch(`/admin/users/${userId}/role`, { role });
    },

    async toggleUserStatus(userId: string, isActive: boolean): Promise<void> {
        await axios.patch(`/admin/users/${userId}/status`, { is_active: isActive });
    },


    async getAllBlogs(): Promise<Blog[]> {
        try {
            const response = await axios.get('/admin/blogs');
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            return [];
        }
    },

    async deleteBlog(blogId: string): Promise<void> {
        await axios.delete(`/admin/blogs/${blogId}`);
    },

    async toggleBlogPublish(blogId: string, isPublished: boolean): Promise<void> {
        await axios.patch(`/admin/blogs/${blogId}/publish`, { is_published: isPublished });
    },
};
