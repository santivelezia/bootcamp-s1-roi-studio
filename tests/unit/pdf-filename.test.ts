import { describe, it, expect } from 'vitest'
import { buildPdfFilename } from '@/lib/pdf/roi-pdf'

describe('buildPdfFilename', () => {
  it('produce filename con slug + fecha', () => {
    expect(buildPdfFilename('Tecno Latam SAS', '2026-05-18')).toBe(
      'ROI-Smart4AI-tecno-latam-sas-2026-05-18.pdf',
    )
  })

  it('normaliza acentos', () => {
    expect(buildPdfFilename('Café Ñoñería', '2026-05-18')).toContain('cafe-noneria')
  })

  it('fallback a "empresa" si nombre está vacío', () => {
    expect(buildPdfFilename('', '2026-05-18')).toBe('ROI-Smart4AI-empresa-2026-05-18.pdf')
  })
})
