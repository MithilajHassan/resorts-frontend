import { ApiError } from "../types/types"

export function isApiError(err: unknown): err is ApiError {
    return typeof err === 'object' && err !== null && 'status' in err && 'data' in err
}