'use client'

import { useCallback, useState } from 'react'
import { FileDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRoiStore } from '@/lib/store/roi'
import { useRoiResults } from '@/lib/calc/use-roi-results'
import { formatCop, formatMultiplier } from '@/lib/utils'
import type { ChartCaptureHandle } from '@/components/chart-capture'

interface PdfButtonProps {
  savingsRef: React.RefObject<ChartCaptureHandle | null>
  costRef: React.RefObject<ChartCaptureHandle | null>
  netRef: React.RefObject<ChartCaptureHandle | null>
}

export function PdfButton({ savingsRef, costRef, netRef }: PdfButtonProps) {
  const inputs = useRoiStore(s => s.inputs)
  const analisis = useRoiStore(s => s.ui.analysisText)
  const roadmap = useRoiStore(s => s.ui.roadmapMarkdown)
  const results = useRoiResults()
  const [loading, setLoading] = useState(false)

  const generate = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const charts: Array<{ caption: string; dataUrl: string }> = []
      try {
        if (savingsRef.current) charts.push({ caption: 'Ahorro/año · 3 escenarios (COP M)', dataUrl: await savingsRef.current.capture() })
        if (costRef.current) charts.push({ caption: 'Costo Claude · 12 meses (COP M)', dataUrl: await costRef.current.capture() })
        if (netRef.current) charts.push({ caption: 'Beneficio neto · escenario esperado', dataUrl: await netRef.current.capture() })
      } catch (err) {
        console.warn('[pdf] no pude capturar gráficas · seguimos sin ellas', err)
      }

      const pes = results.escenarios.pesimista
      const esp = results.escenarios.esperado
      const opt = results.escenarios.optimista

      const filas = [
        { metrica: 'Ahorro al año',     pesimista: formatCop(pes.ahorroBrutoAnual),     esperado: formatCop(esp.ahorroBrutoAnual),     optimista: formatCop(opt.ahorroBrutoAnual) },
        { metrica: 'Ahorro a 3 años',   pesimista: formatCop(pes.ahorroBruto3Anos),     esperado: formatCop(esp.ahorroBruto3Anos),     optimista: formatCop(opt.ahorroBruto3Anos) },
        { metrica: 'Costo Claude/año',  pesimista: formatCop(pes.costoClaudeAnual),     esperado: formatCop(esp.costoClaudeAnual),     optimista: formatCop(opt.costoClaudeAnual) },
        { metrica: 'Beneficio neto/año',pesimista: formatCop(pes.beneficioNetoAnual),   esperado: formatCop(esp.beneficioNetoAnual),   optimista: formatCop(opt.beneficioNetoAnual) },
        { metrica: 'ROI 12m',           pesimista: formatMultiplier(pes.roi),            esperado: formatMultiplier(esp.roi),            optimista: formatMultiplier(opt.roi) },
        { metrica: 'Payback (meses)',   pesimista: pes.paybackMeses.toFixed(1),          esperado: esp.paybackMeses.toFixed(1),          optimista: opt.paybackMeses.toFixed(1) },
        { metrica: 'FTEs liberados',    pesimista: pes.fteLiberados.toFixed(1),          esperado: esp.fteLiberados.toFixed(1),          optimista: opt.fteLiberados.toFixed(1) },
      ]

      const today = new Date().toISOString().slice(0, 10)

      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: inputs.empresa || 'tu empresa',
          fecha: today,
          industria: inputs.industria,
          filas,
          charts,
          analisis: analisis || 'Genera el análisis IA antes de exportar el PDF para incluir interpretación cualitativa.',
          roadmap: roadmap || '',
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ROI-Smart4AI-${(inputs.empresa || 'empresa').replace(/[^a-z0-9]+/gi, '-')}-${today}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('PDF descargado')
    } catch (err) {
      toast.error('No pude generar el PDF')
      console.error('[pdf] error', err)
    } finally {
      setLoading(false)
    }
  }, [loading, inputs, results, analisis, roadmap, savingsRef, costRef, netRef])

  return (
    <Button onClick={() => void generate()} variant="secondary" className="w-full" size="lg" disabled={loading}>
      <FileDown size={16} aria-hidden="true" />
      {loading ? 'Generando PDF…' : 'PDF Ejecutivo'}
    </Button>
  )
}
