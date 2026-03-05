import apiClient from '../../utils/axios'
import type { ApiResponse } from '../types/apiResponse'

type LikeToggleResponse = { success: boolean; data: { liked: boolean; likes_count: number } }
type LikeStatsResponse = { success: boolean; data: { likes_count: number; user_liked: boolean } }

const reqToggleLike = async (blogId: string): Promise<ApiResponse<LikeToggleResponse>> =>
    apiClient
        .post<LikeToggleResponse>('/likes/toggle', { blog_id: blogId })
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqGetLikeStatus = async (blogId: string): Promise<ApiResponse<LikeStatsResponse>> =>
    apiClient
        .get<LikeStatsResponse>(`/likes/stats/${blogId}`)
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

export default {
    reqToggleLike,
    reqGetLikeStatus,
}
