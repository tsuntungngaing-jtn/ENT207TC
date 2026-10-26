import { Bell, ChevronDown, Circle } from 'lucide-react'
import { property } from '../../data/mock'

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-navy-900">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-200 sm:flex">
          <Circle className="h-2 w-2 fill-teal-500 text-teal-500 animate-pulse-soft" />
          AI agents online
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-900 shadow-sm transition hover:border-teal-300"
        >
          <span className="max-w-[180px] truncate">{property.name}</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        <button
          type="button"
          className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm hover:text-navy-900"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk" />
        </button>
      </div>
    </header>
  )
}
