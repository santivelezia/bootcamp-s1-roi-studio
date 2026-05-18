'use client'

import { Card } from '@/components/ui/card'
import { KpiCell } from './kpi-cell'
import { SCENARIO_META, type ScenarioKey } from '@/lib/calc/scenarios'
import type { ScenarioResult } from '@/lib/calc/formulas'
import { formatCop, formatMultiplier } from '@/lib/utils'

interface ScenarioCardProps {
  scenarioKey: ScenarioKey
  result: ScenarioResult
  /** Marca visualmente el escenario "esperado" como referencia. */
  highlight?: boolean
}

export function ScenarioCard({ scenarioKey, result, highlight = false }: ScenarioCardProps) {
  const meta = SCENARIO_META[scenarioKey]
  const fteLabel = `${result.fteLiberados.toFixed(1)} FTE${result.fteLiberados >= 2 ? 's' : ''}`
  const paybackLabel =
    result.paybackMeses > 0 && result.paybackMeses < 60
      ? `${result.paybackMeses.toFixed(1)} meses`
      : '—'

  return (
    <Card
      className={`p-5 md:p-6 border-2 ${meta.tint} ${
        highlight ? 'ring-2 ring-orange-500/30' : ''
      }`}
      aria-label={`Escenario ${meta.label}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">{meta.emoji}</span>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{meta.label}</h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug">{meta.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <KpiCell
          label="Ahorro al año"
          value={formatCop(result.ahorroBrutoAnual)}
          hint={`${formatCop(result.ahorroBrutoMensual)}/mes`}
          emphasis
        />

        <div className="grid grid-cols-2 gap-4">
          <KpiCell
            label="ROI 12m"
            value={formatMultiplier(result.roi)}
            hint={paybackLabel + ' payback'}
          />
          <KpiCell label="FTEs liberados" value={fteLabel} hint={`${Math.round(result.horasAhorradasMes)} hrs/mes`} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <KpiCell label="Costo Claude/año" value={formatCop(result.costoClaudeAnual)} />
          <KpiCell label="Beneficio neto/año" value={formatCop(result.beneficioNetoAnual)} />
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <KpiCell label="Ahorro 3 años" value={formatCop(result.ahorroBruto3Anos)} />
        </div>
      </div>
    </Card>
  )
}
