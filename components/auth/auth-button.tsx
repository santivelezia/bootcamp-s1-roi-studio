'use client'

import { Button } from '@/components/ui/button'
import { useUser } from '@/components/auth/auth-provider'

export function AuthButton() {
  const { user, loading, googleEnabled, signInWithGoogle, signOut } = useUser()

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Cargando…
      </Button>
    )
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => void signInWithGoogle()}
        disabled={!googleEnabled}
        title={googleEnabled ? 'Entrar con Google' : 'Login con Google pendiente de configuración'}
        aria-disabled={!googleEnabled}
      >
        <GoogleMark />
        <span>{googleEnabled ? 'Entrar con Google' : 'Login (próximamente)'}</span>
      </Button>
    )
  }

  const avatar = (user.user_metadata?.['avatar_url'] as string | undefined) ?? null
  const displayName =
    (user.user_metadata?.['full_name'] as string | undefined) ?? user.email ?? 'Usuario'

  return (
    <div className="inline-flex items-center gap-3">
      {avatar ? (
        <img src={avatar} alt={`Avatar de ${displayName}`} className="w-7 h-7 rounded-full" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center" aria-hidden="true">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm text-zinc-700 dark:text-zinc-300 hidden sm:inline">{displayName}</span>
      <Button variant="ghost" size="sm" onClick={() => void signOut()}>
        Salir
      </Button>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.92v2.32A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.92A9 9 0 0 0 0 9c0 1.45.35 2.83.92 4.04l3.05-2.32z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.43 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .92 4.96l3.05 2.32C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  )
}
