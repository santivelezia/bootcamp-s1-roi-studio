# 📊 Smart4AI · Calculadora ROI Empresarial con IA

> La única calculadora de ROI con IA que un CFO LATAM toma en serio.
> 3 escenarios cuantificados · análisis Claude en streaming · PDF ejecutivo en 90 segundos.

Construida en 90 minutos con **Claude Code** en el bootcamp RutaN sesión 1 · Smart4AI · 2026.

**Demo en vivo:** [bootcamp-s1-roi-studio.vercel.app](https://bootcamp-s1-roi-studio.vercel.app)

---

## 🚀 Quickstart 90 segundos

### Mac / Linux
```bash
git clone https://github.com/santivelezia/bootcamp-s1-roi-studio.git
cd bootcamp-s1-roi-studio
cp .env.local.example .env.local   # edita las 4 vars
./bootstrap.sh
```

### Windows (PowerShell)
```powershell
git clone https://github.com/santivelezia/bootcamp-s1-roi-studio.git
cd bootcamp-s1-roi-studio
Copy-Item .env.local.example .env.local   # edita las 4 vars
./bootstrap.ps1
```

El bootstrap instala dependencias, levanta el dev server y abre `localhost:3000` automáticamente.

---

## 🎯 Qué construimos

9 features CFO-grade, cero boilerplate:

| # | Feature | Stack |
|---|---|---|
| 1 | Inputs por departamento (6 deptos colapsables · 18 campos) | React + zustand |
| 2 | 3 escenarios simultáneos (Pesimista 50%×60% · Esperado 70%×70% · Optimista 90%×80%) | TypeScript + Tailwind |
| 3 | TRM en vivo desde Banco República + cache 6h | Next.js fetch · datos.gov.co |
| 4 | **Análisis Claude en streaming** (Haiku 4.5) | Vercel AI SDK 6 + `@ai-sdk/anthropic` |
| 5 | Roadmap 90 días (Sonnet 4.6) | `generateText` no streaming |
| 6 | PDF ejecutivo brandeado (4 páginas + QR) | `@react-pdf/renderer` 4.5 |
| 7 | **Supabase Realtime** multi-user con RLS | `@supabase/ssr` + presence |
| 8 | OG image dinámica 1200×630 | `@vercel/og` Edge runtime |
| 9 | Google login (opcional · degradable) | Supabase Auth |

---

## 🧱 Stack técnico

- **Next.js 16.2.6 App Router** · React 19.2 · TypeScript 5 strict
- **Tailwind CSS 4** + componentes UI propios (Base UI variant)
- **Supabase** `@supabase/ssr` + `supabase-js` · tablas con prefijo `s1_*` y RLS
- **Anthropic** via Vercel AI SDK · Haiku (streaming) + Sonnet (deep)
- **Charts** Recharts + `html-to-image` → embedded en PDF
- **Estado** zustand con slices + persist
- **Tests** Vitest (36 unit tests) + Playwright (1 happy path)

---

## 🛠 Variables de entorno

Necesitas 4 (todas en `.env.local` · template en `.env.local.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Sin Supabase: app funciona, Realtime + login degradados.
Sin Anthropic: `/analyze` y `/roadmap` fallan, el resto OK.

---

## 🗄 Supabase setup (one-time)

```sql
-- Pega supabase/migrations/20260518000000_s1_roi_studio.sql en
-- el SQL Editor del dashboard y dale Run.
```

Crea la tabla `s1_sessions` con RLS y la añade a `supabase_realtime` publication.

---

## 🧪 Tests

```bash
npm test            # 36 tests Vitest
npm run test:e2e    # 1 Playwright happy path
npm run typecheck   # tsc --noEmit · 0 errores garantizados
```

---

## 🚢 Deploy

```bash
vercel link
# añade las 4 env vars con `vercel env add` (production)
vercel --prod --yes
```

---

## 📐 Arquitectura

```
app/                      # Routes Next.js App Router
├── api/
│   ├── trm/      → Edge · cache 6h Banco República
│   ├── analyze/  → Edge · streaming Claude Haiku
│   ├── roadmap/  → Edge · Sonnet 4.6 generateText
│   ├── pdf/      → Node · @react-pdf/renderer · maxDuration 30s
│   └── og/       → Edge · ImageResponse 1200×630
├── auth/callback/route.ts
├── layout.tsx
├── page.tsx (ROI Studio main)
└── globals.css

components/               # Inputs · resultados · análisis · charts · share
lib/calc/                 # Fórmulas + industrias + escenarios + costo Claude
lib/store/roi.ts          # zustand · 2 slices · persist inputs
lib/supabase/             # client.ts (browser) + server.ts (RSC)
lib/pdf/roi-pdf.tsx       # @react-pdf/renderer · 4 páginas
supabase/migrations/      # SQL · prefijo s1_*
tests/                    # Vitest + Playwright
```

---

## 📜 License

MIT · libre para forkear y adaptar a tu empresa.
Si lo usas, etiquetá `@smart4ai` para saberlo.

---

*Construido en 90 min con Claude Code · agente-demo-builder v0.2.1 · 2026-05-18*
