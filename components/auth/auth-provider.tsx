'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthChangeEventLite =
  | 'INITIAL_SESSION'
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'PASSWORD_RECOVERY'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'MFA_CHALLENGE_VERIFIED'

export interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  /** true si el provider Google está configurado en Supabase dashboard. */
  googleEnabled: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * AuthProvider del ROI Studio.
 *
 * Soporta degradación: si el Google provider no está habilitado en Supabase
 * dashboard (Brief R5), `googleEnabled=false` y el botón se muestra
 * deshabilitado con tooltip. El resto de la app funciona sin login.
 */
export function AuthProvider({
  children,
  googleEnabled = false,
}: {
  children: ReactNode
  googleEnabled?: boolean
}) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    void (async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEventLite, next: Session | null) => {
        if (!mounted) return
        setSession(next)
        setUser(next?.user ?? null)
      },
    )

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!googleEnabled) {
      console.warn('[auth] Google provider no configurado en Supabase')
      return
    }
    const supabase = createClient()
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
  }, [googleEnabled])

  const signOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, session, loading, googleEnabled, signInWithGoogle, signOut }),
    [user, session, loading, googleEnabled, signInWithGoogle, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useUser(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useUser() debe usarse dentro de <AuthProvider>')
  }
  return ctx
}
