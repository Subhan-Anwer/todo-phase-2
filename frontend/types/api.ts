// API Response Types

export interface APIResponse<T> {
  data: T
  meta?: Record<string, unknown>
}

export interface APIError {
  error: {
    code: string
    message: string
    details?: Record<string, string | string[]>
  }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'

export interface RequestConfig {
  method: HTTPMethod
  headers?: Record<string, string>
  body?: unknown
}
