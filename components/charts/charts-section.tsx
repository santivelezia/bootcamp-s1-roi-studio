'use client'

import { forwardRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartCapture, type ChartCaptureHandle } from '@/components/chart-capture'
import { SavingsBarChart } from './savings-bar-chart'
import { ClaudeCostChart } from './claude-cost-chart'
import { NetBenefitChart } from './net-benefit-chart'
import { useRoiResults } from '@/lib/calc/use-roi-results'

export interface ChartsSectionHandle {
  captureAll: () => Promise<{ savings: string; cost: string; net: string }>
}

interface Props {
  savingsRef?: React.RefObject<ChartCaptureHandle | null>
  costRef?: React.RefObject<ChartCaptureHandle | null>
  netRef?: React.RefObject<ChartCaptureHandle | null>
}

export const ChartsSection = forwardRef<HTMLDivElement, Props>(
  function ChartsSection({ savingsRef, costRef, netRef }, ref) {
    const results = useRoiResults()

    return (
      <section ref={ref} aria-label="Gráficas de proyección" className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Ahorro/año · 3 escenarios</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ChartCapture ref={savingsRef} className="bg-white p-2 rounded">
              <SavingsBarChart escenarios={results.escenarios} />
            </ChartCapture>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Costo Claude · 12 meses</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ChartCapture ref={costRef} className="bg-white p-2 rounded">
              <ClaudeCostChart costoMensual={results.costoClaudeMensual} />
            </ChartCapture>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Beneficio neto · escenario esperado</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ChartCapture ref={netRef} className="bg-white p-2 rounded">
              <NetBenefitChart
                ahorroMensual={results.escenarios.esperado.ahorroBrutoMensual}
                costoMensual={results.costoClaudeMensual}
              />
            </ChartCapture>
          </CardContent>
        </Card>
      </section>
    )
  },
)
