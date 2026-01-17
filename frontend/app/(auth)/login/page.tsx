import { LoginForm } from '@/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Task Journal',
  description: 'Sign in to your productive sanctuary',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <LoginForm />
    </div>
  )
}
