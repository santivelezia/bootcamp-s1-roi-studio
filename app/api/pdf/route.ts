/**
 * POST /api/pdf
 *
 * Genera el PDF ejecutivo del ROI Studio.
 * Node runtime (no Edge) · @react-pdf/renderer requiere APIs Node.
 * maxDuration 30s · techo Hobby Free.
 *
 * Body: { empresa, fecha, industria, filas, charts, analisis, roadmap }
 * Returns: application/pdf con Content-Disposition attachment.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { Readable } from 'node:stream'
import { z } from 'zod'
import {
  buildPdfFilename,
  renderRoiPdf,
  type RoiPdfInput,
} from '@/lib/pdf/roi-pdf'

export const runtime = 'nodejs'
export const maxDuration = 30

const Body = z.object({
  empresa: z.string().min(1).max(160),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  industria: z.enum(['A', 'B', 'C', 'D']),
  filas: z
    .array(
      z.object({
        metrica: z.string(),
        pesimista: z.string(),
        esperado: z.string(),
        optimista: z.string(),
      }),
    )
    .max(20),
  charts: z
    .array(z.object({ caption: z.string(), dataUrl: z.string().startsWith('data:image/') }))
    .max(6),
  analisis: z.string().max(8000),
  roadmap: z.string().max(8000),
})

export async function POST(req: NextRequest): Promise<Response> {
  let input: RoiPdfInput
  try {
    const json = (await req.json()) as unknown
    input = Body.parse(json)
  } catch (err) {
    return NextResponse.json(
      { error: 'bad_request', detail: err instanceof Error ? err.message : 'invalid json' },
      { status: 400 },
    )
  }

  try {
    const stream = await renderRoiPdf(input)
    // Convertir Node Readable a Web ReadableStream para la Response.
    const webStream = Readable.toWeb(stream as Readable) as unknown as ReadableStream
    const filename = buildPdfFilename(input.empresa, input.fecha)
    return new Response(webStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[pdf] error', err)
    return NextResponse.json({ error: 'pdf_render_failed' }, { status: 500 })
  }
}
