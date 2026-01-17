/**
 * MockAuthService Implementation
 *
 * Simulates Better Auth authentication flows using localStorage.
 * This is used during Phase 2 Frontend development before Better Auth integration.
 *
 * **Security Note**: Mock JWT tokens are base64-encoded (NOT cryptographically secure).
 * This is acceptable for development but MUST NOT be used in production.
 *
 * **Swappability**: This service implements the AuthService interface,
 * enabling seamless swap to BetterAuthService when Phase 2 Backend is ready.
 */

import type { AuthService } from './auth-service';
import type { User, AuthResponse, LoginCredentials, SignupData } from '@/types/auth';

export class MockAuthService implements AuthService {
  private readonly MOCK_USERS_KEY = 'mock_users';
  private readonly MOCK_TOKEN_KEY = 'token'; // Unified token key for API client compatibility

  /**
   * Simulate async delay for realistic API behavior
   */
  private delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a mock UUID
   */
  private generateMockUUID(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a mock JWT token (base64-encoded, NOT secure)
   * Format: header.payload.signature
   */
  generateMockJWT(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      iat: Date.now(),
    }));
    const signature = btoa('mock-signature-not-secure');
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Get mock users from localStorage
   */
  getMockUsers(): Array<User & { password: string }> {
    if (typeof window === 'undefined') return []; // SSR safety
    const stored = localStorage.getItem(this.MOCK_USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save mock users to localStorage
   */
  private saveMockUsers(users: Array<User & { password: string }>): void {
    if (typeof window === 'undefined') return; // SSR safety
    localStorage.setItem(this.MOCK_USERS_KEY, JSON.stringify(users));
  }

  /**
   * Validate mock credentials
   */
  validateMockCredentials(email: string, password: string): User | null {
    const users = this.getMockUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) return null;

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Register a new user account
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    // Simulate network delay
    await this.delay();

    // Validate input
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists
    const users = this.getMockUsers();
    if (users.some(u => u.email === data.email)) {
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: this.generateMockUUID(),
      email: data.email,
    };

    // Store user with password
    users.push({ ...newUser, password: data.password });
    this.saveMockUsers(users);

    // Generate and store mock JWT
    const token = this.generateMockJWT(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.MOCK_TOKEN_KEY, token);
    }

    return { user: newUser, token };
  }

  /**
   * Authenticate an existing user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network delay
    await this.delay();

    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Validate credentials
    const user = this.validateMockCredentials(credentials.email, credentials.password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate and store mock JWT
    const token = this.generateMockJWT(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.MOCK_TOKEN_KEY, token);
    }

    return { user, token };
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    // Simulate network delay (shorter for logout)
    await this.delay(200);

    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.MOCK_TOKEN_KEY);
    }
  }

  /**
   * Get the current authentication token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null; // SSR safety
    return localStorage.getItem(this.MOCK_TOKEN_KEY);
  }

  /**
   * Get the currently authenticated user
   * Decodes the mock JWT token
   */
  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decode mock JWT payload (second part)
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));

      // Check expiration
      if (payload.exp && Date.now() > payload.exp) {
        // Token expired, clear it
        this.logout();
        return null;
      }

      return {
        id: payload.sub,
        email: payload.email,
      };
    } catch (error) {
      // Invalid token format
      console.error('Failed to decode mock JWT:', error);
      return null;
    }
  }

  /**
   * Check if a user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
