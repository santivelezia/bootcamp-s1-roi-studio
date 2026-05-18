'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import type { ScenarioKey } from '@/lib/calc/scenarios'
import { SCENARIO_META } from '@/lib/calc/scenarios'
import type { ScenarioResult } from '@/lib/calc/formulas'

const TINTS: Record<ScenarioKey, string> = {
  pesimista: '#F59E0B',
  esperado: '#0EA5E9',
  optimista: '#10B981',
}

interface Props {
  escenarios: Record<ScenarioKey, ScenarioResult>
}

export function SavingsBarChart({ escenarios }: Props) {
  const data = (Object.entries(escenarios) as Array<[ScenarioKey, ScenarioResult]>).map(([key, r]) => ({
    name: SCENARIO_META[key].label,
    key,
    ahorroAnual: Math.round(r.ahorroBrutoAnual / 1_000_000),
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
        <YAxis
          stroke="#71717a"
          fontSize={11}
          tickFormatter={v => `$${v}M`}
        />
        <Tooltip
          formatter={value => [`$${Number(value ?? 0).toLocaleString('es-CO')}M COP`, 'Ahorro/año']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e4e4e7', fontSize: 12 }}
        />
        <Bar dataKey="ahorroAnual" radius={[6, 6, 0, 0]}>
          {data.map(entry => (
            <Cell key={entry.key} fill={TINTS[entry.key]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
