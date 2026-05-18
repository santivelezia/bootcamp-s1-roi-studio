'use client'

import { useCallback, useRef, useState } from 'react'
import { Sparkles, Square } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRoiResults } from '@/lib/calc/use-roi-results'
import { useRoiStore } from '@/lib/store/roi'
import { DEPARTMENT_LABELS, DEPARTMENT_KEYS } from '@/lib/calc/industries'

const COOLDOWN_MS = 10_000

export function AnalyzeButton() {
  const inputs = useRoiStore(s => s.inputs)
  const setAnalysisText = useRoiStore(s => s.setAnalysisText)
  const appendAnalysisText = useRoiStore(s => s.appendAnalysisText)
  const setAnalysisStreaming = useRoiStore(s => s.setAnalysisStreaming)
  const streaming = useRoiStore(s => s.ui.analysisStreaming)
  const results = useRoiResults()
  const controllerRef = useRef<AbortController | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const stop = useCallback(() => {
    controllerRef.current?.abort()
    setAnalysisStreaming(false)
  }, [setAnalysisStreaming])

  const run = useCallback(async () => {
    if (streaming) return
    if (cooldown > 0) {
      toast.info(`Espera ${cooldown}s para volver a analizar`)
      return
    }
    const body = {
      empresa: inputs.empresa || 'tu empresa',
      industria: inputs.industria,
      trm: inputs.trm,
      totalEmpleadosAfectados: results.totalEmpleados,
      ahorroEsperadoAnualCop: results.escenarios.esperado.ahorroBrutoAnual,
      costoClaudeAnualCop: results.costoClaudeAnual,
      fteLiberadosEsperado: results.escenarios.esperado.fteLiberados,
      roiEsperado: results.escenarios.esperado.roi,
      paybackMesesEsperado: results.escenarios.esperado.paybackMeses,
      departamentos: DEPARTMENT_KEYS.map(k => ({
        nombre: DEPARTMENT_LABELS[k],
        empleados: inputs.departments[k].empleados,
        horasSemana: inputs.departments[k].horasSemana,
        costoHoraCop: inputs.departments[k].costoHoraCop,
      })),
    }

    setAnalysisText('')
    setAnalysisStreaming(true)
    const controller = new AbortController()
    controllerRef.current = controller

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        appendAnalysisText(decoder.decode(value))
      }
      // Start cooldown
      setCooldown(COOLDOWN_MS / 1000)
      const intv = setInterval(() => {
        setCooldown(c => {
          if (c <= 1) {
            clearInterval(intv)
            return 0
          }
          return c - 1
        })
      }, 1000)
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        toast.info('Análisis detenido')
      } else {
        toast.error('No pude generar el análisis · intenta de nuevo')
        console.error('[analyze] error', err)
      }
    } finally {
      setAnalysisStreaming(false)
    }
  }, [streaming, cooldown, inputs, results, setAnalysisText, appendAnalysisText, setAnalysisStreaming])

  if (streaming) {
    return (
      <Button variant="outline" onClick={stop} className="w-full" size="lg">
        <Square size={16} aria-hidden="true" />
        Detener análisis
      </Button>
    )
  }

  return (
    <Button onClick={() => void run()} className="w-full" size="lg" disabled={cooldown > 0}>
      <Sparkles size={16} aria-hidden="true" />
      {cooldown > 0 ? `Espera ${cooldown}s` : 'Analizar con Claude'}
    </Button>
  )
}
