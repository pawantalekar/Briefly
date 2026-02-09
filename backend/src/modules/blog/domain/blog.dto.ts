// Request DTOs
export interface CreateBlogDTO {
    title: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    category_id: string;
    tags?: string[]; // array of tag IDs
    is_published?: boolean;
    position?: 'featured' | 'top' | 'standard';
}

export interface UpdateBlogDTO {
    title?: string;
    content?: string;
    excerpt?: string;
    cover_image?: string;
    category_id?: string;
    tags?: string[];
    is_published?: boolean;
    position?: 'featured' | 'top' | 'standard';
}

// Response DTOs
export interface BlogResponseDTO {
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

export interface BlogListItemDTO {
    id: string;
    title: string;
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
    };
    published_at?: string;
    views_count: number;
    likes_count: number;
}
