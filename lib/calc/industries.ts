/**
 * Smart4AI · industrias oficiales para el ROI Studio (Brief S1)
 *
 * Las 4 industrias del programa Claude For Devs · CLAUDE.md restricción 5.
 * Nunca usar Manufactura · Banca · Salud · Inmobiliario · Hospitality.
 *
 * Los baselines describen una empresa "promedio" de la industria.
 * Cuando el usuario selecciona la industria, los inputs de los 6 deptos
 * se auto-completan con estos valores (puede editarlos manualmente).
 */

export type Industria = 'A' | 'B' | 'C' | 'D'

export interface DepartmentBaseline {
  /** Número de empleados promedio del departamento. */
  empleados: number
  /** Horas/semana del equipo en tareas repetitivas automatizables. */
  horasSemana: number
  /** Costo por hora promedio del departamento (COP). */
  costoHoraCop: number
}

export type DepartmentKey =
  | 'ventas'
  | 'marketing'
  | 'operaciones'
  | 'soporte'
  | 'finanzas'
  | 'it'

export interface IndustriaConfig {
  letra: Industria
  nombre: string
  ejemploEmpresa: string
  /** Multiplicador de eficiencia IA vs servicios profesionales (baseline A=1.0). */
  multiplicador: number
  baselines: Record<DepartmentKey, DepartmentBaseline>
}

const COP_USD_BASELINE = 4200 // TRM de referencia para construir baselines

export const INDUSTRIAS: Record<Industria, IndustriaConfig> = {
  A: {
    letra: 'A',
    nombre: 'Servicios profesionales',
    ejemploEmpresa: 'Consultoría, agencia, legal, contabilidad',
    multiplicador: 1.0,
    baselines: {
      ventas: { empleados: 6, horasSemana: 12, costoHoraCop: 75 * COP_USD_BASELINE },
      marketing: { empleados: 4, horasSemana: 18, costoHoraCop: 55 * COP_USD_BASELINE },
      operaciones: { empleados: 8, horasSemana: 20, costoHoraCop: 45 * COP_USD_BASELINE },
      soporte: { empleados: 5, horasSemana: 22, costoHoraCop: 35 * COP_USD_BASELINE },
      finanzas: { empleados: 3, horasSemana: 14, costoHoraCop: 65 * COP_USD_BASELINE },
      it: { empleados: 3, horasSemana: 10, costoHoraCop: 80 * COP_USD_BASELINE },
    },
  },
  B: {
    letra: 'B',
    nombre: 'E-commerce / Retail digital',
    ejemploEmpresa: 'Tienda online, marketplace, retail omnichannel',
    multiplicador: 0.85,
    baselines: {
      ventas: { empleados: 12, horasSemana: 15, costoHoraCop: 40 * COP_USD_BASELINE },
      marketing: { empleados: 8, horasSemana: 22, costoHoraCop: 50 * COP_USD_BASELINE },
      operaciones: { empleados: 18, horasSemana: 25, costoHoraCop: 30 * COP_USD_BASELINE },
      soporte: { empleados: 14, horasSemana: 28, costoHoraCop: 28 * COP_USD_BASELINE },
      finanzas: { empleados: 3, horasSemana: 12, costoHoraCop: 60 * COP_USD_BASELINE },
      it: { empleados: 4, horasSemana: 12, costoHoraCop: 70 * COP_USD_BASELINE },
    },
  },
  C: {
    letra: 'C',
    nombre: 'SaaS / Tech',
    ejemploEmpresa: 'Startup SaaS, fintech, platform',
    multiplicador: 1.2,
    baselines: {
      ventas: { empleados: 4, horasSemana: 10, costoHoraCop: 90 * COP_USD_BASELINE },
      marketing: { empleados: 3, horasSemana: 14, costoHoraCop: 80 * COP_USD_BASELINE },
      operaciones: { empleados: 5, horasSemana: 12, costoHoraCop: 75 * COP_USD_BASELINE },
      soporte: { empleados: 6, horasSemana: 18, costoHoraCop: 60 * COP_USD_BASELINE },
      finanzas: { empleados: 2, horasSemana: 8, costoHoraCop: 85 * COP_USD_BASELINE },
      it: { empleados: 8, horasSemana: 14, costoHoraCop: 100 * COP_USD_BASELINE },
    },
  },
  D: {
    letra: 'D',
    nombre: 'Educación / Infoproductos',
    ejemploEmpresa: 'Bootcamp, academia online, info-producto',
    multiplicador: 0.95,
    baselines: {
      ventas: { empleados: 5, horasSemana: 14, costoHoraCop: 50 * COP_USD_BASELINE },
      marketing: { empleados: 6, horasSemana: 20, costoHoraCop: 55 * COP_USD_BASELINE },
      operaciones: { empleados: 4, horasSemana: 16, costoHoraCop: 40 * COP_USD_BASELINE },
      soporte: { empleados: 7, horasSemana: 24, costoHoraCop: 32 * COP_USD_BASELINE },
      finanzas: { empleados: 2, horasSemana: 10, costoHoraCop: 60 * COP_USD_BASELINE },
      it: { empleados: 3, horasSemana: 10, costoHoraCop: 75 * COP_USD_BASELINE },
    },
  },
}

export const DEPARTMENT_LABELS: Record<DepartmentKey, string> = {
  ventas: 'Ventas',
  marketing: 'Marketing',
  operaciones: 'Operaciones',
  soporte: 'Atención al cliente',
  finanzas: 'Finanzas',
  it: 'IT',
}

export const DEPARTMENT_ICONS: Record<DepartmentKey, string> = {
  ventas: '💼',
  marketing: '📣',
  operaciones: '⚙️',
  soporte: '🎧',
  finanzas: '💰',
  it: '🖥️',
}

export const DEPARTMENT_KEYS: DepartmentKey[] = [
  'ventas',
  'marketing',
  'operaciones',
  'soporte',
  'finanzas',
  'it',
]

export function getIndustria(letra: Industria): IndustriaConfig {
  return INDUSTRIAS[letra]
}
