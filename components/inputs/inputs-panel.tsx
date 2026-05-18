'use client'

import { DEPARTMENT_KEYS } from '@/lib/calc/industries'
import { EmpresaInput } from './empresa-input'
import { IndustrySelector } from './industry-selector'
import { TrmInput } from './trm-input'
import { DepartmentSection } from './department-section'

export function InputsPanel() {
  return (
    <section aria-label="Configuración del cálculo" className="space-y-4">
      <EmpresaInput />
      <IndustrySelector />
      <TrmInput />
      <div className="pt-2 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Departamentos (6)
        </h2>
        {DEPARTMENT_KEYS.map(key => (
          <DepartmentSection key={key} deptKey={key} />
        ))}
      </div>
    </section>
  )
}
