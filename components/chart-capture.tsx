'use client'

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from 'react'
import { toPng } from 'html-to-image'

export interface ChartCaptureHandle {
  capture: () => Promise<string>
}

export interface ChartCaptureProps {
  children: ReactNode
  className?: string
}

/**
 * Envuelve gráficas Recharts y expone `capture()` → data URL PNG.
 * Usado por el botón "PDF" para embeber las 3 gráficas en el PDF ejecutivo.
 */
export const ChartCapture = forwardRef<ChartCaptureHandle, ChartCaptureProps>(
  function ChartCapture({ children, className }, ref) {
    const innerRef = useRef<HTMLDivElement | null>(null)

    const capture = useCallback(async (): Promise<string> => {
      const node = innerRef.current
      if (!node) throw new Error('ChartCapture · ref no montado')
      return toPng(node, { pixelRatio: 2, backgroundColor: '#FFFFFF', cacheBust: true })
    }, [])

    useImperativeHandle(ref, () => ({ capture }), [capture])

    return (
      <div ref={innerRef} className={className} data-chart-capture>
        {children}
      </div>
    )
  },
)
