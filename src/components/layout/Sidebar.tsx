import { NavLink } from 'react-router-dom'
import {
  Activity,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ChartColumnIncreasing,
  CloudSun,
  LayoutDashboard,
  LineChart,
  Map,
  Radio,
  Sparkles,
  Truck,
} from 'lucide-react'

const simNav = [
  { to: '/sim', label: 'Sandbox', icon: Map },
  { to: '/dispatch', label: 'Dispatch', icon: Truck },
  { to: '/daily', label: 'Daily', icon: CalendarDays },
]

const opsNav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/weak-season', label: 'Weak Season Analysis', icon: ChartColumnIncreasing },
  { to: '/research', label: 'Research Agent', icon: BrainCircuit },
  { to: '/strategy', label: 'Strategy Center', icon: Sparkles },
  { to: '/ota', label: 'OTA Operations', icon: Radio },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { to: '/feedback', label: 'Performance Feedback', icon: LineChart },
]

function NavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
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
  )
}

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
            Ops Simulator
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2 px-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Simulator
            </span>
            <span className="rounded bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-teal-300 ring-1 ring-teal-400/30">
              Sim
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {simNav.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Operations
          </div>
          <div className="flex flex-col gap-1">
            {opsNav.map((item) => (
              <NavItem key={item.to} {...item} end={item.to === '/'} />
            ))}
          </div>
        </div>
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
