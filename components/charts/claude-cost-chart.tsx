'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Props {
  /** Costo Claude mensual estimado (COP). */
  costoMensual: number
}

export function ClaudeCostChart({ costoMensual }: Props) {
  // Proyección lineal simple a 12 meses · ramp-up 70/85/100% en Q1
  const data = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1
    const ramp = monthNum === 1 ? 0.5 : monthNum === 2 ? 0.7 : monthNum === 3 ? 0.85 : 1.0
    return {
      mes: `M${monthNum}`,
      costo: Math.round((costoMensual * ramp) / 1_000_000),
    }
  })

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis dataKey="mes" stroke="#71717a" fontSize={11} />
        <YAxis stroke="#71717a" fontSize={11} tickFormatter={v => `$${v}M`} />
        <Tooltip
          formatter={value => [`$${Number(value ?? 0)} M COP`, 'Costo Claude/mes']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e4e4e7', fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="costo"
          stroke="#FF6B35"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#FF6B35' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
