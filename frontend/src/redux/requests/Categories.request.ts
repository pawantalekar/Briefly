import apiClient from '../../utils/axios'
import type { ApiResponse } from '../types/apiResponse'
import type { Category } from '../../types'

type CategoryListResponse = { success: boolean; data: Category[] }

const reqGetAllCategories = async (): Promise<ApiResponse<CategoryListResponse>> =>
    apiClient
        .get<CategoryListResponse>('/categories')
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

export default {
    reqGetAllCategories,
}
