/**
 * AuthService Interface
 *
 * Defines the contract for authentication services.
 * This interface enables swappable auth implementations:
 * - MockAuthService: localStorage-based mock auth (Phase 2 Frontend)
 * - BetterAuthService: Real Better Auth integration (Phase 2 Backend)
 *
 * **CRITICAL**: UI components must ONLY import from lib/auth/ (factory),
 * never directly import MockAuthService or BetterAuthService.
 * This ensures swappability without UI changes.
 */

import type { User, AuthResponse, LoginCredentials, SignupData } from '@/types/auth';

export interface AuthService {
  /**
   * Register a new user account
   * @param data - Signup credentials (email, password)
   * @returns Promise resolving to user and JWT token
   * @throws Error if email already exists or validation fails
   */
  signup(data: SignupData): Promise<AuthResponse>;

  /**
   * Authenticate an existing user
   * @param credentials - Login credentials (email, password)
   * @returns Promise resolving to user and JWT token
   * @throws Error if credentials are invalid
   */
  login(credentials: LoginCredentials): Promise<AuthResponse>;

  /**
   * Log out the current user
   * Clears authentication state (token, session data)
   * @returns Promise resolving when logout is complete
   */
  logout(): Promise<void>;

  /**
   * Get the currently authenticated user
   * Decodes and validates the stored JWT token
   * @returns User object if authenticated, null otherwise
   */
  getCurrentUser(): User | null;

  /**
   * Get the current authentication token
   * @returns JWT token string if authenticated, null otherwise
   */
  getToken(): string | null;

  /**
   * Check if a user is currently authenticated
   * @returns true if authenticated, false otherwise
   */
  isAuthenticated(): boolean;
}
