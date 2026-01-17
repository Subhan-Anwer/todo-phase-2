/**
 * Global Error Boundary
 *
 * Catches and displays errors that occur during rendering.
 * Constitution v1.2.0 Compliance: Error Handling Standards
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);

    // In production, you would log to an error reporting service
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>

        {/* Error Message */}
        <p className="text-gray-600 mb-6">
          {process.env.NODE_ENV === 'development' ? (
            <>
              <span className="block font-medium mb-1">Error details:</span>
              <span className="block text-sm text-red-600 font-mono">
                {error.message}
              </span>
              {error.digest && (
                <span className="block text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </span>
              )}
            </>
          ) : (
            'An unexpected error occurred. Please try again or contact support if the problem persists.'
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="secondary"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
