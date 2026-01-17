// Authentication API Functions

import { apiClient } from './client'
import { AuthResponse, LoginCredentials, SignupData } from '@/types/auth'
import { APIResponse } from '@/types/api'

export async function signup(data: SignupData): Promise<APIResponse<AuthResponse>> {
  return apiClient.post<AuthResponse>('/api/v1/auth/signup', data)
}

export async function login(credentials: LoginCredentials): Promise<APIResponse<AuthResponse>> {
  return apiClient.post<AuthResponse>('/api/v1/auth/login', credentials)
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/v1/auth/logout', {})
  } catch (error) {
    // Logout may fail if endpoint doesn't exist, but we still clear local storage
    console.warn('Logout API call failed:', error)
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }
}
