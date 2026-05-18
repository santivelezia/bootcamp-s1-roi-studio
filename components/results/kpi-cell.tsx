'use client'

interface KpiCellProps {
  label: string
  value: string
  hint?: string
  emphasis?: boolean
  /** Tooltip nativo HTML · usado para mostrar el valor completo cuando `value` está compactado. */
  title?: string
}

export function KpiCell({ label, value, hint, emphasis = false, title }: KpiCellProps) {
  return (
    <div className="space-y-1 min-w-0">
      <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 truncate">{label}</p>
      <p
        title={title}
        className={
          emphasis
            ? 'text-2xl md:text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100 leading-none truncate'
            : 'text-base md:text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 truncate'
        }
      >
        {value}
      </p>
      {hint ? <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{hint}</p> : null}
    </div>
  )
}
