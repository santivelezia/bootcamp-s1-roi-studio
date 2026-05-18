/**
 * Estimación de costo Claude mensual para el ROI del cliente.
 *
 * Modelo simple defendible frente a un CFO:
 *  - Asumimos 30 invocaciones/empleado/día (mensaje + respuesta)
 *  - Cada invocación: ~800 tokens input + ~500 tokens output (promedio negocio)
 *  - 22 días hábiles/mes
 *  - Modelo: Claude Haiku 4.5 (precio público 2026)
 *    Input  · $1.00 / 1M tokens
 *    Output · $5.00 / 1M tokens
 *
 * Si la empresa quiere Sonnet para casos complejos, multiplicar por ~10.
 * El cálculo prioriza "número conservador que no nos haga quedar mal"
 * cuando el CFO valida con su CIO.
 */

const HAIKU_INPUT_USD_PER_M = 1.0
const HAIKU_OUTPUT_USD_PER_M = 5.0

const INVOCACIONES_DIA = 30
const DIAS_HABILES_MES = 22
const TOKENS_INPUT = 800
const TOKENS_OUTPUT = 500

export interface ClaudeCostInput {
  /** Empleados que efectivamente usarán Claude/mes. */
  empleadosActivos: number
  /** TRM COP/USD aplicada para el reporte. */
  trm: number
}

export interface ClaudeCostBreakdown {
  invocacionesMes: number
  tokensInputMes: number
  tokensOutputMes: number
  costoUsdMes: number
  costoCopMes: number
}

export function estimarCostoClaudeMensual(input: ClaudeCostInput): ClaudeCostBreakdown {
  const { empleadosActivos, trm } = input

  const invocacionesMes = empleadosActivos * INVOCACIONES_DIA * DIAS_HABILES_MES
  const tokensInputMes = invocacionesMes * TOKENS_INPUT
  const tokensOutputMes = invocacionesMes * TOKENS_OUTPUT

  const costoUsdMes =
    (tokensInputMes / 1_000_000) * HAIKU_INPUT_USD_PER_M +
    (tokensOutputMes / 1_000_000) * HAIKU_OUTPUT_USD_PER_M

  const costoCopMes = costoUsdMes * trm

  return {
    invocacionesMes,
    tokensInputMes,
    tokensOutputMes,
    costoUsdMes,
    costoCopMes,
  }
}
