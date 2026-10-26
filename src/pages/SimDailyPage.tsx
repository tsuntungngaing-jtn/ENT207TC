import { useMemo } from 'react'
import { TopBar } from '../components/layout/TopBar'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'
import { useSim } from '../sim/SimContext'
import type { DailyLog } from '../sim/types'

function formatYen(n: number) {
  return `¥${Math.round(n)}`
}

function channelRanking(log: DailyLog, channels: { id: string; name: string }[]) {
  const nameById = new Map(channels.map((c) => [c.id, c.name]))
  return Object.entries(log.channelRevenue)
    .map(([id, revenue]) => ({
      id,
      name: nameById.get(id) ?? id,
      revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}

function roomTypeContribution(
  log: DailyLog,
  roomTypes: { id: string; name: string; count: number; baseAdr: number }[],
) {
  const totalCount = roomTypes.reduce((s, rt) => s + rt.count, 0)
  if (totalCount <= 0) return []
  return roomTypes
    .map((rt) => {
      const share = rt.count / totalCount
      const approxRooms = log.occupiedRooms * share
      const approxRevenue = approxRooms * rt.baseAdr
      return {
        id: rt.id,
        name: rt.name,
        approxRooms,
        approxRevenue,
        sharePct: share * 100,
      }
    })
    .sort((a, b) => b.approxRevenue - a.approxRevenue)
}

export function SimDailyPage() {
  const { state, resetScenario } = useSim()
  const { dailyLogs, fixtures } = state

  const newestFirst = useMemo(() => [...dailyLogs].reverse(), [dailyLogs])
  const latest = dailyLogs.length > 0 ? dailyLogs[dailyLogs.length - 1] : null

  const channelTop = useMemo(
    () => (latest ? channelRanking(latest, fixtures.channels) : []),
    [latest, fixtures.channels],
  )

  const roomTop = useMemo(
    () => (latest ? roomTypeContribution(latest, fixtures.property.roomTypes) : []),
    [latest, fixtures.property.roomTypes],
  )

  return (
    <>
      <TopBar title="Daily Log" subtitle="Committed day history · channel & room mix · alerts" />
      <Page>
        <div className="mx-auto flex max-w-7xl flex-col gap-5 animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                Operations report
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {dailyLogs.length === 0
                  ? 'No days logged yet'
                  : `${dailyLogs.length} day${dailyLogs.length === 1 ? '' : 's'} · latest ${latest?.label ?? ''}`}
              </p>
            </div>
            <button
              type="button"
              onClick={resetScenario}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:border-slate-300"
            >
              Reset scenario
            </button>
          </div>

          {dailyLogs.length === 0 ? (
            <Panel>
              <SectionTitle title="Daily" subtitle="Committed day history and alerts" />
              <p className="text-sm text-slate-600">
                Advance the clock from Sandbox after approving rates.
              </p>
            </Panel>
          ) : (
            <>
              <div className="grid gap-5 lg:grid-cols-2">
                <Panel>
                  <SectionTitle
                    title="Channel revenue TOP"
                    subtitle={`From latest day · ${latest?.label ?? ''}`}
                  />
                  <ol className="flex flex-col gap-2">
                    {channelTop.map((row, i) => (
                      <li
                        key={row.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-navy-900">
                          <span className="mr-2 tabular-nums text-slate-400">#{i + 1}</span>
                          {row.name}
                        </span>
                        <span className="tabular-nums font-semibold text-navy-900">
                          {formatYen(row.revenue)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Panel>

                <Panel>
                  <SectionTitle
                    title="Room-type contribution"
                    subtitle="Approx. by inventory share × base ADR"
                  />
                  <ol className="flex flex-col gap-2">
                    {roomTop.map((row, i) => (
                      <li
                        key={row.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm"
                      >
                        <div>
                          <span className="font-medium text-navy-900">
                            <span className="mr-2 tabular-nums text-slate-400">#{i + 1}</span>
                            {row.name}
                          </span>
                          <p className="mt-0.5 text-xs text-slate-500">
                            ~{row.approxRooms.toFixed(1)} rooms · {row.sharePct.toFixed(0)}% inventory
                          </p>
                        </div>
                        <span className="tabular-nums font-semibold text-navy-900">
                          {formatYen(row.approxRevenue)}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Panel>
              </div>

              <Panel>
                <SectionTitle
                  title="Alerts"
                  subtitle={`Latest day · ${latest?.label ?? ''}`}
                />
                {latest && latest.alerts.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {latest.alerts.map((alert) => (
                      <li
                        key={alert}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
                      >
                        {alert}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">No alerts on the latest logged day.</p>
                )}
              </Panel>

              <Panel>
                <SectionTitle
                  title="Day cards"
                  subtitle="Newest first · arrivals · in-house · departures · LOS · revenue · OCC"
                />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {newestFirst.map((log) => (
                    <article
                      key={log.dayIndex}
                      className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-navy-900">{log.label}</h3>
                        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          Day {log.dayIndex}
                        </span>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                        <div>
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Arrivals
                          </dt>
                          <dd className="tabular-nums font-semibold text-navy-900">{log.arrivals}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            In-house
                          </dt>
                          <dd className="tabular-nums font-semibold text-navy-900">
                            {log.guestsInHouse.toFixed(1)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Departures
                          </dt>
                          <dd className="tabular-nums font-semibold text-navy-900">{log.departures}</dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Avg LOS
                          </dt>
                          <dd className="tabular-nums font-semibold text-navy-900">
                            {log.avgLos.toFixed(2)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            Revenue
                          </dt>
                          <dd className="tabular-nums font-semibold text-navy-900">
                            {formatYen(log.revenue)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                            OCC
                          </dt>
                          <dd className="tabular-nums font-semibold text-navy-900">
                            {log.occPct.toFixed(1)}%
                          </dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              </Panel>
            </>
          )}
        </div>
      </Page>
    </>
  )
}
