// Request DTOs
export interface CreateCategoryDTO {
    name: string;
    description?: string;
}

export interface UpdateCategoryDTO {
    name?: string;
    description?: string;
}

// Response DTOs
export interface CategoryResponseDTO {
    id: string;
    name: string;
    slug: string;
    description?: string;
    blog_count?: number;
    created_at: string;
}
