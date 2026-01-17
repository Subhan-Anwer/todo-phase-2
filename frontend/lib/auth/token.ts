// JWT Token Management Utilities

const TOKEN_KEY = 'token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export function isTokenExpired(token: string): boolean {
  try {
    // JWT format: header.payload.signature
    const payload = token.split('.')[1]
    if (!payload) return true

    const decoded = JSON.parse(atob(payload))
    const exp = decoded.exp

    if (!exp) return false

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}

export function isAuthenticated(): boolean {
  const token = getToken()
  if (!token) return false
  return !isTokenExpired(token)
}
