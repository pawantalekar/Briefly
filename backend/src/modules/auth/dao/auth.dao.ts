import { supabase } from '../../../config/supabaseClient';
import { UserModel } from '../models/user.model';
import { logger } from '../../../shared/utils/logger';

export class AuthDAO {
    private tableName = 'users';

    async createUser(data: UserModel): Promise<UserModel> {
        try {
            const { data: user, error } = await supabase
                .from(this.tableName)
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return user;
        } catch (error) {
            logger.error('Error creating user in DAO:', error);
            throw error;
        }
    }

    async findByEmail(email: string): Promise<UserModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No rows returned
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            logger.error('Error finding user by email in DAO:', error);
            return null;
        }
    }

    async findById(id: string): Promise<UserModel | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('Error finding user by ID in DAO:', error);
            return null;
        }
    }

    async updateUser(id: string, data: Partial<UserModel>): Promise<UserModel> {
        try {
            const { data: user, error } = await supabase
                .from(this.tableName)
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return user;
        } catch (error) {
            logger.error('Error updating user in DAO:', error);
            throw error;
        }
    }
}

export const authDAO = new AuthDAO();
