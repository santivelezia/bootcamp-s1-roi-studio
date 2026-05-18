export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" aria-hidden="true" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Cargando ROI Studio…</p>
      </div>
    </div>
  )
}
