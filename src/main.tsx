import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { AppStateProvider } from './context/AppState'
import { SimProvider } from './sim/SimContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AppStateProvider>
        <SimProvider>
          <App />
        </SimProvider>
      </AppStateProvider>
    </HashRouter>
  </StrictMode>,
)
