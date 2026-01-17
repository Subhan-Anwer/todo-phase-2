import React from 'react'

export interface CardProps {
  children: React.ReactNode
  elevated?: boolean
  className?: string
  onClick?: () => void
}

export function Card({ children, elevated = false, className = '', onClick }: CardProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className={`${elevated ? 'card-elevated' : 'card'} ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''
        }`}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-neutral-200 ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-neutral-200 ${className}`}>{children}</div>
}
