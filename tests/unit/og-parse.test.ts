import { describe, it, expect } from 'vitest'

/**
 * Tests del parsing de query params del endpoint /api/og.
 * Replicamos las funciones del route como helpers locales para que
 * el test no tenga que importar el route (Edge runtime no es testeable
 * en vitest sin extra setup).
 */
const INDUSTRIAS = ['A', 'B', 'C', 'D'] as const

function parseIndustria(raw: string | null) {
  if (raw && (INDUSTRIAS as readonly string[]).includes(raw)) return raw
  return 'A'
}

function parseMonto(raw: string | null) {
  if (!raw) return '$0'
  const n = Number(raw)
  if (Number.isFinite(n) && n > 0) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n)
  }
  return raw.slice(0, 40)
}

describe('OG parse helpers', () => {
  it('parseIndustria valida A/B/C/D', () => {
    expect(parseIndustria('A')).toBe('A')
    expect(parseIndustria('D')).toBe('D')
    expect(parseIndustria('X')).toBe('A')
    expect(parseIndustria(null)).toBe('A')
  })

  it('parseMonto formatea COP cuando recibe número', () => {
    const out = parseMonto('1234567')
    expect(out).toContain('1.234.567')
  })

  it('parseMonto retorna "$0" si no hay valor', () => {
    expect(parseMonto(null)).toBe('$0')
  })

  it('parseMonto trunca strings largos', () => {
    expect(parseMonto('not a number lorem ipsum dolor sit amet consectetur')).toHaveLength(40)
  })
})
