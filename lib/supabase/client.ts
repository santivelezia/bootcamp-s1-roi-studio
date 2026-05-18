'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente Supabase para uso desde el browser (componentes 'use client').
 * Lazy singleton · evita múltiples conexiones por HMR en dev.
 */
let cached: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (cached) return cached
  cached = createBrowserClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '',
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? '',
  )
  return cached
}
