'use client'

import { Github, Code2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 mt-12 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="inline-flex items-center gap-2">
          <Code2 size={14} aria-hidden="true" />
          <span>Construido en 90 min con <strong className="text-zinc-700 dark:text-zinc-300">Claude Code</strong> · Smart4AI Bootcamp RutaN S1</span>
        </div>
        <a
          href="https://github.com/santivelezia/bootcamp-s1-roi-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Github size={14} aria-hidden="true" />
          <span>github.com/santivelezia/bootcamp-s1-roi-studio</span>
        </a>
      </div>
    </footer>
  )
}
