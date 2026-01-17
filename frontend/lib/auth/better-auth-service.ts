/**
 * BetterAuthService Implementation (Placeholder for Phase 2 Backend)
 *
 * This is a placeholder for the real Better Auth integration.
 * During Phase 2 Frontend development, the MockAuthService is used instead.
 *
 * **When to implement**: Phase 2 Backend integration (when real Better Auth is ready)
 *
 * **Implementation Notes**:
 * - Use Better Auth client library
 * - JWT tokens stored in http-only cookies (preferred) or localStorage (fallback)
 * - All API calls go to real backend endpoints
 * - Error handling matches backend API responses
 *
 * **Swappability**: Simply set NEXT_PUBLIC_USE_MOCK_AUTH=false to use this service
 */

import type { AuthService } from './auth-service';
import type { User, AuthResponse, LoginCredentials, SignupData } from '@/types/auth';

export class BetterAuthService implements AuthService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  /**
   * Register a new user account
   * TODO: Implement real Better Auth signup
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    // TODO: Implement real Better Auth signup API call
    // Example:
    // const response = await fetch(`${this.apiUrl}/api/v1/auth/signup`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: data.email, password: data.password }),
    //   credentials: 'include', // For http-only cookies
    // });
    //
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.error.message || 'Signup failed');
    // }
    //
    // const result = await response.json();
    // return result.data; // { user: User, token: string }

    throw new Error('BetterAuthService not implemented yet. Use MockAuthService (set NEXT_PUBLIC_USE_MOCK_AUTH=true)');
  }

  /**
   * Authenticate an existing user
   * TODO: Implement real Better Auth login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Implement real Better Auth login API call
    // Example:
    // const response = await fetch(`${this.apiUrl}/api/v1/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials),
    //   credentials: 'include', // For http-only cookies
    // });
    //
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.error.message || 'Login failed');
    // }
    //
    // const result = await response.json();
    // return result.data; // { user: User, token: string }

    throw new Error('BetterAuthService not implemented yet. Use MockAuthService (set NEXT_PUBLIC_USE_MOCK_AUTH=true)');
  }

  /**
   * Log out the current user
   * TODO: Implement real Better Auth logout
   */
  async logout(): Promise<void> {
    // TODO: Implement real Better Auth logout API call
    // Example:
    // const response = await fetch(`${this.apiUrl}/api/v1/auth/logout`, {
    //   method: 'POST',
    //   credentials: 'include', // For http-only cookies
    // });
    //
    // if (typeof window !== 'undefined') {
    //   localStorage.removeItem('auth_token'); // If using localStorage
    // }

    throw new Error('BetterAuthService not implemented yet. Use MockAuthService (set NEXT_PUBLIC_USE_MOCK_AUTH=true)');
  }

  /**
   * Get the current authentication token
   * TODO: Implement token retrieval (from http-only cookie or localStorage)
   */
  getToken(): string | null {
    // TODO: Implement token retrieval
    // If using localStorage:
    // if (typeof window === 'undefined') return null;
    // return localStorage.getItem('auth_token');
    //
    // If using http-only cookies:
    // Cookies are automatically sent with requests, but not accessible via JavaScript
    // You may need to decode from a separate cookie or call a /me endpoint

    return null;
  }

  /**
   * Get the currently authenticated user
   * TODO: Implement user retrieval (decode JWT or call /me endpoint)
   */
  getCurrentUser(): User | null {
    // TODO: Implement user retrieval
    // Option 1: Decode JWT from localStorage
    // const token = this.getToken();
    // if (!token) return null;
    // const payload = JSON.parse(atob(token.split('.')[1]));
    // return { id: payload.sub, email: payload.email };
    //
    // Option 2: Call /me endpoint
    // const response = await fetch(`${this.apiUrl}/api/v1/auth/me`, {
    //   credentials: 'include',
    // });
    // const result = await response.json();
    // return result.data.user;

    return null;
  }

  /**
   * Check if a user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
