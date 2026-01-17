import type { Metadata } from 'next'
import './globals.css'
import { DevBanner } from '@/components/ui/DevBanner'

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple task management application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <DevBanner />
        {children}
      </body>
    </html>
  )
}
