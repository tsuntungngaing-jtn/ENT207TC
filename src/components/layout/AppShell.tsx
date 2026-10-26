import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="flex h-full min-h-screen bg-[radial-gradient(ellipse_at_top_right,_#e0f2f1_0%,_#f1f5f9_45%,_#eef2ff00_70%)]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
