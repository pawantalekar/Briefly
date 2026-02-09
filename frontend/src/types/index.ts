export interface Blog {
    id: string;
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    cover_image?: string;
    author: {
        id: string;
        name: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
    tags?: Array<{
        id: string;
        name: string;
    }>;
    is_published: boolean;
    position?: 'featured' | 'top' | 'standard';
    published_at?: string;
    views_count: number;
    likes_count: number;
    created_at: string;
    updated_at: string;
}

export interface CreateBlogDTO {
    title: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    category_id: string;
    tags?: string[];
    is_published?: boolean;
    position?: 'featured' | 'top' | 'standard';
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface Comment {
    id: string;
    content: string;
    blog_id: string;
    user: {
        id: string;
        name: string;
        avatar_url?: string;
    };
    parent_id?: string;
    replies?: Comment[];
    is_edited: boolean;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    avatar_url?: string;
    bio?: string;
    is_active?: boolean;
    created_at?: string;
}

export interface UserModel extends User {
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
