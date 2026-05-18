'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRoiStore } from '@/lib/store/roi'

/**
 * Indicador "🟢 N viendo" via Supabase Realtime presence channel.
 * Si el canal falla (Realtime no disponible · Brief R1), no se muestra nada.
 */
export function PresenceIndicator() {
  const sessionId = useRoiStore(s => s.ui.sessionId)
  const [count, setCount] = useState(0)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    if (!sessionId) {
      setCount(0)
      return
    }
    const supabase = createClient()
    const userKey = `viewer_${Math.random().toString(36).slice(2, 10)}`
    const channel = supabase.channel(`presence_${sessionId}`, {
      config: { presence: { key: userKey } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState()
          setCount(Object.keys(state).length)
        } catch {
          setAvailable(false)
        }
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          try {
            await channel.track({ joinedAt: new Date().toISOString() })
          } catch {
            setAvailable(false)
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setAvailable(false)
        }
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [sessionId])

  if (!available || count < 2) return null

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span>{count} viendo</span>
    </div>
  )
}
