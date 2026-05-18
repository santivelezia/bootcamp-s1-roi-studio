/**
 * POST /api/analyze
 *
 * Streaming SSE con Claude Haiku 4.5 · análisis cualitativo del ROI.
 * El cliente envía los inputs + escenarios computados; Claude regresa
 * un análisis SCAFFOLD (Situación · Causa · Análisis · Foco · FAST · Outlook · Limitations · Decisión).
 *
 * - Edge runtime (TTFB < 200ms)
 * - Abort signal honorado · si el usuario cierra la pestaña la generación se cancela
 * - maxDuration 60s para conexión SSE
 */

import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { z } from 'zod'

export const runtime = 'edge'
export const maxDuration = 60

const Body = z.object({
  empresa: z.string().min(1).max(120),
  industria: z.enum(['A', 'B', 'C', 'D']),
  trm: z.number().positive(),
  totalEmpleadosAfectados: z.number().nonnegative(),
  ahorroEsperadoAnualCop: z.number().nonnegative(),
  costoClaudeAnualCop: z.number().nonnegative(),
  fteLiberadosEsperado: z.number().nonnegative(),
  roiEsperado: z.number(),
  paybackMesesEsperado: z.number(),
  departamentos: z
    .array(
      z.object({
        nombre: z.string(),
        empleados: z.number(),
        horasSemana: z.number(),
        costoHoraCop: z.number(),
      }),
    )
    .max(10),
})

const SYSTEM_PROMPT = `Eres un consultor financiero senior LATAM especializado en transformación con IA.
Acabas de leer los inputs del CFO de una empresa. Devuelve un análisis personalizado en español Colombia (~350 palabras) con esta estructura SCAFFOLD:

**Situación** · 1 párrafo: describe la empresa y el potencial detectado.
**Causa** · 1 párrafo: por qué los baselines actuales muestran ese gap (sé específico al sector).
**Análisis** · 1 párrafo con bullets: qué departamento muestra el ROI más alto y por qué.
**Foco** · 1 párrafo: por dónde empezar (el quick-win que cierra el caso de negocio).
**FAST** · una recomendación accionable concreta (Frequent, Ambitious, Specific, Transparent).
**Outlook** · proyección 3 años · honesta · 1 párrafo.
**Limitations** · 2-3 supuestos críticos del cálculo que el CFO debe validar.
**Decisión** · 1 frase tipo "Recomiendo X dentro de los próximos 30 días".

NUNCA inventes números: usa SOLO los del payload. Tono ejecutivo · sin emojis · sin disclaimers genéricos.`

export async function POST(req: Request): Promise<Response> {
  let parsed: z.infer<typeof Body>
  try {
    const json = (await req.json()) as unknown
    parsed = Body.parse(json)
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'bad_request',
        detail: err instanceof Error ? err.message : 'invalid json',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const userMessage = `EMPRESA: ${parsed.empresa}
INDUSTRIA: ${parsed.industria}
TRM aplicada: ${parsed.trm.toFixed(2)} COP/USD
Empleados afectados: ${parsed.totalEmpleadosAfectados}
Ahorro esperado/año: $${parsed.ahorroEsperadoAnualCop.toLocaleString('es-CO')} COP
Costo Claude esperado/año: $${parsed.costoClaudeAnualCop.toLocaleString('es-CO')} COP
FTEs liberados (esc. esperado): ${parsed.fteLiberadosEsperado.toFixed(1)}
ROI 12m: ${parsed.roiEsperado.toFixed(2)}x · Payback: ${parsed.paybackMesesEsperado.toFixed(1)} meses

Departamentos:
${parsed.departamentos.map(d => `- ${d.nombre}: ${d.empleados} emp · ${d.horasSemana} hrs/sem · $${d.costoHoraCop.toLocaleString('es-CO')}/hora`).join('\n')}

Devuelve el análisis SCAFFOLD para este caso específico.`

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
    abortSignal: req.signal,
    temperature: 0.4,
    maxOutputTokens: 1024,
  })

  return result.toTextStreamResponse({
    headers: { 'X-Smart4AI-Model': 'claude-haiku-4-5-20251001' },
  })
}
