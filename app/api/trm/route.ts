/**
 * GET /api/trm
 *
 * Devuelve la TRM USD-COP del día desde Datos Abiertos Colombia.
 * Cache 6 horas · fallback 4200 si la API falla.
 *
 * Fuente: https://www.datos.gov.co/resource/32sa-8pi3.json (oficial Banrep)
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'edge'

const TRM_SOURCE_URL =
  'https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde DESC'

const SIX_HOURS_SECONDS = 21_600
const FALLBACK_TRM = 4200

const SourceRow = z.object({
  valor: z.string().min(1),
  vigenciadesde: z.string().min(1),
})
const SourceResponse = z.array(SourceRow).min(1)

type NextFetchInit = RequestInit & {
  next?: { revalidate?: number; tags?: string[] }
}

export type TrmResponse = {
  value: number
  date: string
  source: 'banrep' | 'fallback'
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function buildFallback(reason: string): TrmResponse {
  console.error(`[trm] fallback · razón=${reason}`)
  return { value: FALLBACK_TRM, date: todayIso(), source: 'fallback' }
}

export async function GET(): Promise<NextResponse<TrmResponse>> {
  try {
    const init: NextFetchInit = {
      next: { revalidate: SIX_HOURS_SECONDS },
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Smart4AI-ROI-Studio/1.0',
      },
    }
    const res = await fetch(TRM_SOURCE_URL, init)
    if (!res.ok) return NextResponse.json(buildFallback(`http_${res.status}`))

    const raw = (await res.json()) as unknown
    const parsed = SourceResponse.safeParse(raw)
    if (!parsed.success) return NextResponse.json(buildFallback('schema'))

    const first = parsed.data[0]
    if (!first) return NextResponse.json(buildFallback('empty'))

    const value = Number(first.valor)
    if (!Number.isFinite(value) || value <= 0) {
      return NextResponse.json(buildFallback('bad_value'))
    }

    return NextResponse.json({
      value,
      date: first.vigenciadesde.slice(0, 10),
      source: 'banrep' as const,
    })
  } catch {
    return NextResponse.json(buildFallback('network'))
  }
}
