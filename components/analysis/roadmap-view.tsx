'use client'

import { useRoiStore } from '@/lib/store/roi'

/**
 * Render simple del markdown del roadmap.
 * No usamos `react-markdown` para evitar una dep extra · parsing manual
 * suficiente para 3-fases-con-listas que retorna Sonnet.
 */
export function RoadmapView() {
  const md = useRoiStore(s => s.ui.roadmapMarkdown)
  const loading = useRoiStore(s => s.ui.roadmapLoading)

  if (loading && !md) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400 italic">
        Claude Sonnet 4.6 está diseñando tu plan de 90 días…
      </div>
    )
  }

  if (!md) return null

  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none mt-3 border-t border-zinc-200 dark:border-zinc-800 pt-3"
      aria-label="Roadmap 90 días"
    >
      {md.split('\n').map((line, idx) => renderLine(line, idx))}
    </div>
  )
}

function renderLine(line: string, idx: number): React.ReactNode {
  if (line.startsWith('## ')) {
    return (
      <h3 key={idx} className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-4 mb-2">
        {line.replace(/^## /, '')}
      </h3>
    )
  }
  if (line.startsWith('**') && line.endsWith('**')) {
    return (
      <p key={idx} className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-2">
        {line.replace(/^\*\*|\*\*$/g, '')}
      </p>
    )
  }
  if (line.startsWith('- [ ] ') || line.startsWith('- ')) {
    const content = line.replace(/^- (\[ \] )?/, '')
    return (
      <div key={idx} className="text-sm text-zinc-700 dark:text-zinc-300 ml-4 leading-snug">
        <span className="text-zinc-400">•</span> {content}
      </div>
    )
  }
  if (/^\d+\. /.test(line)) {
    return (
      <div key={idx} className="text-sm text-zinc-700 dark:text-zinc-300 ml-4 leading-snug">
        {line}
      </div>
    )
  }
  if (line.trim() === '') {
    return null
  }
  return (
    <p key={idx} className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
      {line}
    </p>
  )
}
