/**
 * GET /api/og?empresa=X&monto=Y&industria=A
 *
 * Imagen Open Graph dinámica 1200x630.
 * Edge runtime · ImageResponse de @vercel/og.
 */

import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const INDUSTRIAS = {
  A: { label: 'Servicios profesionales', tint: '#FF6B35' },
  B: { label: 'E-commerce / Retail digital', tint: '#0EA5E9' },
  C: { label: 'SaaS / Tech', tint: '#8B5CF6' },
  D: { label: 'Educación / Infoproductos', tint: '#10B981' },
} as const

type IndustriaKey = keyof typeof INDUSTRIAS

function parseIndustria(raw: string | null): IndustriaKey {
  if (raw === 'A' || raw === 'B' || raw === 'C' || raw === 'D') return raw
  return 'A'
}

function parseMonto(raw: string | null): string {
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

function parseEmpresa(raw: string | null): string {
  if (!raw) return 'tu empresa'
  return raw.slice(0, 36)
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl
  const empresa = parseEmpresa(searchParams.get('empresa'))
  const monto = parseMonto(searchParams.get('monto'))
  const industria = parseIndustria(searchParams.get('industria'))
  const cfg = INDUSTRIAS[industria]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: `linear-gradient(135deg, #0B0F19 0%, #0B0F19 55%, ${cfg.tint}33 100%)`,
          color: '#FFFFFF',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              padding: '8px 16px',
              borderRadius: 999,
              backgroundColor: `${cfg.tint}33`,
              border: `1px solid ${cfg.tint}`,
              color: cfg.tint,
              fontSize: 22,
              letterSpacing: 1,
              fontWeight: 600,
            }}
          >
            {industria} · {cfg.label}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>SMART4AI</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 34, color: '#A1A1AA', fontWeight: 600 }}>
            Lo que {empresa} ahorraría con IA:
          </div>
          <div
            style={{
              fontSize: 120,
              lineHeight: 1,
              marginTop: 12,
              color: cfg.tint,
              fontWeight: 700,
            }}
          >
            {monto}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: '#A1A1AA',
            fontWeight: 600,
          }}
        >
          <span>Calcula el tuyo · ROI Studio · Smart4AI</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
