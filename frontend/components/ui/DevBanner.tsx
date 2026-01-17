'use client'

import React, { useEffect, useState } from 'react'

export function DevBanner() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const isDev = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (!isDev) return

    const checkBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/v1/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000), // 3 second timeout
        })

        if (response.ok) {
          setBackendStatus('connected')
        } else {
          setBackendStatus('disconnected')
        }
      } catch (error) {
        setBackendStatus('disconnected')
      }
    }

    checkBackend()
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000)

    return () => clearInterval(interval)
  }, [isDev])

  // Only show in development mode
  if (!isDev) return null

  if (backendStatus === 'checking') {
    return (
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
        <p className="text-sm text-yellow-800">
          ⏳ Checking backend connection...
        </p>
      </div>
    )
  }

  if (backendStatus === 'disconnected') {
    return (
      <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-center">
        <p className="text-sm text-red-800 font-medium mb-1">
          ⚠️ Backend API is not running
        </p>
        <p className="text-xs text-red-700">
          Please start the backend server on{' '}
          <code className="bg-red-100 px-1 py-0.5 rounded">
            {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
          </code>
        </p>
      </div>
    )
  }

  if (backendStatus === 'connected') {
    return (
      <div className="bg-green-50 border-b border-green-200 px-4 py-2 text-center">
        <p className="text-sm text-green-800">
          ✓ Backend API connected
        </p>
      </div>
    )
  }

  return null
}
