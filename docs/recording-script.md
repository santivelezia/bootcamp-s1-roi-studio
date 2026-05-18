# 🎬 Recording Script · Demo S1 · ROI Studio · 90 min

> Pixar Story Spine de 6 actos · marcadores de pausa · backup contingency R8.

---

## ACTO 1 · "Once upon a time…" (0:00 – 0:08 · 8 min)

**[CÁMARA ON · pantalla negra · logo Smart4AI fade-in]**

> **Santiago:** "Hace 10 años, cuando yo estaba en una empresa LATAM grande, mi CFO me pasó una hoja de Excel diciendo: '¿Cuánto nos ahorraría implementar inteligencia artificial?' Esa hoja terminó en el congelador. ¿Por qué? Porque era un número solo. Sin contexto. Sin escenarios. Sin plan."

**[Pantalla split: Excel feo a la izquierda vs ROI Studio a la derecha]**

> "Hoy, en 90 minutos, vamos a construir con Claude Code la calculadora de ROI que mi CFO de hace 10 años hubiera firmado. Y todos ustedes se la van a llevar como código abierto."

**[PAUSA 3 seg para que asimilen]**

**Pregunta a audiencia:** *"¿Cuántos de ustedes han tenido que justificar inversión en IA frente a un CFO o board? Comenten 1 si sí, 0 si todavía no."*

---

## ACTO 2 · "Every day…" (0:08 – 0:20 · 12 min)

**[Pantalla compartida · IDE con repo vacío]**

> **Santiago:** "Lo que el CFO necesita son tres cosas que la mayoría de calculadoras NO dan:
> 1. Escenarios (no un número)
> 2. Contexto LATAM (TRM, costos en COP)
> 3. Análisis cualitativo, no solo cuantitativo"

**[Mostrar Design Brief en Notion · 9 features]**

> "Acá está el Design Brief que escribí en un agente de IA. Son 9 features. Vamos a construirlas todas en 90 minutos con Claude Code."

**[`gh repo create santivelezia/bootcamp-s1-roi-studio --public`]**
**[`npx create-next-app@latest bootcamp-s1-roi-studio --typescript --tailwind --app`]**

> "Next.js 16, TypeScript strict, Tailwind 4. Esta es la base."

---

## ACTO 3 · "One day…" (0:20 – 0:45 · 25 min)

**[Construcción de inputs panel + escenarios + cálculos]**

> **Santiago:** "Lo primero: los inputs no son '¿cuántas horas?' como en cualquier calculadora. Son por departamento. Porque así piensa un CFO."

**[Live coding · 6 deptos colapsables · industry selector A/B/C/D]**

> "Cada industria tiene baselines diferentes. SaaS no es Retail. Lo escribo una vez, lo uso en 4 variantes."

**[Mostrar lib/calc/industries.ts]**

> "Y los cálculos: 3 escenarios simultáneos. Pesimista, Esperado, Optimista. Esto es lo que un CFO realmente necesita."

**[Pantalla muestra 3 columnas de KPIs · ROI, payback, FTEs]**

**[PAUSA 5 seg]**

**Pregunta:** *"¿Su CFO actual pensaría que estos números son útiles? Comenten 1 si los presentarían al board, 0 si no."*

---

## ACTO 4 · "Because of that…" (0:45 – 1:10 · 25 min) **★ WOW**

**[El momento WOW · streaming de Claude visible]**

> **Santiago:** "Acá viene la parte que va a sorprender. No vamos a darle solo números al CFO. Vamos a darle análisis. **En vivo.**"

**[Click "Analizar con Claude"]**
**[Las palabras de Claude empiezan a aparecer tipeadas]**

> "Lo que están viendo es Claude Haiku 4.5 analizando los inputs específicos de su empresa, generando un texto SCAFFOLD ejecutivo. No es texto canned. Lo está pensando ahora mismo."

**[Esperar a que termine ~25 seg]**

> "Y antes de que pregunten: 'pero Santiago, ¿esto es lento?' — miren el código del endpoint. 22 líneas. Vercel AI SDK 6. Streaming nativo de Edge."

**[Mostrar `app/api/analyze/route.ts`]**

**[Click "Generar Roadmap 90 días"]**
**[Render del roadmap markdown]**

> "Y este es Sonnet 4.6. Más potente. Le pedí estructura markdown con 3 fases. Sale así."

**[PAUSA 3 seg]**

**Pregunta:** *"¿Ven la diferencia? ¿Ahora sí se siente como un asesor real, no como una calculadora? 1 sí, 0 no."*

---

## ACTO 5 · "Until finally…" (1:10 – 1:25 · 15 min)

**[PDF + Realtime + share]**

> **Santiago:** "El CFO se lo lleva al board. Necesita papel. PDF brandeado."

**[Click "PDF Ejecutivo"]**
**[PDF descarga · abre con Acrobat]**

> "4 páginas. Portada Smart4AI. Tabla ejecutiva. Las 3 gráficas embebidas. Análisis IA completo. Roadmap. Todo server-side con `@react-pdf/renderer`."

**[Realtime · abrir 2 ventanas con `?s=demo123`]**
**[Cambiar input en una · ver actualización en la otra]**

> "Y si están en una sala con el CIO, ambos editan la misma simulación en tiempo real. Supabase Realtime con RLS. 12 líneas de hook."

**[Click "Compartir" · pegar en LinkedIn preview con OG image]**

> "Y cada simulación es contenido. OG image dinámica con Vercel OG. Lead magnet permanente."

---

## ACTO 6 · "And ever since…" (1:25 – 1:30 · 5 min)

> **Santiago:** "Ya vieron las 9 features. En menos de 90 minutos. Y los componentes son tan limpios que ustedes los pueden adaptar a su industria en una tarde."

**[Mostrar GitHub stars · 0 → ?]**

> "El repo es público. El link está en la descripción del live. **Fork it, adapt it, ship it.** Si lo usan, etiqueten a `@smart4ai` para verlo."

**[Mostrar el Notion '📊 Smart4AI Receipts']**

> "Y porque nosotros sí mostramos los recibos: este demo costó $X.XX USD construirlo. En vivo. Auditable. Nada de humo."

**[CTA al curso virtual]**

> "Lo que vieron hoy es 1 sesión del bootcamp. El curso virtual son 12 módulos así. Link en la descripción."

**[FIN · logo Smart4AI fade-out]**

---

## 🚨 [BACKUP · si demo falla en vivo] (R8 del brief)

Si Claude API rate-limit o Vercel deploy se cae mid-demo:

1. **Switch a video pregrabado** (`drive/02_Bootcamp/Demos screenshots/demo-s1-backup.mp4`)
2. **Santiago narra encima** del video: "El demo en vivo se está actualizando · acá grabé hace 1 hora la versión que ustedes van a clonar"
3. **NO recover live** · no pierde la energía buscando el bug

---

## Marcadores técnicos

- **Tiempo total:** 90 min · 5 min buffer
- **Tiempo entre stages:** ≤ 2 min cada uno
- **Pausas planeadas:** 3 (después de actos 1, 3, 4)
- **Preguntas a audiencia:** 3
- **Tests críticos en vivo:** PDF descarga · análisis streaming · 2 windows Realtime
- **NO en vivo:** Lighthouse, Playwright, tsc

---

## Recursos de apoyo

- Repo: https://github.com/santivelezia/bootcamp-s1-roi-studio
- Demo: https://bootcamp-s1-roi-studio.vercel.app
- Curso virtual: smart4ai.io/curso-virtual

---

*Recording script v1.0 · agente-demo-builder v0.2.1 · 2026-05-18*
