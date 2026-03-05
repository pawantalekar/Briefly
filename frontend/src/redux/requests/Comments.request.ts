import apiClient from '../../utils/axios'
import type { ApiResponse } from '../types/apiResponse'
import type { Comment } from '../../types'

type CommentListResponse = { success: boolean; data: Comment[] }
type CommentResponse = { success: boolean; data: Comment }
type CreateCommentPayload = { blog_id: string; content: string; parent_id?: string }

const reqGetCommentsByBlog = async (blogId: string): Promise<ApiResponse<CommentListResponse>> =>
    apiClient
        .get<CommentListResponse>(`/comments/blog/${blogId}`)
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqCreateComment = async (data: CreateCommentPayload): Promise<ApiResponse<CommentResponse>> =>
    apiClient
        .post<CommentResponse>('/comments', data)
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

export default {
    reqGetCommentsByBlog,
    reqCreateComment,
}
