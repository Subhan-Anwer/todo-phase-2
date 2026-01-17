'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/lib/auth'
import { validateEmail, validatePassword } from '@/lib/utils/validators'

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
  }>({})
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
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      await authService.signup({ email, password })
      router.push('/tasks')
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : 'Failed to create account. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12 items-center">
      {/* Signup Card - Left Column (reversed from login) */}
      <div className="card card-editorial animate-slide-up order-2 md:order-1">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-warm-gray-900 mb-2">Create Account</h2>
          <p className="text-warm-gray-700">Start your journey to mindful productivity</p>
        </div>

        {errors.general && (
          <div className="error-message mb-6 animate-slide-up">{errors.general}</div>
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
            {errors.email && <p className="text-sm text-error mt-2">{errors.email}</p>}
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
              placeholder="At least 8 characters"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-sm text-error mt-2">{errors.password}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Re-enter your password"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-error mt-2">{errors.confirmPassword}</p>
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
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="text-center pt-4 border-t border-warm-gray-300">
            <p className="text-warm-gray-700">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors underline decoration-2 underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Editorial Content - Right Column */}
      <div className="hidden md:block animate-slide-up order-1 md:order-2" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-sunset opacity-20 rounded-full blur-3xl" />
          <h1 className="relative text-display text-terracotta mb-6 leading-tight">
            Your productivity journey starts here
          </h1>
          <p className="text-xl text-warm-gray-700 mb-8 leading-relaxed">
            Join thousands of professionals who've transformed their task management from chaotic to calm.
          </p>
          <div className="bg-cream-100 p-6 rounded-2xl border-l-4 border-terracotta-500">
            <p className="text-editorial text-terracotta-700 text-lg">
              "This isn't just another todo app. It's a breath of fresh air in the world of productivity tools."
            </p>
            <p className="text-sm text-warm-gray-600 mt-3 font-medium">— Sarah Chen, Product Designer</p>
          </div>
        </div>
      </div>
    </div>
  )
}
