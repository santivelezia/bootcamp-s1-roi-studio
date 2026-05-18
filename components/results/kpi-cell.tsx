'use client'

interface KpiCellProps {
  label: string
  value: string
  hint?: string
  emphasis?: boolean
}

export function KpiCell({ label, value, hint, emphasis = false }: KpiCellProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
      <p
        className={
          emphasis
            ? 'text-2xl md:text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-none'
            : 'text-base md:text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100'
        }
      >
        {value}
      </p>
      {hint ? <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{hint}</p> : null}
    </div>
  )
}
