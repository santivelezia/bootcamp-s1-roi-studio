import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KpiCell } from '@/components/results/kpi-cell'

describe('<KpiCell>', () => {
  it('renderiza label y valor', () => {
    render(<KpiCell label="Ahorro" value="$1.000" />)
    expect(screen.getByText('Ahorro')).toBeInTheDocument()
    expect(screen.getByText('$1.000')).toBeInTheDocument()
  })

  it('emphasis aplica clase de tamaño grande', () => {
    const { container } = render(<KpiCell label="X" value="$Y" emphasis />)
    const value = container.querySelector('p:nth-of-type(2)')
    expect(value?.className ?? '').toContain('text-2xl')
  })
})
