'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import type { RealtimePostgresUpdatePayload } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRoiStore, type RoiStore } from '@/lib/store/roi'

interface SessionRow {
  session_id: string
  state: { inputs?: RoiStore['inputs'] }
}

/**
 * Sincroniza el state.inputs entre clientes que abren el mismo `?s=<id>`.
 * Feature 7 del brief · degradable (R1): si Supabase Realtime falla,
 * la app sigue funcionando sin multi-user.
 *
 * Lógica simple:
 *  - Si `?s=<id>` aparece, este componente carga la fila s1_sessions y
 *    aplica `state.inputs` al store local.
 *  - Cualquier cambio local se persiste con debounce 800ms via upsert.
 *  - Se suscribe a UPDATE de la fila para recibir cambios de otros viewers.
 */
export function SessionSync() {
  const sp = useSearchParams()
  const sessionId = sp?.get('s') ?? null
  const setSessionId = useRoiStore(s => s.setSessionId)
  const lastRemoteRef = useRef<string>('')
  const skipNextLocalRef = useRef(false)

  useEffect(() => {
    if (!sessionId) return
    setSessionId(sessionId)
    const supabase = createClient()
    let mounted = true

    const applyRemote = (state: unknown) => {
      if (!state || typeof state !== 'object') return
      const inputs = (state as { inputs?: RoiStore['inputs'] }).inputs
      if (!inputs) return
      skipNextLocalRef.current = true
      useRoiStore.setState(s => ({ inputs: { ...s.inputs, ...inputs } }))
    }

    void (async () => {
      const { data } = await supabase
        .from('s1_sessions')
        .select('state')
        .eq('session_id', sessionId)
        .maybeSingle()
      if (!mounted) return
      if (data?.state) {
        lastRemoteRef.current = JSON.stringify(data.state)
        applyRemote(data.state)
      }
    })()

    const channel = supabase
      .channel(`session_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 's1_sessions',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: RealtimePostgresUpdatePayload<SessionRow>) => {
          const next = payload.new
          const incoming = JSON.stringify(next?.state ?? {})
          if (incoming === lastRemoteRef.current) return
          lastRemoteRef.current = incoming
          applyRemote(next?.state)
        },
      )
      .subscribe()

    // Debounced upsert del state local
    let timer: ReturnType<typeof setTimeout> | null = null
    const unsubscribeStore = useRoiStore.subscribe(state => {
      if (skipNextLocalRef.current) {
        skipNextLocalRef.current = false
        return
      }
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        void supabase.from('s1_sessions').upsert(
          {
            session_id: sessionId,
            state: { inputs: state.inputs },
          },
          { onConflict: 'session_id' },
        )
      }, 800)
    })

    return () => {
      mounted = false
      if (timer) clearTimeout(timer)
      unsubscribeStore()
      void supabase.removeChannel(channel)
    }
  }, [sessionId, setSessionId])

  return null
}
