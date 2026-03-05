import apiClient from '../../utils/axios'
import type { ApiResponse } from '../types/apiResponse'
import type { CryptoCoin } from '../../types'

type CryptoResponse = { success: boolean; data: CryptoCoin[] }
type StockResponse = { success: boolean; data: unknown[] }

const reqGetCryptoData = async (): Promise<ApiResponse<CryptoResponse>> =>
    apiClient
        .get<CryptoResponse>('/market/crypto')
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

const reqGetStockData = async (): Promise<ApiResponse<StockResponse>> =>
    apiClient
        .get<StockResponse>('/market/stocks')
        .then((res) => [null, res] as const)
        .catch((err) => [err, err] as const)

export default {
    reqGetCryptoData,
    reqGetStockData,
}
