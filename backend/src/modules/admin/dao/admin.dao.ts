import { supabase } from '../../../config/supabaseClient';

export const adminDAO = {
    async getUserCount(): Promise<number> {
        const { count } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
        return count || 0;
    },

    async getBlogCount(): Promise<number> {
        const { count } = await supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true });
        return count || 0;
    },

    async getCommentCount(): Promise<number> {
        const { count } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true });
        return count || 0;
    },

    async getLikeCount(): Promise<number> {
        const { count } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true });
        return count || 0;
    },

    async getAllUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role, avatar_url, bio, is_active, created_at, updated_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async deleteUser(userId: string) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw error;
    },

    async updateUserRole(userId: string, role: string) {
        const { error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', userId);

        if (error) throw error;
    },

    async toggleUserStatus(userId: string, isActive: boolean) {
        const { error } = await supabase
            .from('users')
            .update({ is_active: isActive })
            .eq('id', userId);

        if (error) throw error;
    },

    async toggleBlogPublish(blogId: string, isPublished: boolean) {
        const { error } = await supabase
            .from('blogs')
            .update({ is_published: isPublished })
            .eq('id', blogId);

        if (error) throw error;
    }
};
