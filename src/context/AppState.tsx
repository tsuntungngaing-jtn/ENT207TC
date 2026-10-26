import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { initialStrategies } from '../data/mock'
import type { ApprovalStatus, StrategyRecommendation } from '../types'

interface AppState {
  strategies: StrategyRecommendation[]
  setStrategyStatus: (id: string, status: ApprovalStatus) => void
  primaryApproval: ApprovalStatus
  setPrimaryApproval: (status: ApprovalStatus) => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [strategies, setStrategies] = useState(initialStrategies)
  const [primaryApproval, setPrimaryApproval] = useState<ApprovalStatus>('pending')

  const value = useMemo<AppState>(
    () => ({
      strategies,
      setStrategyStatus: (id, status) => {
        setStrategies((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
        if (id === 's1') setPrimaryApproval(status)
      },
      primaryApproval,
      setPrimaryApproval: (status) => {
        setPrimaryApproval(status)
        setStrategies((prev) =>
          prev.map((s) => (s.id === 's1' ? { ...s, status } : s)),
        )
      },
    }),
    [strategies, primaryApproval],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
