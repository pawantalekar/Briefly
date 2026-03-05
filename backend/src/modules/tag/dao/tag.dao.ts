import { supabase } from '../../../config/supabaseClient';
import { TagModel } from '../models/tag.model';
import { logger } from '../../../shared/utils/logger';

export class TagDAO {
    private tableName = 'tags';

    async create(name: string, slug: string): Promise<TagModel> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .insert({ name, slug })
                .select('id, name, slug')
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('Error creating tag in DAO:', error);
            throw error;
        }
    }

    async findByName(name: string): Promise<TagModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('id, name, slug')
                .ilike('name', name)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('Error finding tag by name in DAO:', error);
            return null;
        }
    }

    async findAll(): Promise<TagModel[]> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('id, name, slug')
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            logger.error('Error finding all tags in DAO:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<TagModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('id, name, slug')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('Error finding tag by ID in DAO:', error);
            return null;
        }
    }
}

export const tagDAO = new TagDAO();
