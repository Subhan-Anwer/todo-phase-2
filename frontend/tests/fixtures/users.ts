/**
 * Test Fixtures: Mock Users
 *
 * Provides consistent mock user data for testing authentication flows.
 * These fixtures simulate the data structure expected from MockAuthService.
 */

import type { User, AuthResponse } from '@/types/auth';

/**
 * Mock user for testing - Test User 1
 */
export const mockUser1: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
};

/**
 * Mock user for testing - Test User 2
 */
export const mockUser2: User = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'john@example.com',
};

/**
 * Mock user for testing - Admin User
 */
export const mockAdminUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440002',
  email: 'admin@example.com',
};

/**
 * Generate a mock JWT token for testing
 * Note: This is a simplified base64-encoded token, NOT cryptographically secure
 */
export function generateMockToken(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

/**
 * Mock auth response for successful login/signup
 */
export const mockAuthResponse1: AuthResponse = {
  user: mockUser1,
  token: generateMockToken(mockUser1),
};

/**
 * Mock auth response for user 2
 */
export const mockAuthResponse2: AuthResponse = {
  user: mockUser2,
  token: generateMockToken(mockUser2),
};

/**
 * Mock credentials for login tests
 */
export const mockCredentials = {
  user1: {
    email: 'test@example.com',
    password: 'password123',
  },
  user2: {
    email: 'john@example.com',
    password: 'securepass456',
  },
  admin: {
    email: 'admin@example.com',
    password: 'adminpass789',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

/**
 * Mock users stored in localStorage format
 * Simulates MockAuthService internal storage
 */
export const mockStoredUsers = [
  {
    ...mockUser1,
    password: mockCredentials.user1.password,
  },
  {
    ...mockUser2,
    password: mockCredentials.user2.password,
  },
  {
    ...mockAdminUser,
    password: mockCredentials.admin.password,
  },
];
