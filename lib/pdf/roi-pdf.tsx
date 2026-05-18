/**
 * PDF ejecutivo del ROI Studio · server-side render con @react-pdf/renderer.
 * Adaptación del template para los datos específicos del Demo S1.
 */

import type { JSX } from 'react'
import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  renderToStream,
} from '@react-pdf/renderer'

const palette = {
  ink: '#0B0F19',
  paper: '#FFFFFF',
  brand: '#FF6B35',
  brandMuted: '#FFE5D9',
  surface: '#F4F4F5',
  border: '#E4E4E7',
  muted: '#6B7280',
}

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://rsms.me/inter/font-files/Inter-Regular.otf', fontWeight: 400 },
    { src: 'https://rsms.me/inter/font-files/Inter-SemiBold.otf', fontWeight: 600 },
    { src: 'https://rsms.me/inter/font-files/Inter-Bold.otf', fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: { fontFamily: 'Inter', backgroundColor: palette.paper, padding: 48, color: palette.ink },
  cover: { flex: 1, justifyContent: 'space-between' },
  coverBadge: { fontSize: 11, color: palette.brand, fontWeight: 700, letterSpacing: 2 },
  coverTitle: { fontSize: 34, fontWeight: 700, marginTop: 24, lineHeight: 1.15 },
  coverSub: { fontSize: 14, color: palette.muted, marginTop: 12, lineHeight: 1.5 },
  coverMeta: { fontSize: 10, color: palette.muted, marginTop: 36, lineHeight: 1.6 },
  h2: { fontSize: 20, fontWeight: 700, marginBottom: 16 },
  p: { fontSize: 11, lineHeight: 1.55, color: palette.ink, marginBottom: 8 },
  table: { marginTop: 12, borderColor: palette.border, borderWidth: 1, borderRadius: 6 },
  row: { flexDirection: 'row', borderBottomColor: palette.border, borderBottomWidth: 1, padding: 10 },
  rowHeader: { backgroundColor: palette.surface, fontWeight: 700 },
  rowLast: { borderBottomWidth: 0 },
  cell: { fontSize: 10, flex: 1 },
  cellNumber: { fontSize: 10, flex: 1, textAlign: 'right' },
  chartCard: {
    marginTop: 12, padding: 12, borderColor: palette.border, borderWidth: 1,
    borderRadius: 6, backgroundColor: palette.surface,
  },
  chartCaption: { fontSize: 10, color: palette.muted, marginTop: 8 },
  analysis: {
    backgroundColor: palette.brandMuted, padding: 16, borderRadius: 8,
    marginTop: 12, color: palette.ink,
  },
  footer: {
    position: 'absolute', bottom: 24, left: 48, right: 48,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  footerText: { fontSize: 9, color: palette.muted },
})

export interface RoiPdfRow {
  metrica: string
  pesimista: string
  esperado: string
  optimista: string
}

export interface RoiPdfChart {
  caption: string
  dataUrl: string
}

export interface RoiPdfInput {
  empresa: string
  fecha: string
  industria: 'A' | 'B' | 'C' | 'D'
  filas: RoiPdfRow[]
  charts: RoiPdfChart[]
  analisis: string
  roadmap: string
}

export function buildPdfFilename(empresa: string, fecha: string): string {
  const slug = (empresa || 'empresa')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  return `ROI-Smart4AI-${slug || 'empresa'}-${fecha}.pdf`
}

function industriaLabel(letra: 'A' | 'B' | 'C' | 'D'): string {
  switch (letra) {
    case 'A': return 'A · Servicios profesionales'
    case 'B': return 'B · E-commerce / Retail digital'
    case 'C': return 'C · SaaS / Tech'
    case 'D': return 'D · Educación / Infoproductos'
  }
}

function Footer({ pageLabel }: { pageLabel: string }): JSX.Element {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        Smart4AI · ROI Studio · {pageLabel} · Construido en 90 min con Claude Code
      </Text>
      <Text style={styles.footerText}>smart4ai.io</Text>
    </View>
  )
}

export function RoiExecutivePdf(props: RoiPdfInput): JSX.Element {
  const { empresa, fecha, industria, filas, charts, analisis, roadmap } = props
  return (
    <Document title={`ROI Smart4AI · ${empresa || 'Demo'}`} author="Smart4AI">
      <Page size="A4" style={styles.page}>
        <View style={styles.cover}>
          <View>
            <Text style={styles.coverBadge}>SMART4AI · ROI STUDIO</Text>
            <Text style={styles.coverTitle}>
              Lo que {empresa || 'tu empresa'} ahorraría al automatizar con IA
            </Text>
            <Text style={styles.coverSub}>
              Análisis ejecutivo · 3 escenarios cuantificados · supuestos auditables.
            </Text>
          </View>
          <Text style={styles.coverMeta}>
            Industria: {industriaLabel(industria)}{'\n'}
            Fecha: {fecha}{'\n'}
            TRM intradía Banrep · cálculos en COP
          </Text>
        </View>
        <Footer pageLabel="Portada" />
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.h2}>Tabla ejecutiva · 3 escenarios</Text>
        <Text style={styles.p}>
          Comparativo Pesimista (50% × 60%) · Esperado (70% × 70%) · Optimista (90% × 80%).
        </Text>
        <View style={styles.table}>
          <View style={[styles.row, styles.rowHeader]}>
            <Text style={styles.cell}>Métrica</Text>
            <Text style={styles.cellNumber}>Pesimista</Text>
            <Text style={styles.cellNumber}>Esperado</Text>
            <Text style={styles.cellNumber}>Optimista</Text>
          </View>
          {filas.map((row, idx) => (
            <View
              key={`${row.metrica}-${idx}`}
              style={[styles.row, idx === filas.length - 1 ? styles.rowLast : {}]}
            >
              <Text style={styles.cell}>{row.metrica}</Text>
              <Text style={styles.cellNumber}>{row.pesimista}</Text>
              <Text style={styles.cellNumber}>{row.esperado}</Text>
              <Text style={styles.cellNumber}>{row.optimista}</Text>
            </View>
          ))}
        </View>
        <Footer pageLabel="Tabla ejecutiva" />
      </Page>

      {charts.length > 0 ? (
        <Page size="A4" style={styles.page}>
          <Text style={styles.h2}>Visualización</Text>
          {charts.map((chart, idx) => (
            <View key={`chart-${idx}`} style={styles.chartCard} wrap={false}>
              <Image src={chart.dataUrl} />
              <Text style={styles.chartCaption}>{chart.caption}</Text>
            </View>
          ))}
          <Footer pageLabel="Gráficas" />
        </Page>
      ) : null}

      <Page size="A4" style={styles.page}>
        <Text style={styles.h2}>Análisis IA · Claude Haiku 4.5</Text>
        <View style={styles.analysis}>
          <Text style={styles.p}>{analisis || 'Sin análisis aún · regenera desde el simulador.'}</Text>
        </View>
        <Footer pageLabel="Análisis IA" />
      </Page>

      {roadmap ? (
        <Page size="A4" style={styles.page}>
          <Text style={styles.h2}>Roadmap 90 días · Claude Sonnet 4.6</Text>
          <Text style={styles.p}>{roadmap}</Text>
          <Footer pageLabel="Roadmap 90 días" />
        </Page>
      ) : null}
    </Document>
  )
}

export async function renderRoiPdf(input: RoiPdfInput): Promise<NodeJS.ReadableStream> {
  return renderToStream(<RoiExecutivePdf {...input} />)
}
