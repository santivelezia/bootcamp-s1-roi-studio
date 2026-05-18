import { describe, it, expect } from 'vitest'
import { formatCop, formatMultiplier, formatPct, formatUsd, slugify } from '@/lib/utils'

describe('utils.ts', () => {
  it('formatCop formatea con $ y separadores español Colombia', () => {
    expect(formatCop(1234567)).toContain('1.234.567')
  })

  it('formatCop maneja NaN/Infinity', () => {
    expect(formatCop(NaN)).toBe('$0 COP')
    expect(formatCop(Infinity)).toBe('$0 COP')
  })

  it('formatUsd produce USD con $', () => {
    expect(formatUsd(12_500)).toContain('$')
    expect(formatUsd(12_500)).toContain('12,500')
  })

  it('formatPct usa 1 decimal por default', () => {
    expect(formatPct(12.456)).toBe('12.5%')
  })

  it('formatMultiplier muestra "x"', () => {
    expect(formatMultiplier(4.234)).toBe('4.2x')
  })

  it('slugify normaliza acentos y espacios', () => {
    expect(slugify('Café Ñoñería SAS')).toBe('cafe-noneria-sas')
  })
})
