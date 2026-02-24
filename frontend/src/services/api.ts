import apiClient from '../utils/axios';
import type { Blog, CreateBlogDTO } from '../types';

export const blogService = {
    getAllBlogs: async (params?: { category_id?: string; limit?: number; offset?: number }) => {
        const response = await apiClient.get<{ success: boolean; data: Blog[] }>('/blogs', { params });
        return response.data.data;
    },
    getBlogById: async (id: string) => {
        const response = await apiClient.get<{ success: boolean; data: Blog }>(`/blogs/${id}`);
        return response.data.data;
    },
    getBlogBySlug: async (slug: string) => {
        const response = await apiClient.get<{ success: boolean; data: Blog }>(`/blogs/slug/${slug}`);
        return response.data.data;
    },

    createBlog: async (data: CreateBlogDTO) => {
        const response = await apiClient.post<{ success: boolean; data: Blog }>('/blogs', data);
        return response.data.data;
    },

    getMyBlogs: async () => {
        const response = await apiClient.get<{ success: boolean; data: Blog[] }>('/blogs/my/blogs');
        return response.data.data;
    },

    updateBlog: async (id: string, data: Partial<CreateBlogDTO>) => {
        const response = await apiClient.put<{ success: boolean; data: Blog }>(`/blogs/${id}`, data);
        return response.data.data;
    },

    searchBlogs: async (query: string) => {
        const response = await apiClient.get<{ success: boolean; data: Blog[]; count: number; query: string }>(
            '/blogs/search',
            { params: { q: query } }
        );
        return response.data.data;
    },
};

export const authService = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data.data;
    },

    register: async (name: string, email: string, password: string) => {
        const response = await apiClient.post('/auth/register', { name, email, password });
        return response.data.data;
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/profile');
        return response.data.data;
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('storage'));
            window.location.href = '/login';
        }
    },
};

export const categoryService = {
    getAllCategories: async () => {
        const response = await apiClient.get('/categories');
        return response.data.data;
    },
};

export const commentService = {
    getCommentsByBlog: async (blogId: string) => {
        const response = await apiClient.get(`/comments/blog/${blogId}`);
        return response.data.data;
    },

    createComment: async (data: { blog_id: string; content: string; parent_id?: string }) => {
        const response = await apiClient.post('/comments', data);
        return response.data.data;
    },
};

export const likeService = {
    toggleLike: async (blogId: string) => {
        const response = await apiClient.post(`/likes/toggle`, { blog_id: blogId });
        return response.data.data;
    },

    getLikeStatus: async (blogId: string) => {
        const response = await apiClient.get(`/likes/stats/${blogId}`);
        return response.data.data;
    },
};

export const marketService = {
    getCryptoData: async () => {
        const response = await apiClient.get('/market/crypto');
        return response.data.data;
    },
    getStockData: async () => {
        const response = await apiClient.get('/market/stocks');
        return response.data.data;
    },
};
