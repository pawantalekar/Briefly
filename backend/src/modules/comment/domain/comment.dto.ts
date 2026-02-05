// Request DTOs
export interface CreateCommentDTO {
    content: string;
    blog_id: string;
    parent_id?: string;
}

export interface UpdateCommentDTO {
    content: string;
}

// Response DTOs
export interface CommentResponseDTO {
    id: string;
    content: string;
    blog_id: string;
    user: {
        id: string;
        name: string;
        avatar_url?: string;
    };
    parent_id?: string;
    replies?: CommentResponseDTO[];
    is_edited: boolean;
    created_at: string;
    updated_at: string;
}
