import { describe, it, expect } from 'vitest'
import {
  calcularEscenario,
  costoMesDepto,
  FTE_HORAS_MES,
  horasMesDepto,
} from '@/lib/calc/formulas'
import { getIndustria } from '@/lib/calc/industries'

describe('formulas.ts', () => {
  it('horasMesDepto multiplica horas/sem × 4.33', () => {
    expect(horasMesDepto({ empleados: 1, horasSemana: 10, costoHoraCop: 0 })).toBeCloseTo(43.3, 1)
  })

  it('costoMesDepto = horas × empleados × costo/hora', () => {
    const result = costoMesDepto({ empleados: 5, horasSemana: 10, costoHoraCop: 100_000 })
    expect(result).toBeCloseTo(5 * 10 * 4.33 * 100_000, 0)
  })

  it('FTE base es ~173 horas/mes', () => {
    expect(FTE_HORAS_MES).toBeCloseTo(173.2, 1)
  })

  it('calcularEscenario produce ahorros positivos con inputs razonables', () => {
    const industria = getIndustria('A')
    const baselines = industria.baselines
    const result = calcularEscenario({
      industria,
      baselines,
      scenario: { adopcion: 0.7, efectividad: 0.7 },
      costoClaudeMensual: 1_000_000,
    })
    expect(result.ahorroBrutoAnual).toBeGreaterThan(0)
    expect(result.fteLiberados).toBeGreaterThan(0)
    expect(result.roi).toBeGreaterThan(0)
  })

  it('payback es 0 si ahorroMensual ≤ costoClaude', () => {
    const industria = getIndustria('A')
    const result = calcularEscenario({
      industria,
      baselines: {
        ventas: { empleados: 0, horasSemana: 0, costoHoraCop: 0 },
        marketing: { empleados: 0, horasSemana: 0, costoHoraCop: 0 },
        operaciones: { empleados: 0, horasSemana: 0, costoHoraCop: 0 },
        soporte: { empleados: 0, horasSemana: 0, costoHoraCop: 0 },
        finanzas: { empleados: 0, horasSemana: 0, costoHoraCop: 0 },
        it: { empleados: 0, horasSemana: 0, costoHoraCop: 0 },
      },
      scenario: { adopcion: 1, efectividad: 1 },
      costoClaudeMensual: 1_000_000,
    })
    expect(result.paybackMeses).toBe(0)
  })
})
