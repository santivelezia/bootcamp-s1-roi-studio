'use client'

import { useEffect, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { useRoiStore } from '@/lib/store/roi'
import type { TrmResponse } from '@/app/api/trm/route'

export function TrmInput() {
  const trm = useRoiStore(s => s.inputs.trm)
  const trmSource = useRoiStore(s => s.inputs.trmSource)
  const setTrm = useRoiStore(s => s.setTrm)
  const [date, setDate] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch('/api/trm', { cache: 'no-store' })
        const data = (await res.json()) as TrmResponse
        if (cancelled) return
        setTrm(data.value, data.source)
        setDate(data.date)
      } catch {
        if (!cancelled) setDate(new Date().toISOString().slice(0, 10))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [setTrm])

  const sourceLabel =
    trmSource === 'banrep' ? '✓ Banrep' : trmSource === 'manual' ? 'manual' : '⚠ estática'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="trm-slider" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          💱 TRM USD-COP
        </label>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {loading ? 'cargando…' : `${date} · ${sourceLabel}`}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Slider
          id="trm-slider"
          value={trm}
          min={3500}
          max={5500}
          step={5}
          onValueChange={v => setTrm(v, 'manual')}
          aria-label={`TRM USD-COP actual: ${trm}`}
        />
        <span className="tabular-nums text-sm font-semibold text-zinc-900 dark:text-zinc-100 w-20 text-right">
          ${trm.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  )
}
