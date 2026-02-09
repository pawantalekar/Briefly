export interface BlogModel {
    id?: string;
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    cover_image?: string;
    author_id: string;
    category_id: string;
    is_published: boolean;
    position?: 'featured' | 'top' | 'standard';
    published_at?: string;
    views_count?: number;
    likes_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface BlogWithDetails extends BlogModel {
    author?: {
        id: string;
        name: string;
        email: string;
    };
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    tags?: Array<{
        id: string;
        name: string;
    }>;
}
