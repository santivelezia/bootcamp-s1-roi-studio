import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useRoiStore } from '@/lib/store/roi'

describe('store/roi.ts', () => {
  beforeEach(() => {
    // Reset al estado inicial (industria A · TRM 4200)
    useRoiStore.setState(s => ({
      inputs: {
        empresa: '',
        industria: 'A',
        trm: 4200,
        trmSource: 'fallback',
        departments: s.inputs.departments,
      },
    }))
  })

  it('setEmpresa actualiza el nombre', () => {
    act(() => useRoiStore.getState().setEmpresa('Acme'))
    expect(useRoiStore.getState().inputs.empresa).toBe('Acme')
  })

  it('setIndustria reemplaza los baselines de departamentos', () => {
    act(() => useRoiStore.getState().setIndustria('C'))
    expect(useRoiStore.getState().inputs.industria).toBe('C')
    // C tiene baselines de SaaS · TI debe tener 8 empleados (vs 3 en A)
    expect(useRoiStore.getState().inputs.departments.it.empleados).toBe(8)
  })

  it('setDepartment hace patch parcial', () => {
    act(() => useRoiStore.getState().setDepartment('ventas', { empleados: 50 }))
    expect(useRoiStore.getState().inputs.departments.ventas.empleados).toBe(50)
  })

  it('toggleDepartment expande/colapsa', () => {
    const before = useRoiStore.getState().ui.expandedDepartments.marketing
    act(() => useRoiStore.getState().toggleDepartment('marketing'))
    expect(useRoiStore.getState().ui.expandedDepartments.marketing).toBe(!before)
  })

  it('appendAnalysisText concatena chunks', () => {
    act(() => useRoiStore.getState().setAnalysisText(''))
    act(() => useRoiStore.getState().appendAnalysisText('hola '))
    act(() => useRoiStore.getState().appendAnalysisText('mundo'))
    expect(useRoiStore.getState().ui.analysisText).toBe('hola mundo')
  })
})
