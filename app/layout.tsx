import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ROI Studio Empresarial · Smart4AI',
    template: '%s · Smart4AI',
  },
  description:
    'La única calculadora de ROI con IA que un CFO LATAM toma en serio. 3 escenarios · análisis Claude en streaming · roadmap 90 días · PDF ejecutivo.',
  keywords: ['ROI', 'IA', 'Claude', 'LATAM', 'CFO', 'automatización', 'Smart4AI'],
  authors: [{ name: 'Smart4AI', url: 'https://smart4ai.io' }],
  openGraph: {
    title: 'ROI Studio Empresarial · Smart4AI',
    description: 'Calcula el ROI real de implementar IA en tu empresa LATAM',
    url: siteUrl,
    siteName: 'Smart4AI · ROI Studio',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/api/og?empresa=tu%20empresa&monto=0&industria=A',
        width: 1200,
        height: 630,
        alt: 'Smart4AI ROI Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROI Studio Empresarial · Smart4AI',
    description: 'Calcula el ROI real de implementar IA en tu empresa LATAM',
    images: ['/api/og?empresa=tu%20empresa&monto=0&industria=A'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f19' },
  ],
}

const GOOGLE_OAUTH_ENABLED =
  process.env['NEXT_PUBLIC_GOOGLE_AUTH_ENABLED'] === 'true'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col">
        <Providers googleEnabled={GOOGLE_OAUTH_ENABLED}>{children}</Providers>
      </body>
    </html>
  )
}
