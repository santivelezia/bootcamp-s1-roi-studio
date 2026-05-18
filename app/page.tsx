'use client'

import { Suspense, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { InputsPanel } from '@/components/inputs/inputs-panel'
import { ScenariosView } from '@/components/results/scenarios-view'
import { ChartsSection } from '@/components/charts/charts-section'
import { AnalyzeButton } from '@/components/analysis/analyze-button'
import { AnalysisStream } from '@/components/analysis/analysis-stream'
import { RoadmapButton } from '@/components/analysis/roadmap-button'
import { RoadmapView } from '@/components/analysis/roadmap-view'
import { PdfButton } from '@/components/share/pdf-button'
import { ShareButton } from '@/components/share/share-button'
import { SessionSync } from '@/components/realtime/session-sync'
import { useRoiStore } from '@/lib/store/roi'
import type { ChartCaptureHandle } from '@/components/chart-capture'

export default function Home() {
  const mobileTab = useRoiStore(s => s.ui.mobileTab)
  const setMobileTab = useRoiStore(s => s.setMobileTab)
  const savingsRef = useRef<ChartCaptureHandle | null>(null)
  const costRef = useRef<ChartCaptureHandle | null>(null)
  const netRef = useRef<ChartCaptureHandle | null>(null)

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Suspense fallback={null}>
        <SessionSync />
      </Suspense>
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Calculadora <span className="smart4ai-gradient-text">ROI Empresarial con IA</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            La única calculadora de ROI con IA que un CFO LATAM toma en serio.
            3 escenarios cuantificados · análisis Claude en streaming · PDF ejecutivo en 90 segundos.
          </p>
        </div>

        {/* Mobile · tabs */}
        <div className="md:hidden mb-6">
          <Tabs value={mobileTab} onValueChange={v => setMobileTab(v as typeof mobileTab)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="inputs">Inputs</TabsTrigger>
              <TabsTrigger value="resultados">Resultados</TabsTrigger>
              <TabsTrigger value="analisis">Análisis</TabsTrigger>
            </TabsList>
            <TabsContent value="inputs"><InputsPanel /></TabsContent>
            <TabsContent value="resultados">
              <ScenariosView />
              <div className="mt-6"><ChartsSection savingsRef={savingsRef} costRef={costRef} netRef={netRef} /></div>
            </TabsContent>
            <TabsContent value="analisis">
              <AnalysisPanel
                savingsRef={savingsRef}
                costRef={costRef}
                netRef={netRef}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop · 3 columnas */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-6">
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Inputs</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <InputsPanel />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-6 lg:col-span-6 space-y-6">
            <ScenariosView />
            <ChartsSection savingsRef={savingsRef} costRef={costRef} netRef={netRef} />
          </div>

          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <AnalysisPanel
              savingsRef={savingsRef}
              costRef={costRef}
              netRef={netRef}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function AnalysisPanel({ savingsRef, costRef, netRef }: {
  savingsRef: React.RefObject<ChartCaptureHandle | null>
  costRef: React.RefObject<ChartCaptureHandle | null>
  netRef: React.RefObject<ChartCaptureHandle | null>
}) {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm">Análisis IA</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <AnalyzeButton />
        <RoadmapButton />
        <div className="grid grid-cols-2 gap-2">
          <PdfButton savingsRef={savingsRef} costRef={costRef} netRef={netRef} />
          <ShareButton />
        </div>
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <AnalysisStream />
          <RoadmapView />
        </div>
      </CardContent>
    </Card>
  )
}
