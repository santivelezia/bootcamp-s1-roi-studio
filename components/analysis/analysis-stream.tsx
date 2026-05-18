'use client'

import { useRoiStore } from '@/lib/store/roi'

/**
 * Display del streaming text que llega de /api/analyze.
 * Pre-wrap respeta saltos de línea del modelo · cursor parpadeante
 * mientras `streaming === true`.
 */
export function AnalysisStream() {
  const text = useRoiStore(s => s.ui.analysisText)
  const streaming = useRoiStore(s => s.ui.analysisStreaming)

  if (!text && !streaming) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400 italic">
        Pulsa <strong className="not-italic font-semibold">Analizar con Claude</strong> para recibir
        un análisis ejecutivo personalizado en tu caso específico.
      </div>
    )
  }

  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200"
      aria-live="polite"
      aria-atomic="false"
    >
      {text}
      {streaming ? <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse ml-0.5" /> : null}
    </div>
  )
}
