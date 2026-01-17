/**
 * useAuth Hook
 *
 * React hook for managing authentication state and operations.
 * Provides access to current user, auth status, and auth methods.
 *
 * **Usage**:
 * ```typescript
 * const { user, isAuthenticated, isLoading, login, signup, logout } = useAuth();
 * ```
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/lib/auth';
import type { User, LoginCredentials, SignupData } from '@/lib/auth';

interface UseAuthReturn {
  /** Currently authenticated user (null if not authenticated) */
  user: User | null;
  /** Whether a user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is being loaded */
  isLoading: boolean;
  /** Auth error message */
  error: string | null;
  /** Login method */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Signup method */
  signup: (data: SignupData) => Promise<void>;
  /** Logout method */
  logout: () => Promise<void>;
  /** Clear error */
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load current user on mount
   */
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load current user:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: authUser } = await authService.login(credentials);
      setUser(authUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err; // Re-throw for component-level handling
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Signup handler
   */
  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user: authUser } = await authService.signup(data);
      setUser(authUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err; // Re-throw for component-level handling
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err; // Re-throw for component-level handling
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };
}
