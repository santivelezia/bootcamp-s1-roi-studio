import { describe, it, expect } from 'vitest'
import { calcularTresEscenarios, SCENARIO_PARAMS, SCENARIO_KEYS } from '@/lib/calc/scenarios'
import { getIndustria } from '@/lib/calc/industries'

describe('scenarios.ts', () => {
  it('los 3 escenarios tienen parámetros canónicos', () => {
    expect(SCENARIO_PARAMS.pesimista).toEqual({ adopcion: 0.5, efectividad: 0.6 })
    expect(SCENARIO_PARAMS.esperado).toEqual({ adopcion: 0.7, efectividad: 0.7 })
    expect(SCENARIO_PARAMS.optimista).toEqual({ adopcion: 0.9, efectividad: 0.8 })
  })

  it('optimista > esperado > pesimista en ahorro anual', () => {
    const industria = getIndustria('A')
    const baselines = industria.baselines
    const res = calcularTresEscenarios({
      industria,
      baselines,
      costoClaudeMensual: 500_000,
    })
    expect(res.optimista.ahorroBrutoAnual).toBeGreaterThan(res.esperado.ahorroBrutoAnual)
    expect(res.esperado.ahorroBrutoAnual).toBeGreaterThan(res.pesimista.ahorroBrutoAnual)
  })

  it('SCENARIO_KEYS exporta exactamente 3 claves', () => {
    expect(SCENARIO_KEYS).toEqual(['pesimista', 'esperado', 'optimista'])
  })
})
