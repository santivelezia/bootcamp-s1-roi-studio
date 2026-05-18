<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md · Smart4AI ROI Studio · Bootcamp S1

## Sobre este repo

Construido en 90 min con Claude Code en bootcamp RutaN S1 de Smart4AI.
Demo deployable Next.js 16 + Supabase + Anthropic.

## Stack canónico (no cambiar sin razón fuerte)

- Next.js **16.2.6** · App Router · Turbopack default
- React **19.2.4** · TypeScript 5 strict + `noUncheckedIndexedAccess`
- Tailwind **4** (sin shadcn CLI · UI propios)
- Supabase: `@supabase/ssr` 0.10.3 + `supabase-js` 2.105.4 · tablas con prefijo `s1_*`
- Anthropic: `@ai-sdk/anthropic` 3.0.74 + `ai` 6.0.182
- AI SDK v6 usa `ModelMessage` (no `CoreMessage`) y `maxOutputTokens` (no `maxTokens`)
- `@react-pdf/renderer` 4.5.1 (Node runtime únicamente)
- `@vercel/og` 0.11.1 (Edge runtime)
- `recharts` 3.8.1 + `html-to-image` 1.11.13
- `zustand` 5.0.13 con slices + persist

## Convenciones

- Imports `@/*` resuelven al root del repo
- Files de UI propios en `components/ui/*` (no shadcn install)
- Hooks server data en `lib/`
- Tests en `tests/unit/*` (vitest) y `tests/e2e/*` (playwright)
- Tablas Supabase **siempre** con prefijo `s1_*` + RLS desde día 1

## Anti-patrones (no hacer)

- ❌ Usar `as any` o `@ts-ignore` (`tsc --noEmit` debe retornar 0)
- ❌ Tablas Supabase sin RLS
- ❌ `console.log` en código de producción (solo en boundaries)
- ❌ Crear `utils.ts` catch-all (separar por dominio)
- ❌ Big-bang commits (3-5 narrativos)
- ❌ Fetch en Edge sin manejar `signal.aborted`

## Comandos clave

```bash
npm run dev         # localhost:3000 con Turbopack
npm run typecheck   # tsc --noEmit · 0 errores
npm test            # 36 tests Vitest
npm run test:e2e    # 1 Playwright happy path
vercel --prod --yes # deploy
```

## Receipts

Construcción documentada en `📊 Smart4AI Receipts` de Notion.
Run ID: `s1_2026-05-18-build` · agente-demo-builder v0.2.1.
