'use client'

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface Props {
  ahorroMensual: number
  costoMensual: number
}

export function NetBenefitChart({ ahorroMensual, costoMensual }: Props) {
  const data = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1
    // Ramp-up del ahorro · 0% mes 1, 30% mes 2, 60% mes 3, 100% del 4 en adelante
    const ramp = monthNum === 1 ? 0 : monthNum === 2 ? 0.3 : monthNum === 3 ? 0.6 : 1.0
    const ahorro = (ahorroMensual * ramp) / 1_000_000
    const costo = (costoMensual * Math.min(1, ramp + 0.3)) / 1_000_000
    return {
      mes: `M${monthNum}`,
      ahorro: Math.round(ahorro),
      costo: Math.round(costo),
      neto: Math.round(ahorro - costo),
    }
  })

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
        <XAxis dataKey="mes" stroke="#71717a" fontSize={11} />
        <YAxis stroke="#71717a" fontSize={11} tickFormatter={v => `$${v}M`} />
        <Tooltip
          formatter={(value, name) => [`$${Number(value ?? 0)}M COP`, String(name)]}
          contentStyle={{ borderRadius: 8, border: '1px solid #e4e4e7', fontSize: 12 }}
        />
        <Area type="monotone" dataKey="ahorro" name="Ahorro" stroke="#10B981" fill="#10B98133" />
        <Line type="monotone" dataKey="costo" name="Costo Claude" stroke="#F97316" strokeWidth={2} />
        <Line type="monotone" dataKey="neto" name="Beneficio neto" stroke="#0EA5E9" strokeWidth={2.5} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
