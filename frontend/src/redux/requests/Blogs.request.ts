import apiClient from '../../utils/axios'
import type { ApiResponse } from '../types/apiResponse'
import type { Blog, CreateBlogDTO } from '../../types'

type BlogListResponse = { success: boolean; data: Blog[] }
type BlogResponse = { success: boolean; data: Blog }
type SearchResponse = { success: boolean; data: Blog[]; count: number; query: string }

const reqGetAllBlogs = async (
    params?: { category_id?: string; tag_id?: string; limit?: number; offset?: number }
): Promise<ApiResponse<BlogListResponse>> =>
    apiClient
        .get<BlogListResponse>('/blogs', { params })
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqGetBlogBySlug = async (slug: string): Promise<ApiResponse<BlogResponse>> =>
    apiClient
        .get<BlogResponse>(`/blogs/slug/${slug}`)
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqGetMyBlogs = async (): Promise<ApiResponse<BlogListResponse>> =>
    apiClient
        .get<BlogListResponse>('/blogs/my/blogs')
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqCreateBlog = async (data: CreateBlogDTO): Promise<ApiResponse<BlogResponse>> =>
    apiClient
        .post<BlogResponse>('/blogs', data)
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqUpdateBlog = async (id: string, data: Partial<CreateBlogDTO>): Promise<ApiResponse<BlogResponse>> =>
    apiClient
        .put<BlogResponse>(`/blogs/${id}`, data)
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqSearchBlogs = async (query: string): Promise<ApiResponse<SearchResponse>> =>
    apiClient
        .get<SearchResponse>('/blogs/search', { params: { q: query } })
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

export default {
    reqGetAllBlogs,
    reqGetBlogBySlug,
    reqGetMyBlogs,
    reqCreateBlog,
    reqUpdateBlog,
    reqSearchBlogs,
}
