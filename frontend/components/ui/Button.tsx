import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  }

  return (
    <button
      className={`${variantClasses[variant]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
