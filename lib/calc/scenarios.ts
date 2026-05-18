/**
 * Tres escenarios estándar del ROI Studio (Brief S1 Feature 2)
 *   Pesimista:  50% adopción × 60% efectividad
 *   Esperado:   70% adopción × 70% efectividad
 *   Optimista:  90% adopción × 80% efectividad
 */

import type { DepartmentBaseline, DepartmentKey, IndustriaConfig } from './industries'
import { calcularEscenario, type ScenarioInputs, type ScenarioResult } from './formulas'

export type ScenarioKey = 'pesimista' | 'esperado' | 'optimista'

export const SCENARIO_PARAMS: Record<ScenarioKey, ScenarioInputs> = {
  pesimista: { adopcion: 0.5, efectividad: 0.6 },
  esperado: { adopcion: 0.7, efectividad: 0.7 },
  optimista: { adopcion: 0.9, efectividad: 0.8 },
}

export const SCENARIO_META: Record<
  ScenarioKey,
  { label: string; emoji: string; tint: string; description: string }
> = {
  pesimista: {
    label: 'Pesimista',
    emoji: '🟠',
    tint: 'text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700',
    description: 'Adopción lenta · curva de aprendizaje compleja · 50% × 60%',
  },
  esperado: {
    label: 'Esperado',
    emoji: '🔵',
    tint: 'text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-700',
    description: 'Ritmo realista con champions internos · 70% × 70%',
  },
  optimista: {
    label: 'Optimista',
    emoji: '🟢',
    tint: 'text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700',
    description: 'Equipo digital nativo · governance fuerte · 90% × 80%',
  },
}

export const SCENARIO_KEYS: ScenarioKey[] = ['pesimista', 'esperado', 'optimista']

export function calcularTresEscenarios(args: {
  industria: IndustriaConfig
  baselines: Record<DepartmentKey, DepartmentBaseline>
  costoClaudeMensual: number
}): Record<ScenarioKey, ScenarioResult> {
  return {
    pesimista: calcularEscenario({ ...args, scenario: SCENARIO_PARAMS.pesimista }),
    esperado: calcularEscenario({ ...args, scenario: SCENARIO_PARAMS.esperado }),
    optimista: calcularEscenario({ ...args, scenario: SCENARIO_PARAMS.optimista }),
  }
}
