import { supabase } from '../../../config/supabaseClient';
import { CategoryModel } from '../models/category.model';
import { logger } from '../../../shared/utils/logger';

export class CategoryDAO {
    private tableName = 'categories';

    async create(data: CategoryModel): Promise<CategoryModel> {
        try {
            const { data: category, error } = await supabase
                .from(this.tableName)
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return category;
        } catch (error) {
            logger.error('Error creating category in DAO:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<CategoryModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('Error finding category by ID in DAO:', error);
            return null;
        }
    }

    async findAll(): Promise<CategoryModel[]> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('Error finding all categories in DAO:', error);
            throw error;
        }
    }

    async update(id: string, data: Partial<CategoryModel>): Promise<CategoryModel> {
        try {
            const { data: category, error } = await supabase
                .from(this.tableName)
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return category;
        } catch (error) {
            logger.error('Error updating category in DAO:', error);
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
            logger.error('Error deleting category in DAO:', error);
            throw error;
        }
    }
}

export const categoryDAO = new CategoryDAO();
