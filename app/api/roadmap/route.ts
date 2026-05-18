/**
 * POST /api/roadmap
 *
 * Roadmap 90 días con Claude Sonnet 4.6 (no streaming · 1 call).
 * Output markdown estructurado · 3 fases · cada una con objetivos, acciones, KPIs.
 */

import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { z } from 'zod'

export const runtime = 'edge'
export const maxDuration = 60

const Body = z.object({
  empresa: z.string().min(1).max(120),
  industria: z.enum(['A', 'B', 'C', 'D']),
  totalEmpleadosAfectados: z.number().nonnegative(),
  ahorroEsperadoAnualCop: z.number().nonnegative(),
  topDepartamento: z.string().min(1),
})

const SYSTEM_PROMPT = `Eres un Engineering Lead que diseña roadmaps de implementación de IA para empresas LATAM.
Devuelve EXCLUSIVAMENTE markdown válido (sin envolver en bloques de código). Estructura obligatoria:

## Fase 1 · Días 1-30 · Quick wins
**Objetivo:** <una frase>
**Acciones concretas:**
- [ ] <acción 1>
- [ ] <acción 2>
- [ ] <acción 3>
**KPIs a medir:**
- <KPI 1> (baseline → target)
- <KPI 2>

## Fase 2 · Días 31-60 · Scaling
(misma estructura)

## Fase 3 · Días 61-90 · Optimization
(misma estructura)

## Próximos pasos
1. Una frase ejecutiva accionable.
2. Una segunda frase de seguimiento.

Adapta a la industria · sé concreto · español Colombia · sin emojis decorativos · sin disclaimers.`

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
Empleados afectados: ${parsed.totalEmpleadosAfectados}
Ahorro proyectado/año: $${parsed.ahorroEsperadoAnualCop.toLocaleString('es-CO')} COP
Departamento con mayor ROI: ${parsed.topDepartamento}

Diseña el roadmap 90 días.`

  const result = await generateText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
    temperature: 0.3,
    maxOutputTokens: 1500,
  })

  return new Response(
    JSON.stringify({ markdown: result.text }),
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Smart4AI-Model': 'claude-sonnet-4-6',
      },
    },
  )
}
