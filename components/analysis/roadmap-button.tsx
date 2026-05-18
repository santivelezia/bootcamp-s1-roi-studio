'use client'

import { useCallback } from 'react'
import { Map } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useRoiResults } from '@/lib/calc/use-roi-results'
import { useRoiStore } from '@/lib/store/roi'

export function RoadmapButton() {
  const inputs = useRoiStore(s => s.inputs)
  const setRoadmapMarkdown = useRoiStore(s => s.setRoadmapMarkdown)
  const setRoadmapLoading = useRoiStore(s => s.setRoadmapLoading)
  const loading = useRoiStore(s => s.ui.roadmapLoading)
  const results = useRoiResults()

  const run = useCallback(async () => {
    if (loading) return
    setRoadmapMarkdown('')
    setRoadmapLoading(true)
    try {
      // Top department: el que más ahorra en escenario esperado (proxy: el de mayor empleados × horas × costo)
      const topDept = Object.entries(inputs.departments)
        .map(([k, v]) => [k, v.empleados * v.horasSemana * v.costoHoraCop] as const)
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'operaciones'

      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: inputs.empresa || 'tu empresa',
          industria: inputs.industria,
          totalEmpleadosAfectados: results.totalEmpleados,
          ahorroEsperadoAnualCop: results.escenarios.esperado.ahorroBrutoAnual,
          topDepartamento: topDept,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as { markdown: string }
      setRoadmapMarkdown(data.markdown)
      toast.success('Roadmap 90 días generado')
    } catch (err) {
      toast.error('No pude generar el roadmap · intenta de nuevo')
      console.error('[roadmap] error', err)
    } finally {
      setRoadmapLoading(false)
    }
  }, [loading, inputs, results, setRoadmapMarkdown, setRoadmapLoading])

  return (
    <Button onClick={() => void run()} variant="secondary" className="w-full" size="lg" disabled={loading}>
      <Map size={16} aria-hidden="true" />
      {loading ? 'Generando roadmap…' : 'Generar Roadmap 90 días'}
    </Button>
  )
}
