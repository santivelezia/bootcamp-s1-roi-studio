/**
 * Fórmulas del ROI Studio · Brief S1
 *
 * Mantenemos las fórmulas en un solo archivo testeable.
 * Cada función es pura: misma entrada → misma salida. Sin side-effects.
 */

import type { DepartmentBaseline, DepartmentKey, IndustriaConfig } from './industries'

export const SEMANAS_POR_MES = 4.33
export const MESES_POR_ANO = 12
export const FTE_HORAS_SEMANA = 40 // 1 FTE = 40 horas/semana
export const FTE_HORAS_MES = FTE_HORAS_SEMANA * SEMANAS_POR_MES // 173.2

/** Horas/mes que el departamento gasta en tareas repetitivas. */
export function horasMesDepto(b: DepartmentBaseline): number {
  return b.horasSemana * SEMANAS_POR_MES
}

/** Costo/mes del departamento en tareas repetitivas (COP). */
export function costoMesDepto(b: DepartmentBaseline): number {
  return horasMesDepto(b) * b.empleados * b.costoHoraCop
}

/** Suma de horas/mes de todos los deptos. */
export function totalHorasMes(baselines: Record<DepartmentKey, DepartmentBaseline>): number {
  return Object.values(baselines).reduce((acc, b) => acc + horasMesDepto(b) * b.empleados, 0)
}

/** Costo bruto mensual del esfuerzo automatizable (COP). */
export function totalCostoMes(baselines: Record<DepartmentKey, DepartmentBaseline>): number {
  return Object.values(baselines).reduce((acc, b) => acc + costoMesDepto(b), 0)
}

export interface ScenarioInputs {
  /** Fracción de adopción · 0.5 = 50% del equipo adopta. */
  adopcion: number
  /** Fracción de efectividad · 0.7 = 70% del tiempo se ahorra realmente. */
  efectividad: number
}

export interface ScenarioResult {
  /** Horas/mes liberadas tras adopción + efectividad. */
  horasAhorradasMes: number
  /** Equivalente en FTEs liberados. */
  fteLiberados: number
  /** Ahorro bruto/mes (COP) · sin restar costo Claude. */
  ahorroBrutoMensual: number
  /** Ahorro bruto/año. */
  ahorroBrutoAnual: number
  /** Ahorro proyectado a 3 años. */
  ahorroBruto3Anos: number
  /** Costo Claude estimado/año (COP). */
  costoClaudeAnual: number
  /** Beneficio neto/año = ahorroBrutoAnual − costoClaudeAnual. */
  beneficioNetoAnual: number
  /** ROI a 12m como multiplicador · 4.2 = 4.2x. */
  roi: number
  /** Payback period en meses. */
  paybackMeses: number
}

export interface CalcInput {
  industria: IndustriaConfig
  baselines: Record<DepartmentKey, DepartmentBaseline>
  scenario: ScenarioInputs
  /** Costo Claude estimado mensual (COP). */
  costoClaudeMensual: number
}

/** Calcula los 6 KPIs del escenario para los baselines dados. */
export function calcularEscenario(input: CalcInput): ScenarioResult {
  const { industria, baselines, scenario, costoClaudeMensual } = input

  const horasBrutas = totalHorasMes(baselines)
  const costoBruto = totalCostoMes(baselines)

  // Ajuste por industria + adopción + efectividad
  const horasAhorradasMes =
    horasBrutas * scenario.adopcion * scenario.efectividad * industria.multiplicador
  const ahorroBrutoMensual =
    costoBruto * scenario.adopcion * scenario.efectividad * industria.multiplicador

  const fteLiberados = horasAhorradasMes / FTE_HORAS_MES

  const ahorroBrutoAnual = ahorroBrutoMensual * MESES_POR_ANO
  const ahorroBruto3Anos = ahorroBrutoAnual * 3

  const costoClaudeAnual = costoClaudeMensual * MESES_POR_ANO
  const beneficioNetoAnual = ahorroBrutoAnual - costoClaudeAnual

  const roi = costoClaudeAnual > 0 ? beneficioNetoAnual / costoClaudeAnual + 1 : 0

  // Payback: meses para que el ahorro acumulado pague el costo Claude acumulado.
  const ahorroMensualNeto = ahorroBrutoMensual - costoClaudeMensual
  const paybackMeses = ahorroMensualNeto > 0 ? costoClaudeMensual / ahorroMensualNeto : Infinity

  return {
    horasAhorradasMes,
    fteLiberados,
    ahorroBrutoMensual,
    ahorroBrutoAnual,
    ahorroBruto3Anos,
    costoClaudeAnual,
    beneficioNetoAnual,
    roi,
    paybackMeses: Number.isFinite(paybackMeses) ? paybackMeses : 0,
  }
}
