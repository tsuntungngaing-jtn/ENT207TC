import { StrictMode, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AppStateProvider, useAppState } from './context/AppState'
import { SimProvider, useSim } from './sim/SimContext'
import './index.css'

/** Watches Strategy s1 / primary approval → draft pricing hint (avoids AppState↔Sim circular imports). */
function StrategySimBridge() {
  const { primaryApproval } = useAppState()
  const { enqueuePricingHint } = useSim()
  const armed = useRef(true)

  useEffect(() => {
    if (primaryApproval === 'approved') {
      if (armed.current) {
        armed.current = false
        enqueuePricingHint({ source: 'strategy:s1', discountPct: 8 })
      }
    } else {
      armed.current = true
    }
  }, [primaryApproval, enqueuePricingHint])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppStateProvider>
        <SimProvider>
          <StrategySimBridge />
          <App />
        </SimProvider>
      </AppStateProvider>
    </HashRouter>
  </StrictMode>,
)
