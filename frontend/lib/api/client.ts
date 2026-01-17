// Centralized API Client

import { APIResponse, APIError, HTTPMethod } from '@/types/api'
import { isAPIError } from '@/types/guards'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class APIClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  }

  /**
   * Get auth token from unified source
   * Note: We directly access localStorage here instead of importing authService
   * to avoid circular dependency issues. The token key 'token' is standardized
   * across all auth implementations (Mock and BetterAuth).
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private async request<T>(
    endpoint: string,
    method: HTTPMethod = 'GET',
    body?: unknown
  ): Promise<APIResponse<T>> {
    const token = this.getAuthToken()
    const headers: Record<string, string> = { ...this.defaultHeaders }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      config.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config)

      // Handle 401 Unauthorized - clear token and redirect
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        throw new Error('Unauthorized')
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return { data: null as T }
      }

      const data = await response.json()

      // Check if response is an error
      if (!response.ok) {
        if (isAPIError(data)) {
          throw new APIClientError(data.error.message, response.status, data)
        }
        throw new APIClientError('Request failed', response.status)
      }

      return data as APIResponse<T>
    } catch (error) {
      if (error instanceof APIClientError) {
        throw error
      }

      // Check if it's a network/connection error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new APIClientError(
          `Unable to connect to the API server at ${this.baseURL}. Please ensure the backend is running.`,
          0
        )
      }

      throw new APIClientError(
        error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        0
      )
    }
  }

  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, 'GET')
  }

  async post<T>(endpoint: string, body: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, 'POST', body)
  }

  async patch<T>(endpoint: string, body: unknown): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', body)
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, 'DELETE')
  }
}

export class APIClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public errorData?: APIError
  ) {
    super(message)
    this.name = 'APIClientError'
  }
}

// Export singleton instance
export const apiClient = new APIClient()
