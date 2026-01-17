import { SignupForm } from '@/components/auth/SignupForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account - Task Journal',
  description: 'Start your journey to mindful productivity',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <SignupForm />
    </div>
  )
}
