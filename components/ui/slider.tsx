'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
  id?: string
  value: number
  min: number
  max: number
  step?: number
  onValueChange: (value: number) => void
  className?: string
  'aria-label'?: string
}

export function Slider({
  id,
  value,
  min,
  max,
  step = 1,
  onValueChange,
  className,
  'aria-label': ariaLabel,
}: SliderProps) {
  return (
    <input
      id={id}
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={e => onValueChange(Number(e.target.value))}
      aria-label={ariaLabel}
      className={cn(
        'w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer',
        '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5',
        '[&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer',
        '[&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-orange-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
        className,
      )}
    />
  )
}
