import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IndustrySelector } from '@/components/inputs/industry-selector'
import { useRoiStore } from '@/lib/store/roi'

describe('<IndustrySelector>', () => {
  it('cambia el industria al hacer click', async () => {
    useRoiStore.setState(s => ({ inputs: { ...s.inputs, industria: 'A' } }))
    const user = userEvent.setup()
    render(<IndustrySelector />)
    const btnC = screen.getByText('SaaS / Tech').closest('button')
    expect(btnC).toBeTruthy()
    if (btnC) await user.click(btnC)
    expect(useRoiStore.getState().inputs.industria).toBe('C')
  })
})
