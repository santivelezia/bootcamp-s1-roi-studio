import { describe, it, expect } from 'vitest'
import { estimarCostoClaudeMensual } from '@/lib/calc/claude-cost'

describe('claude-cost.ts', () => {
  it('costo es 0 si no hay empleados activos', () => {
    const r = estimarCostoClaudeMensual({ empleadosActivos: 0, trm: 4200 })
    expect(r.costoUsdMes).toBe(0)
    expect(r.costoCopMes).toBe(0)
  })

  it('costo aumenta linealmente con empleados', () => {
    const r10 = estimarCostoClaudeMensual({ empleadosActivos: 10, trm: 4200 })
    const r100 = estimarCostoClaudeMensual({ empleadosActivos: 100, trm: 4200 })
    expect(r100.costoUsdMes).toBeCloseTo(r10.costoUsdMes * 10, 0)
  })

  it('TRM más alta produce costoCopMes más alto', () => {
    const r4200 = estimarCostoClaudeMensual({ empleadosActivos: 50, trm: 4200 })
    const r5000 = estimarCostoClaudeMensual({ empleadosActivos: 50, trm: 5000 })
    expect(r5000.costoCopMes).toBeGreaterThan(r4200.costoCopMes)
  })
})
