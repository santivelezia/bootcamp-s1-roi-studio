/**
 * Zustand store del ROI Studio · Brief S1
 *
 * 3 slices:
 *  - inputs: lo que el usuario llena (industria, TRM, empresa, deptos)
 *  - results: cómputos derivados (escenarios, charts data)
 *  - ui: estado efímero (paso, modal, streaming)
 *
 * Persist solo de inputs (localStorage). Results se recomputan. UI es efímero.
 */

import { create, type StateCreator } from 'zustand'
import { devtools, persist, type PersistOptions } from 'zustand/middleware'
import {
  DEPARTMENT_KEYS,
  INDUSTRIAS,
  type DepartmentBaseline,
  type DepartmentKey,
  type Industria,
} from '@/lib/calc/industries'

export type SessionId = string | null

// ─── Slice 1: inputs ─────────────────────────────────────────────────

export interface InputsSlice {
  inputs: {
    empresa: string
    industria: Industria
    trm: number
    /** Source TRM: 'banrep' o 'fallback' o 'manual' (override). */
    trmSource: 'banrep' | 'fallback' | 'manual'
    departments: Record<DepartmentKey, DepartmentBaseline>
  }
  setEmpresa: (empresa: string) => void
  setIndustria: (industria: Industria) => void
  setTrm: (trm: number, source: InputsSlice['inputs']['trmSource']) => void
  setDepartment: (
    key: DepartmentKey,
    patch: Partial<DepartmentBaseline>,
  ) => void
  resetDepartmentsFromIndustria: (industria: Industria) => void
}

function initialDepartments(industria: Industria): Record<DepartmentKey, DepartmentBaseline> {
  const config = INDUSTRIAS[industria]
  return DEPARTMENT_KEYS.reduce(
    (acc, key) => ({ ...acc, [key]: { ...config.baselines[key] } }),
    {} as Record<DepartmentKey, DepartmentBaseline>,
  )
}

const createInputsSlice: StateCreator<RoiStore, [], [], InputsSlice> = (set, get) => ({
  inputs: {
    empresa: '',
    industria: 'A',
    trm: 4200,
    trmSource: 'fallback',
    departments: initialDepartments('A'),
  },
  setEmpresa: empresa => set(s => ({ inputs: { ...s.inputs, empresa } })),
  setIndustria: industria =>
    set(s => ({
      inputs: {
        ...s.inputs,
        industria,
        departments: initialDepartments(industria),
      },
    })),
  setTrm: (trm, source) =>
    set(s => ({ inputs: { ...s.inputs, trm, trmSource: source } })),
  setDepartment: (key, patch) => {
    const current = get().inputs.departments[key]
    set(s => ({
      inputs: {
        ...s.inputs,
        departments: {
          ...s.inputs.departments,
          [key]: { ...current, ...patch },
        },
      },
    }))
  },
  resetDepartmentsFromIndustria: industria =>
    set(s => ({ inputs: { ...s.inputs, departments: initialDepartments(industria) } })),
})

// ─── Slice 2: ui ─────────────────────────────────────────────────────

export interface UiSlice {
  ui: {
    expandedDepartments: Record<DepartmentKey, boolean>
    mobileTab: 'inputs' | 'resultados' | 'analisis'
    sessionId: SessionId
    analysisText: string
    analysisStreaming: boolean
    roadmapMarkdown: string
    roadmapLoading: boolean
  }
  toggleDepartment: (key: DepartmentKey) => void
  setMobileTab: (tab: UiSlice['ui']['mobileTab']) => void
  setSessionId: (id: SessionId) => void
  setAnalysisText: (text: string) => void
  appendAnalysisText: (chunk: string) => void
  setAnalysisStreaming: (streaming: boolean) => void
  setRoadmapMarkdown: (md: string) => void
  setRoadmapLoading: (loading: boolean) => void
}

const createUiSlice: StateCreator<RoiStore, [], [], UiSlice> = set => ({
  ui: {
    expandedDepartments: {
      ventas: true,
      marketing: false,
      operaciones: false,
      soporte: false,
      finanzas: false,
      it: false,
    },
    mobileTab: 'inputs',
    sessionId: null,
    analysisText: '',
    analysisStreaming: false,
    roadmapMarkdown: '',
    roadmapLoading: false,
  },
  toggleDepartment: key =>
    set(s => ({
      ui: {
        ...s.ui,
        expandedDepartments: {
          ...s.ui.expandedDepartments,
          [key]: !s.ui.expandedDepartments[key],
        },
      },
    })),
  setMobileTab: tab => set(s => ({ ui: { ...s.ui, mobileTab: tab } })),
  setSessionId: id => set(s => ({ ui: { ...s.ui, sessionId: id } })),
  setAnalysisText: text => set(s => ({ ui: { ...s.ui, analysisText: text } })),
  appendAnalysisText: chunk =>
    set(s => ({ ui: { ...s.ui, analysisText: s.ui.analysisText + chunk } })),
  setAnalysisStreaming: streaming =>
    set(s => ({ ui: { ...s.ui, analysisStreaming: streaming } })),
  setRoadmapMarkdown: md => set(s => ({ ui: { ...s.ui, roadmapMarkdown: md } })),
  setRoadmapLoading: loading => set(s => ({ ui: { ...s.ui, roadmapLoading: loading } })),
})

// ─── Combinación ─────────────────────────────────────────────────────

export type RoiStore = InputsSlice & UiSlice

type PersistedRoiStore = Pick<RoiStore, 'inputs'>

const persistOptions: PersistOptions<RoiStore, PersistedRoiStore> = {
  name: 'smart4ai-roi-studio',
  version: 1,
  partialize: state => ({ inputs: state.inputs }),
}

export const useRoiStore = create<RoiStore>()(
  devtools(
    persist(
      (set, get, store) => ({
        ...createInputsSlice(set, get, store),
        ...createUiSlice(set, get, store),
      }),
      persistOptions,
    ),
    { name: 'roi-studio', enabled: process.env.NODE_ENV !== 'production' },
  ),
)

// Selectores convenientes
export const useInputs = (): InputsSlice['inputs'] => useRoiStore(s => s.inputs)
export const useUi = (): UiSlice['ui'] => useRoiStore(s => s.ui)
