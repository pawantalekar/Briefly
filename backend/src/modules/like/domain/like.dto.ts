// Request DTOs
export interface CreateLikeDTO {
    blog_id: string;
}

// Response DTOs
export interface LikeResponseDTO {
    id: string;
    user_id: string;
    blog_id: string;
    created_at: string;
}

export interface LikeStatsDTO {
    blog_id: string;
    total_likes: number;
    user_liked: boolean;
}
