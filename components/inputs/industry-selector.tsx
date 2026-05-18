'use client'

import { INDUSTRIAS, type Industria } from '@/lib/calc/industries'
import { useRoiStore } from '@/lib/store/roi'

const INDUSTRIA_ORDER: Industria[] = ['A', 'B', 'C', 'D']

export function IndustrySelector() {
  const industria = useRoiStore(s => s.inputs.industria)
  const setIndustria = useRoiStore(s => s.setIndustria)

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">🏢 Industria</legend>
      <div role="radiogroup" aria-label="Selecciona la industria" className="grid grid-cols-2 gap-2">
        {INDUSTRIA_ORDER.map(letra => {
          const cfg = INDUSTRIAS[letra]
          const active = industria === letra
          return (
            <button
              key={letra}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setIndustria(letra)}
              className={`text-left rounded-lg border px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                active
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30'
                  : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900'
              }`}
            >
              <div className={`text-xs font-bold ${active ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                {letra}
              </div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-tight mt-0.5">{cfg.nombre}</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">{cfg.ejemploEmpresa}</div>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
