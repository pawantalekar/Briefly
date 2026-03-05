import apiClient from '../../utils/axios'
import type { ApiResponse } from '../types/apiResponse'
import type { Tag } from '../../types'

type TagListResponse = { success: boolean; data: Tag[] }
type TagResponse = { success: boolean; data: Tag }

const reqGetAllTags = async (): Promise<ApiResponse<TagListResponse>> =>
    apiClient
        .get<TagListResponse>('/tags')
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqCreateTag = async (name: string): Promise<ApiResponse<TagResponse>> =>
    apiClient
        .post<TagResponse>('/tags', { name })
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

export default {
    reqGetAllTags,
    reqCreateTag,
}
