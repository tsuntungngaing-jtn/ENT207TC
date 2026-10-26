import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { FeedbackPage } from './pages/FeedbackPage'
import { KnowledgePage } from './pages/KnowledgePage'
import { OtaPage } from './pages/OtaPage'
import { ResearchPage } from './pages/ResearchPage'
import { StrategyPage } from './pages/StrategyPage'
import { WeakSeasonPage } from './pages/WeakSeasonPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="weak-season" element={<WeakSeasonPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="strategy" element={<StrategyPage />} />
        <Route path="ota" element={<OtaPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
