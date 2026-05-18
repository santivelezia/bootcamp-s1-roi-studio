import { describe, it, expect } from 'vitest'
import {
  DEPARTMENT_KEYS,
  DEPARTMENT_LABELS,
  INDUSTRIAS,
  getIndustria,
} from '@/lib/calc/industries'

describe('industries.ts', () => {
  it('las 4 industrias oficiales A/B/C/D existen', () => {
    expect(Object.keys(INDUSTRIAS)).toEqual(['A', 'B', 'C', 'D'])
  })

  it('cada industria tiene baselines completos de los 6 departamentos', () => {
    for (const letra of ['A', 'B', 'C', 'D'] as const) {
      const cfg = getIndustria(letra)
      for (const dept of DEPARTMENT_KEYS) {
        expect(cfg.baselines[dept]).toBeDefined()
        expect(cfg.baselines[dept].empleados).toBeGreaterThan(0)
        expect(cfg.baselines[dept].horasSemana).toBeGreaterThan(0)
        expect(cfg.baselines[dept].costoHoraCop).toBeGreaterThan(0)
      }
    }
  })

  it('los multiplicadores reflejan el brief (A=1.0 baseline, C=1.2 más eficiente)', () => {
    expect(INDUSTRIAS.A.multiplicador).toBe(1.0)
    expect(INDUSTRIAS.C.multiplicador).toBeGreaterThan(INDUSTRIAS.A.multiplicador)
    expect(INDUSTRIAS.B.multiplicador).toBeLessThan(INDUSTRIAS.A.multiplicador)
  })

  it('DEPARTMENT_LABELS está completo', () => {
    for (const k of DEPARTMENT_KEYS) {
      expect(DEPARTMENT_LABELS[k]).toBeTruthy()
    }
  })
})
