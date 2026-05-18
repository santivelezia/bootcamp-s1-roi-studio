'use client'

import { useCallback } from 'react'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRoiStore } from '@/lib/store/roi'
import { useRoiResults } from '@/lib/calc/use-roi-results'

export function ShareButton() {
  const inputs = useRoiStore(s => s.inputs)
  const sessionId = useRoiStore(s => s.ui.sessionId)
  const setSessionId = useRoiStore(s => s.setSessionId)
  const results = useRoiResults()

  const share = useCallback(async () => {
    try {
      let sid = sessionId
      if (!sid) {
        sid = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? crypto.randomUUID()
          : `s-${Math.random().toString(36).slice(2, 14)}`
        setSessionId(sid)
      }
      const url = new URL(window.location.href)
      url.searchParams.set('s', sid)
      const ahorro = Math.round(results.escenarios.esperado.ahorroBrutoAnual)
      const ogUrl = new URL('/api/og', window.location.origin)
      ogUrl.searchParams.set('empresa', inputs.empresa || 'tu empresa')
      ogUrl.searchParams.set('monto', String(ahorro))
      ogUrl.searchParams.set('industria', inputs.industria)
      await navigator.clipboard.writeText(url.toString())
      toast.success('Link copiado · listo para compartir', {
        description: 'Pegalo en LinkedIn, WhatsApp o X para ver la preview brandeada.',
      })
    } catch {
      toast.error('No pude copiar el link')
    }
  }, [sessionId, setSessionId, inputs, results])

  return (
    <Button onClick={() => void share()} variant="outline" className="w-full" size="lg">
      <Share2 size={16} aria-hidden="true" />
      Compartir
    </Button>
  )
}
