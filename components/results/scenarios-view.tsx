'use client'

import { ScenarioCard } from './scenario-card'
import { SCENARIO_KEYS } from '@/lib/calc/scenarios'
import { useRoiResults } from '@/lib/calc/use-roi-results'

export function ScenariosView() {
  const results = useRoiResults()
  return (
    <section aria-label="3 escenarios" className="grid gap-4 md:grid-cols-3">
      {SCENARIO_KEYS.map(key => (
        <ScenarioCard
          key={key}
          scenarioKey={key}
          result={results.escenarios[key]}
          highlight={key === 'esperado'}
        />
      ))}
    </section>
  )
}
