export interface UserModel {
    id?: string;
    name: string;
    email: string;
    password_hash?: string;
    role: 'USER' | 'ADMIN';
    avatar_url?: string;
    bio?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}
