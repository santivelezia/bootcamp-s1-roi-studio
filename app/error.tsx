'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[error-boundary]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <div className="text-6xl" aria-hidden="true">⚠️</div>
        <h1 className="text-xl font-bold">Algo se rompió</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Ya tenemos el log. Mientras tanto, reintenta o vuelve al inicio.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => reset()}>Reintentar</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}
