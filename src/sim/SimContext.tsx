import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { previewDay, runDays } from './engine'
import {
  clearPersistedCommitted,
  createInitialState,
  loadPersistedCommitted,
  persistCommitted,
  pricingEqual,
} from './state'
import type { CommittedPricing, SimAssumptions, SimState } from './types'

export { createInitialState } from './state'

const DRAFT_DIRTY_NOTICE =
  'Unapproved draft pricing was ignored; advancing with committed prices only.'

interface SimContextValue {
  state: SimState
  draftPricing: CommittedPricing
  draftDirty: boolean
  notice: string | null
  setAssumptions: (partial: Partial<SimAssumptions>) => void
  setDraftPricing: (partial: Partial<CommittedPricing>) => void
  approveDraft: () => void
  rejectDraft: () => void
  advanceDays: (n: number) => void
  resetScenario: () => void
  clearNotice: () => void
  enqueuePricingHint: (hint: { source: string; discountPct: number }) => void
}

const SimContext = createContext<SimContextValue | null>(null)

function buildBootState(): { state: SimState; draft: CommittedPricing } {
  const base = createInitialState()
  const saved = typeof localStorage !== 'undefined' ? loadPersistedCommitted() : null
  if (!saved) return { state: base, draft: structuredClone(base.committed) }

  const committed: CommittedPricing = {
    ...base.committed,
    ...saved,
    dailyAdr:
      saved.dailyAdr.length === base.fixtures.calendar.length
        ? saved.dailyAdr
        : base.committed.dailyAdr,
  }
  const state: SimState = {
    ...base,
    committed,
    liveKpis: previewDay({
      fixtures: base.fixtures,
      assumptions: base.assumptions,
      committed,
      dayIndex: 0,
    }),
  }
  return { state, draft: structuredClone(committed) }
}

export function SimProvider({ children }: { children: ReactNode }) {
  const boot = useMemo(() => buildBootState(), [])
  const [state, setState] = useState<SimState>(boot.state)
  const [draftPricing, setDraftPricingState] = useState<CommittedPricing>(boot.draft)
  const [notice, setNotice] = useState<string | null>(null)

  const draftDirty = !pricingEqual(draftPricing, state.committed)

  const refreshPreview = useCallback(
    (next: SimState, pricing: CommittedPricing): SimState => {
      const dayIndex = Math.min(next.dayCursor, next.fixtures.calendar.length - 1)
      return {
        ...next,
        liveKpis: previewDay({
          fixtures: next.fixtures,
          assumptions: next.assumptions,
          committed: pricing,
          dayIndex,
        }),
      }
    },
    [],
  )

  const setAssumptions = useCallback(
    (partial: Partial<SimAssumptions>) => {
      setState((prev) => {
        const next = { ...prev, assumptions: { ...prev.assumptions, ...partial } }
        return refreshPreview(next, next.committed)
      })
    },
    [refreshPreview],
  )

  const setDraftPricing = useCallback((partial: Partial<CommittedPricing>) => {
    setDraftPricingState((prev) => ({ ...prev, ...partial }))
  }, [])

  const approveDraft = useCallback(() => {
    setState((prev) => {
      const next = refreshPreview({ ...prev, committed: structuredClone(draftPricing) }, draftPricing)
      persistCommitted(next.committed)
      return next
    })
    setDraftPricingState((d) => structuredClone(d))
    setNotice(null)
  }, [draftPricing, refreshPreview])

  const rejectDraft = useCallback(() => {
    setDraftPricingState(structuredClone(state.committed))
    setState((prev) => refreshPreview(prev, prev.committed))
    setNotice(null)
  }, [refreshPreview, state.committed])

  const advanceDays = useCallback(
    (n: number) => {
      if (!pricingEqual(draftPricing, state.committed)) {
        setNotice(DRAFT_DIRTY_NOTICE)
      } else {
        setNotice(null)
      }
      setState((prev) => runDays(prev, n).state)
    },
    [draftPricing, state.committed],
  )

  const resetScenario = useCallback(() => {
    clearPersistedCommitted()
    const fresh = createInitialState()
    setState(fresh)
    setDraftPricingState(structuredClone(fresh.committed))
    setNotice(null)
  }, [])

  const clearNotice = useCallback(() => setNotice(null), [])

  const enqueuePricingHint = useCallback(
    (hint: { source: string; discountPct: number }) => {
      void hint.source
      setDraftPricingState((prev) => ({
        ...prev,
        globalDiscountPct: hint.discountPct,
        weekdayPackage: true,
      }))
      setNotice('Queued in Dispatch')
    },
    [],
  )

  const value = useMemo<SimContextValue>(
    () => ({
      state,
      draftPricing,
      draftDirty,
      notice,
      setAssumptions,
      setDraftPricing,
      approveDraft,
      rejectDraft,
      advanceDays,
      resetScenario,
      clearNotice,
      enqueuePricingHint,
    }),
    [
      state,
      draftPricing,
      draftDirty,
      notice,
      setAssumptions,
      setDraftPricing,
      approveDraft,
      rejectDraft,
      advanceDays,
      resetScenario,
      clearNotice,
      enqueuePricingHint,
    ],
  )

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>
}

export function useSim() {
  const ctx = useContext(SimContext)
  if (!ctx) throw new Error('useSim must be used within SimProvider')
  return ctx
}
