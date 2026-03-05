import type { AxiosError, AxiosResponse } from 'axios'

/** Error responses follow the pattern [err, err] or [err, err.{some_path}.message] */
type ErrorResponse = readonly [AxiosError, AxiosError | string]
type SuccessResponse<T> = readonly [null, AxiosResponse<T>]

/** [null, response] | [error, errorString] */
export type ApiResponse<T> = ErrorResponse | SuccessResponse<T>
