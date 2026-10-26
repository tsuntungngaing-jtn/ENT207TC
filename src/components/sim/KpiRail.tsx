import type { DayKpis } from '../../sim/types'

const items: { key: keyof DayKpis; label: string; format: (v: number) => string }[] = [
  { key: 'occPct', label: 'Occupancy', format: (v) => `${v.toFixed(1)}%` },
  { key: 'occupiedRooms', label: 'Occupied', format: (v) => String(v) },
  { key: 'guestsInHouse', label: 'Guests', format: (v) => v.toFixed(1) },
  { key: 'avgLos', label: 'Avg LOS', format: (v) => v.toFixed(2) },
  { key: 'adr', label: 'ADR', format: (v) => `¥${Math.round(v)}` },
  { key: 'revpar', label: 'RevPAR', format: (v) => `¥${v}` },
  { key: 'revenue', label: 'Revenue', format: (v) => `¥${Math.round(v)}` },
  { key: 'riskScore', label: 'Risk', format: (v) => String(Math.round(v)) },
]

export function KpiRail({ kpis }: { kpis: DayKpis }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
      {items.map(({ key, label, format }) => (
        <div
          key={key}
          className="rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </div>
          <div className="mt-1 text-lg font-bold tabular-nums text-navy-900">{format(kpis[key])}</div>
        </div>
      ))}
    </div>
  )
}
