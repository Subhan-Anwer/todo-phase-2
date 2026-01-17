// Next.js Middleware for Route Protection

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '')

  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ['/tasks']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Auth routes (redirect to tasks if already authenticated)
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes to tasks
  if (isAuthRoute && token) {
    const tasksUrl = new URL('/tasks', request.url)
    return NextResponse.redirect(tasksUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tasks/:path*', '/login', '/signup'],
}
