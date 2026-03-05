import apiClient from '../../utils/axios'
import type { ApiResponse } from '../types/apiResponse'
import type { AuthResponse, User } from '../../types'

type ProfileResponse = { data: User }

const reqLogin = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> =>
    apiClient
        .post<AuthResponse>('/auth/login', { email, password })
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqRegister = async (name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> =>
    apiClient
        .post<AuthResponse>('/auth/register', { name, email, password })
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqGetProfile = async (): Promise<ApiResponse<ProfileResponse>> =>
    apiClient
        .get<ProfileResponse>('/auth/profile')
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqLogout = async (): Promise<ApiResponse<void>> =>
    apiClient
        .post<void>('/auth/logout')
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

export default {
    reqLogin,
    reqRegister,
    reqGetProfile,
    reqLogout,
}
