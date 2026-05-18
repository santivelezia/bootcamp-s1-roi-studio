import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Formatea un monto en COP sin decimales · ej. $1.234.567 COP */
export function formatCop(value: number): string {
  if (!Number.isFinite(value)) return '$0 COP'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Formatea un monto en USD con 0 decimales · ej. $12,500 */
export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Formatea un porcentaje con 1 decimal · ej. 12.4% */
export function formatPct(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '0%'
  return `${value.toFixed(decimals)}%`
}

/** Formatea un multiplicador · ej. 4.2x */
export function formatMultiplier(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '0x'
  return `${value.toFixed(decimals)}x`
}

/** Slug filename-safe sin acentos · "Tecno Latam SAS" → "tecno-latam-sas" */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
