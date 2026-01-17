/**
 * Auth Service Factory
 *
 * Creates and exports the appropriate AuthService implementation based on environment configuration.
 *
 * **Environment Variable**: NEXT_PUBLIC_USE_MOCK_AUTH
 * - true: Uses MockAuthService (localStorage-based mock auth)
 * - false: Uses BetterAuthService (real Better Auth integration)
 *
 * **Swappability Guarantee**:
 * UI components must ONLY import `authService` from this file, never directly import
 * MockAuthService or BetterAuthService. This ensures auth implementation can be swapped
 * without any UI code changes.
 *
 * **Usage in UI Components**:
 * ```typescript
 * import { authService } from '@/lib/auth';
 *
 * // In component
 * const handleLogin = async (email: string, password: string) => {
 *   try {
 *     const { user, token } = await authService.login({ email, password });
 *     // Handle success
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 */

import type { AuthService } from './auth-service';
import { MockAuthService } from './mock-auth-service';
import { BetterAuthService } from './better-auth-service';

/**
 * Check if mock auth is enabled via environment variable
 */
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

/**
 * Create the appropriate auth service implementation
 */
function createAuthService(): AuthService {
  if (USE_MOCK_AUTH) {
    console.info('[Auth] Using MockAuthService (NEXT_PUBLIC_USE_MOCK_AUTH=true)');
    return new MockAuthService();
  }

  console.info('[Auth] Using BetterAuthService (NEXT_PUBLIC_USE_MOCK_AUTH=false)');
  return new BetterAuthService();
}

/**
 * Singleton auth service instance
 * Export this in all UI components and hooks
 */
export const authService = createAuthService();

/**
 * Re-export types for convenience
 */
export type { AuthService } from './auth-service';
export type { User, AuthResponse, LoginCredentials, SignupData, AuthState } from '@/types/auth';
