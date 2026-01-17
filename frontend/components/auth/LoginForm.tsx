'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/auth'
import { validateEmail } from '@/lib/utils/validators'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    // Validation
    const newErrors: typeof errors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      await authService.login({ email, password })
      router.push('/tasks')
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Invalid email or password. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12 items-center">
      {/* Editorial Content - Left Column */}
      <div className="hidden md:block animate-slide-up">
        <div className="relative">
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-sunset opacity-20 rounded-full blur-3xl" />
          <h1 className="relative text-display text-terracotta mb-6 leading-tight">
            Welcome back to your productive sanctuary
          </h1>
          <p className="editorial-quote text-warm-gray-700 mb-8">
            Where tasks transform into achievements, and to-dos become triumphs.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sunset flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-warm-gray-900">Mindful Organization</h4>
                <p className="text-sm text-warm-gray-700">Track what matters without the overwhelm</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sunset flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-warm-gray-900">Beautiful Simplicity</h4>
                <p className="text-sm text-warm-gray-700">An interface that inspires, not intimidates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Card - Right Column */}
      <div className="card card-editorial animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-warm-gray-900 mb-2">Sign In</h2>
          <p className="text-warm-gray-700">Continue your productivity journey</p>
        </div>

        {errors.general && (
          <div className="error-message mb-6 animate-slide-up">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              disabled={isSubmitting}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-error mt-2">{errors.email}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-sm text-error mt-2">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full btn-large"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="spinner w-5 h-5 border-2" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center pt-4 border-t border-warm-gray-300">
            <p className="text-warm-gray-700">
              New here?{' '}
              <Link
                href="/signup"
                className="font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors underline decoration-2 underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
