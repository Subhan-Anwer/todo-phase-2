'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export function Header() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authService.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API call fails, we still redirect to login
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="relative py-6 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-cream-50 to-cream-100 opacity-60" />
      <div className="relative max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sunset flex items-center justify-center animate-gradient">
            <span className="text-white text-xl font-bold">✓</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-warm-gray-900" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Task Journal
            </h1>
            <p className="text-xs text-warm-gray-600 italic">Your daily achievements</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="btn btn-ghost btn-small"
        >
          {isLoggingOut ? (
            <div className="flex items-center gap-2">
              <div className="spinner w-4 h-4 border-2" />
              <span>Logging out...</span>
            </div>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}
