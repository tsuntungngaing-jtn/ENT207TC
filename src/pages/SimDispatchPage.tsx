import { useMemo, useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { KpiRail } from '../components/sim/KpiRail'
import { RateCalendar } from '../components/sim/RateCalendar'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'
import { previewDay } from '../sim/engine'
import { pricingEqual } from '../sim/state'
import { useSim } from '../sim/SimContext'

export function SimDispatchPage() {
  const {
    state,
    draftPricing,
    notice,
    setDraftPricing,
    approveDraft,
    rejectDraft,
    clearNotice,
  } = useSim()

  const [modifyFocus, setModifyFocus] = useState(false)

  const isDirty = !pricingEqual(draftPricing, state.committed)
  const floorBreach = draftPricing.dailyAdr.some((adr) => adr < draftPricing.priceFloor)

  const previewKpis = useMemo(() => {
    const dayIndex = Math.min(state.dayCursor, state.fixtures.calendar.length - 1)
    return previewDay({
      fixtures: state.fixtures,
      assumptions: state.assumptions,
      committed: draftPricing,
      dayIndex,
    })
  }, [draftPricing, state.assumptions, state.dayCursor, state.fixtures])

  const day =
    state.fixtures.calendar[Math.min(state.dayCursor, state.fixtures.calendar.length - 1)]

  const onDraftAdrChange = (dayIndex: number, value: number) => {
    const next = [...draftPricing.dailyAdr]
    next[dayIndex] = Number.isFinite(value) ? value : 0
    setDraftPricing({ dailyAdr: next })
  }

  return (
    <>
      <TopBar
        title="Dispatch Board"
        subtitle="Pricing draft · human approve before commit"
      />
      <Page>
        <div className="mx-auto flex max-w-7xl flex-col gap-5 animate-fade-up">
          {notice ? (
            <div
              role="status"
              className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              <span>{notice}</span>
              <button
                type="button"
                onClick={clearNotice}
                className="shrink-0 text-xs font-semibold uppercase tracking-wide text-amber-700 hover:text-amber-900"
              >
                Dismiss
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                Preview (uncommitted)
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Day {state.dayCursor}
                {day ? ` · ${day.label}` : ''} · draft KPIs only until Approve
              </p>
            </div>
            <DispatchStatusPill dirty={isDirty} />
          </div>

          <KpiRail kpis={previewKpis} />

          <div className="grid gap-5 lg:grid-cols-5">
            <Panel className={`lg:col-span-3 ${modifyFocus ? 'ring-2 ring-teal-300/60' : ''}`}>
              <SectionTitle
                title="Rate calendar"
                subtitle="Next 14 days from cursor · draft ADR edits"
              />
              <RateCalendar
                fixtures={state.fixtures}
                assumptions={state.assumptions}
                draftPricing={draftPricing}
                baselineAdr={state.committed.dailyAdr}
                dayCursor={state.dayCursor}
                onDraftAdrChange={onDraftAdrChange}
              />
            </Panel>

            <Panel className="lg:col-span-2">
              <SectionTitle title="Pricing knobs" subtitle="Bound to draft until Approve" />
              <div className="flex flex-col gap-5">
                <label className="block">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-navy-900">Global discount %</span>
                    <span className="tabular-nums text-slate-500">
                      {draftPricing.globalDiscountPct.toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    step={1}
                    value={draftPricing.globalDiscountPct}
                    onChange={(e) =>
                      setDraftPricing({ globalDiscountPct: Number(e.target.value) })
                    }
                    className="w-full accent-teal-600"
                  />
                </label>

                <label className="block">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-navy-900">Price floor</span>
                    <span className="tabular-nums text-slate-500">
                      ¥{Math.round(draftPricing.priceFloor)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={draftPricing.priceFloor}
                    onChange={(e) => setDraftPricing({ priceFloor: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 tabular-nums text-navy-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={draftPricing.weekdayPackage}
                    onChange={(e) => setDraftPricing({ weekdayPackage: e.target.checked })}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  Weekday package (−8% ADR, +LOS)
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={draftPricing.weekendProtect}
                    onChange={(e) => setDraftPricing({ weekendProtect: e.target.checked })}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  Weekend protect (floor vs competitors)
                </label>

                {floorBreach ? (
                  <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                    Approve disabled: one or more draft ADR values are below the price floor (¥
                    {Math.round(draftPricing.priceFloor)}).
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    disabled={floorBreach || !isDirty}
                    onClick={() => {
                      approveDraft()
                      setModifyFocus(false)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setModifyFocus(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800"
                  >
                    <Pencil className="h-4 w-4" />
                    Modify
                  </button>
                  <button
                    type="button"
                    disabled={!isDirty}
                    onClick={() => {
                      rejectDraft()
                      setModifyFocus(false)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Only Approve commits pricing (and persists). Advance on sandbox always uses
                  committed rates.
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </Page>
    </>
  )
}

function DispatchStatusPill({ dirty }: { dirty: boolean }) {
  const styles = dirty
    ? 'bg-amber-50 text-amber-700 ring-amber-200'
    : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${styles}`}
    >
      {dirty ? 'Draft dirty' : 'Synced'}
    </span>
  )
}
