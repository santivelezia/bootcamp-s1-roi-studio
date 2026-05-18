import { describe, it, expect } from 'vitest'
import {
  formatCop,
  formatCopCompact,
  formatMultiplier,
  formatPct,
  formatUsd,
  slugify,
} from '@/lib/utils'

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

describe('formatCopCompact', () => {
  it('compacta a millones con 1 decimal (caso del bug)', () => {
    // El bug reportado: $47.920.200 desbordaba la celda
    expect(formatCopCompact(47_920_200)).toBe('$47.9M')
  })

  it('compacta otro valor del bug · $1.789.938 → $1.8M', () => {
    expect(formatCopCompact(1_789_938)).toBe('$1.8M')
  })

  it('compacta a billones con 2 decimales · $5.369.816.592 → $5.37B', () => {
    expect(formatCopCompact(5_369_816_592)).toBe('$5.37B')
  })

  it('compacta a miles · $3.366 → $3.4K', () => {
    expect(formatCopCompact(3_366)).toBe('$3.4K')
  })

  it('valores < 1K se muestran sin sufijo · $500', () => {
    expect(formatCopCompact(500)).toBe('$500')
  })

  it('cero retorna "$0"', () => {
    expect(formatCopCompact(0)).toBe('$0')
  })

  it('NaN e Infinity son seguros (graceful fallback)', () => {
    expect(formatCopCompact(NaN)).toBe('$0')
    expect(formatCopCompact(Infinity)).toBe('$0')
    expect(formatCopCompact(-Infinity)).toBe('$0')
  })

  it('negativos preservan el signo', () => {
    expect(formatCopCompact(-1_500_000)).toBe('-$1.5M')
  })
})
