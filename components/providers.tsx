'use client'

import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth/auth-provider'

interface ProvidersProps {
  children: ReactNode
  googleEnabled: boolean
}

export function Providers({ children, googleEnabled }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider googleEnabled={googleEnabled}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  )
}
