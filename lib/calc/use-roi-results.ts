'use client'

import { useMemo } from 'react'
import { getIndustria } from './industries'
import { estimarCostoClaudeMensual } from './claude-cost'
import { calcularTresEscenarios, type ScenarioKey } from './scenarios'
import { useRoiStore } from '@/lib/store/roi'
import type { ScenarioResult } from './formulas'

export interface RoiResults {
  totalEmpleados: number
  totalHorasMes: number
  costoClaudeMensual: number
  costoClaudeAnual: number
  escenarios: Record<ScenarioKey, ScenarioResult>
}

/**
 * Hook puro que combina inputs del store con las fórmulas de lib/calc.
 * Recomputa solo cuando cambian inputs relevantes (memoizado).
 */
export function useRoiResults(): RoiResults {
  const industriaLetra = useRoiStore(s => s.inputs.industria)
  const departments = useRoiStore(s => s.inputs.departments)
  const trm = useRoiStore(s => s.inputs.trm)

  return useMemo(() => {
    const industria = getIndustria(industriaLetra)
    const totalEmpleados = Object.values(departments).reduce((acc, d) => acc + d.empleados, 0)
    const totalHorasMes = Object.values(departments).reduce(
      (acc, d) => acc + d.horasSemana * 4.33 * d.empleados,
      0,
    )

    const claudeCost = estimarCostoClaudeMensual({
      empleadosActivos: totalEmpleados,
      trm,
    })

    const escenarios = calcularTresEscenarios({
      industria,
      baselines: departments,
      costoClaudeMensual: claudeCost.costoCopMes,
    })

    return {
      totalEmpleados,
      totalHorasMes,
      costoClaudeMensual: claudeCost.costoCopMes,
      costoClaudeAnual: claudeCost.costoCopMes * 12,
      escenarios,
    }
  }, [industriaLetra, departments, trm])
}
