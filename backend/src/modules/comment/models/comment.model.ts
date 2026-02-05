export interface CommentModel {
    id?: string;
    content: string;
    blog_id: string;
    user_id: string;
    parent_id?: string; // For nested comments/replies
    is_edited: boolean;
    created_at?: string;
    updated_at?: string;
}
