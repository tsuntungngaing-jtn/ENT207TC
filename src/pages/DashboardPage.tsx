import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight, MapPin, Star } from 'lucide-react'
import {
  agentStages,
  occupancySpark,
  property,
  revenueSpark,
  riskFactors,
  riskScore,
} from '../data/mock'
import type { AgentStage } from '../types'
import { AgentDetailPanel, AgentPipeline } from '../components/agents/AgentPipeline'
import { MiniArea } from '../components/charts/Charts'
import { RiskScoreRing } from '../components/charts/RiskScoreRing'
import { TopBar } from '../components/layout/TopBar'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'

export function DashboardPage() {
  const [selected, setSelected] = useState<AgentStage | null>(agentStages[1])

  return (
    <>
      <TopBar
        title="Operations Dashboard"
        subtitle="Weak-season decision support · live property pulse"
      />
      <Page>
        <div className="mx-auto flex max-w-7xl flex-col gap-5 animate-fade-up">
          <div className="grid gap-5 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
                    Property overview
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900">
                    {property.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-teal-500" />
                    {property.location} · {property.rooms} rooms
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 ring-1 ring-amber-200">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {property.satisfaction} satisfaction
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricBlock
                  label="Occupancy"
                  value={`${property.occupancy}%`}
                  delta={property.occupancyTrend}
                  chart={<MiniArea data={occupancySpark} dataKey="value" color="#dc2626" />}
                />
                <MetricBlock
                  label="Revenue trend"
                  value={`${property.revenueTrend}%`}
                  delta={property.revenueTrend}
                  chart={<MiniArea data={revenueSpark} dataKey="value" color="#d97706" />}
                />
                <MetricBlock
                  label="ADR"
                  value={`¥${property.adr}`}
                  delta={-5}
                  chart={<MiniArea data={revenueSpark} dataKey="value" color="#0d9488" />}
                />
              </div>
            </Panel>

            <Panel>
              <SectionTitle
                title="Weak Season Risk"
                subtitle="Composite risk from demand & market signals"
              />
              <RiskScoreRing score={riskScore} />
              <p className="mt-3 text-center text-sm font-semibold text-risk">
                Elevated risk · operator attention recommended
              </p>
              <Link
                to="/weak-season"
                className="mt-4 block rounded-xl bg-navy-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Open full analysis
              </Link>
            </Panel>
          </div>

          <Panel>
            <SectionTitle
              title="Contributing factors"
              subtitle="Demand and market drivers behind the risk score"
            />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {riskFactors.map((f) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition hover:border-teal-200 hover:bg-teal-50/40"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {f.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-bold ${
                        f.direction === 'down'
                          ? 'text-risk'
                          : f.direction === 'up'
                            ? 'text-ok'
                            : 'text-warn'
                      }`}
                    >
                      {f.direction === 'down' ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                      {f.value}
                    </span>
                  </div>
                  <div className="font-semibold text-navy-900">{f.label}</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.detail}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle
              title="AI Agent workflow"
              subtitle="Click any stage to inspect purpose, sources, reasoning, and insights"
            />
            <AgentPipeline
              stages={agentStages}
              activeId={selected?.id}
              onSelect={setSelected}
            />
            {selected ? (
              <div className="mt-4">
                <AgentDetailPanel stage={selected} onClose={() => setSelected(null)} />
              </div>
            ) : null}
          </Panel>
        </div>
      </Page>
    </>
  )
}

function MetricBlock({
  label,
  value,
  delta,
  chart,
}: {
  label: string
  value: string
  delta: number
  chart: ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="text-2xl font-extrabold text-navy-900">{value}</div>
        <div
          className={`mb-1 text-xs font-bold ${delta < 0 ? 'text-risk' : 'text-ok'}`}
        >
          {delta > 0 ? '+' : ''}
          {delta}%
        </div>
      </div>
      <div className="mt-2">{chart}</div>
    </div>
  )
}
