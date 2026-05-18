'use client'

import { Sparkles } from 'lucide-react'
import { AuthButton } from '@/components/auth/auth-button'
import { PresenceIndicator } from '@/components/realtime/presence-indicator'

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <a href="/" className="inline-flex items-center gap-2 group" aria-label="Smart4AI ROI Studio · home">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
            <Sparkles size={16} aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">Smart4AI</span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">ROI Studio</span>
          </div>
        </a>
        <div className="flex items-center gap-3">
          <PresenceIndicator />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
