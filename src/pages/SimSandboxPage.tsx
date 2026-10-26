import { useMemo, useState } from 'react'
import { TopBar } from '../components/layout/TopBar'
import { KpiRail } from '../components/sim/KpiRail'
import { SandboxMap, type MapGeoJson } from '../components/sim/SandboxMap'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'
import { mapGeoJson } from '../sim/loadFixtures'
import { useSim } from '../sim/SimContext'

function seasonTag(factors: {
  seasonFactor: number
  eventFactor: number
  weatherFactor: number
  isWeekend: boolean
  demandIndex: number
}): string {
  const bits: string[] = []
  if (factors.isWeekend) bits.push('Weekend')
  else bits.push('Weekday')
  if (factors.seasonFactor >= 1.15) bits.push('Peak season')
  else if (factors.seasonFactor <= 0.85) bits.push('Shoulder / weak')
  else bits.push('Base season')
  if (factors.eventFactor >= 1.1) bits.push('Event lift')
  if (factors.weatherFactor <= 0.9) bits.push('Weather drag')
  if (factors.demandIndex >= 1.1) bits.push('High demand')
  else if (factors.demandIndex <= 0.85) bits.push('Soft demand')
  return bits.join(' · ')
}

export function SimSandboxPage() {
  const { state, draftDirty, setAssumptions, advanceDays, resetScenario, notice, clearNotice } =
    useSim()
  const [showHeat, setShowHeat] = useState(true)
  const [showCompetitors, setShowCompetitors] = useState(true)
  const [showOd, setShowOd] = useState(false)

  const day = state.fixtures.calendar[Math.min(state.dayCursor, state.fixtures.calendar.length - 1)]
  const tag = useMemo(
    () =>
      day
        ? seasonTag({
            seasonFactor: day.seasonFactor,
            eventFactor: day.eventFactor,
            weatherFactor: day.weatherFactor,
            isWeekend: day.isWeekend,
            demandIndex: day.demandIndex,
          })
        : '—',
    [day],
  )

  const { assumptions } = state

  return (
    <>
      <TopBar
        title="Operations Sandbox"
        subtitle="Homestay demand · supply · advance clock"
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
                Live preview
                {draftDirty ? (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-amber-800">
                    Draft dirty
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Day {state.dayCursor}
                {day ? ` · ${day.label}` : ''} · <span className="font-medium text-navy-900">{tag}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => advanceDays(1)}
                className="rounded-xl bg-navy-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-navy-800"
              >
                Advance 1 day
              </button>
              <button
                type="button"
                onClick={() => advanceDays(7)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-navy-900 shadow-sm hover:border-teal-300"
              >
                Advance 7 days
              </button>
              <button
                type="button"
                onClick={resetScenario}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:border-slate-300"
              >
                Reset scenario
              </button>
            </div>
          </div>

          <KpiRail kpis={state.liveKpis} />

          <div className="grid gap-5 lg:grid-cols-5">
            <Panel className="lg:col-span-3">
              <SectionTitle title="Tengchong map" subtitle="Offline SVG · GeoJSON layers" />
              <SandboxMap
                geojson={mapGeoJson as MapGeoJson}
                showHeat={showHeat}
                showCompetitors={showCompetitors}
                showOd={showOd}
                promoCorridor={assumptions.promoCorridor}
              />
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showHeat}
                    onChange={(e) => setShowHeat(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  Heat
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showCompetitors}
                    onChange={(e) => setShowCompetitors(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  Competitors
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showOd}
                    onChange={(e) => setShowOd(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  OD sketch
                </label>
              </div>
            </Panel>

            <Panel className="lg:col-span-2">
              <SectionTitle title="Assumptions" subtitle="Updates live KPIs via preview" />
              <div className="flex flex-col gap-5">
                <label className="block">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-navy-900">Promo corridor</span>
                    <span className="tabular-nums text-slate-500">{assumptions.promoCorridor.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.6}
                    max={1.5}
                    step={0.01}
                    value={assumptions.promoCorridor}
                    onChange={(e) => setAssumptions({ promoCorridor: Number(e.target.value) })}
                    className="w-full accent-teal-600"
                  />
                </label>

                <label className="block">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-navy-900">Sellable rooms</span>
                    <span className="tabular-nums text-slate-500">{assumptions.sellableRooms}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={assumptions.sellableRooms}
                    onChange={(e) => setAssumptions({ sellableRooms: Number(e.target.value) })}
                    className="w-full accent-teal-600"
                  />
                </label>

                <div>
                  <p className="mb-2 text-sm font-medium text-navy-900">Channel weights</p>
                  <div className="flex flex-col gap-3">
                    {state.fixtures.channels.map((ch) => {
                      const w = assumptions.channelWeights[ch.id] ?? ch.weight
                      return (
                        <label key={ch.id} className="block">
                          <div className="mb-1 flex justify-between text-xs text-slate-600">
                            <span>{ch.name}</span>
                            <span className="tabular-nums">{w.toFixed(2)}</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={w}
                            onChange={(e) =>
                              setAssumptions({
                                channelWeights: {
                                  ...assumptions.channelWeights,
                                  [ch.id]: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full accent-teal-600"
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </Page>
    </>
  )
}
