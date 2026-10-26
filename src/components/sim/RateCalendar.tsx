import { previewDay } from '../../sim/engine'
import type { CommittedPricing, SimAssumptions, SimFixtures } from '../../sim/types'

function competitorAvg(fixtures: SimFixtures, dayIndex: number): number {
  const day = fixtures.calendar[dayIndex]
  const vals = fixtures.competitors.map((c) => (day.isWeekend ? c.weekendAdr : c.weekdayAdr))
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function RateCalendar({
  fixtures,
  assumptions,
  draftPricing,
  baselineAdr,
  dayCursor,
  onDraftAdrChange,
}: {
  fixtures: SimFixtures
  assumptions: SimAssumptions
  draftPricing: CommittedPricing
  baselineAdr: number[]
  dayCursor: number
  onDraftAdrChange: (dayIndex: number, value: number) => void
}) {
  const days = fixtures.calendar.slice(dayCursor, dayCursor + 14)

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            <th className="px-2 py-2.5 font-semibold">Label</th>
            <th className="px-2 py-2.5 font-semibold">Baseline ADR</th>
            <th className="px-2 py-2.5 font-semibold">Draft ADR</th>
            <th className="px-2 py-2.5 font-semibold">Competitor avg</th>
            <th className="px-2 py-2.5 font-semibold">Preview OCC%</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => {
            const dayIndex = day.dayIndex
            const draftAdr = draftPricing.dailyAdr[dayIndex] ?? 0
            const baseline = baselineAdr[dayIndex] ?? 0
            const comp = competitorAvg(fixtures, dayIndex)
            const preview = previewDay({
              fixtures,
              assumptions,
              committed: draftPricing,
              dayIndex,
            })
            const belowFloor = draftAdr < draftPricing.priceFloor

            return (
              <tr
                key={dayIndex}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
              >
                <td className="px-2 py-2.5 font-medium text-navy-900">
                  {day.label}
                  {day.isWeekend ? (
                    <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-teal-600">
                      WE
                    </span>
                  ) : null}
                </td>
                <td className="px-2 py-2.5 tabular-nums text-slate-600">¥{Math.round(baseline)}</td>
                <td className="px-2 py-2.5">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={draftAdr}
                    onChange={(e) => onDraftAdrChange(dayIndex, Number(e.target.value))}
                    className={`w-24 rounded-lg border px-2 py-1.5 tabular-nums text-navy-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
                      belowFloor
                        ? 'border-rose-300 bg-rose-50'
                        : 'border-slate-200 bg-white'
                    }`}
                    aria-label={`Draft ADR for ${day.label}`}
                  />
                </td>
                <td className="px-2 py-2.5 tabular-nums text-slate-600">¥{Math.round(comp)}</td>
                <td className="px-2 py-2.5 tabular-nums font-medium text-navy-900">
                  {preview.occPct.toFixed(1)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
