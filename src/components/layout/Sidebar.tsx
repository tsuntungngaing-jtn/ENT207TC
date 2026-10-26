import { NavLink } from 'react-router-dom'
import {
  Activity,
  BookOpen,
  BrainCircuit,
  ChartColumnIncreasing,
  CloudSun,
  LayoutDashboard,
  LineChart,
  Radio,
  Sparkles,
} from 'lucide-react'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/weak-season', label: 'Weak Season Analysis', icon: ChartColumnIncreasing },
  { to: '/research', label: 'Research Agent', icon: BrainCircuit },
  { to: '/strategy', label: 'Strategy Center', icon: Sparkles },
  { to: '/ota', label: 'OTA Operations', icon: Radio },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { to: '/feedback', label: 'Performance Feedback', icon: LineChart },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-white/10 bg-navy-900 text-slate-200">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 ring-1 ring-teal-400/40">
          <Activity className="h-5 w-5 text-teal-400" />
        </div>
        <div>
          <div className="text-lg font-bold tracking-tight text-white">FuxiPulse</div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-teal-400/90">
            AI Operations
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pb-4">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/10 text-white shadow-sm shadow-black/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-4 w-4 ${isActive ? 'text-teal-400' : 'text-slate-400 group-hover:text-teal-400'}`}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-4 rounded-2xl bg-navy-800/80 p-4 ring-1 ring-white/10">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-400">
          <CloudSun className="h-3.5 w-3.5" />
          Live context
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Tengchong · autumn shoulder season detected. AI agents monitoring demand.
        </p>
      </div>
    </aside>
  )
}
