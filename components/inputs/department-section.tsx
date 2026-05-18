'use client'

import { ChevronDown } from 'lucide-react'
import {
  DEPARTMENT_ICONS,
  DEPARTMENT_LABELS,
  type DepartmentKey,
} from '@/lib/calc/industries'
import { useRoiStore } from '@/lib/store/roi'
import { formatCop } from '@/lib/utils'

interface DepartmentSectionProps {
  deptKey: DepartmentKey
}

export function DepartmentSection({ deptKey }: DepartmentSectionProps) {
  const data = useRoiStore(s => s.inputs.departments[deptKey])
  const setDepartment = useRoiStore(s => s.setDepartment)
  const expanded = useRoiStore(s => s.ui.expandedDepartments[deptKey])
  const toggle = useRoiStore(s => s.toggleDepartment)

  const label = DEPARTMENT_LABELS[deptKey]
  const icon = DEPARTMENT_ICONS[deptKey]
  const headerSummary = `${data.empleados} emp · ${data.horasSemana}h/sem · ${formatCop(data.costoHoraCop)}/h`

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => toggle(deptKey)}
        aria-expanded={expanded}
        aria-controls={`dept-${deptKey}`}
        className="w-full flex items-center justify-between p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-lg">{icon}</span>
          <div>
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 tabular-nums">{headerSummary}</div>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-zinc-500 dark:text-zinc-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div className={`collapsible-content ${expanded ? 'open' : ''}`} id={`dept-${deptKey}`}>
        <div>
          <div className="grid grid-cols-3 gap-2 p-3 border-t border-zinc-200 dark:border-zinc-800">
            <NumField
              label="Emp"
              id={`${deptKey}-emp`}
              value={data.empleados}
              min={0}
              max={500}
              step={1}
              onChange={v => setDepartment(deptKey, { empleados: v })}
            />
            <NumField
              label="Hrs/sem"
              id={`${deptKey}-hrs`}
              value={data.horasSemana}
              min={0}
              max={40}
              step={0.5}
              onChange={v => setDepartment(deptKey, { horasSemana: v })}
            />
            <NumField
              label="$/hora"
              id={`${deptKey}-cost`}
              value={data.costoHoraCop}
              min={0}
              max={1_000_000}
              step={1000}
              onChange={v => setDepartment(deptKey, { costoHoraCop: v })}
              format="cop"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface NumFieldProps {
  label: string
  id: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: 'cop' | 'raw'
}

function NumField({ label, id, value, min, max, step, onChange, format = 'raw' }: NumFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => {
          const next = Number(e.target.value)
          if (Number.isFinite(next) && next >= min && next <= max) onChange(next)
        }}
        className="h-9 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        aria-label={`${label} · valor actual ${format === 'cop' ? formatCop(value) : value}`}
      />
    </div>
  )
}
