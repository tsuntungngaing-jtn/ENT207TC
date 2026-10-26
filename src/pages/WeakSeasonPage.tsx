import { AlertTriangle, Database, ShieldCheck } from 'lucide-react'
import { demandForecast, diagnosisCauses } from '../data/mock'
import { DemandChart } from '../components/charts/Charts'
import { TopBar } from '../components/layout/TopBar'
import { ConfidenceBar, Page, Panel, SectionTitle } from '../components/ui/Primitives'

export function WeakSeasonPage() {
  const avgPredicted =
    Math.round(
      demandForecast.reduce((s, d) => s + d.predicted, 0) / demandForecast.length,
    )
  const expectedRevenue = demandForecast.reduce((s, d) => s + d.revenue, 0)

  return (
    <>
      <TopBar
        title="Weak Season Analysis"
        subtitle="Predict & Diagnose · next 14 days"
      />
      <Page>
        <div className="mx-auto flex max-w-7xl flex-col gap-5 animate-fade-up">
          <Panel>
            <SectionTitle
              title="Next 14 Days Demand Prediction"
              subtitle="Model blends booking pace, seasonality, weather, and competitor rates"
            />
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <ForecastStat label="Predicted occupancy" value={`${avgPredicted}%`} hint="Avg next 14 days" />
              <ForecastStat
                label="Expected revenue"
                value={`¥${(expectedRevenue / 1000).toFixed(1)}k`}
                hint="Gross room revenue"
              />
              <ForecastStat label="vs historical" value="−18 pts" hint="Occupancy gap" danger />
            </div>
            <DemandChart data={demandForecast} />
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-5 bg-teal-500" /> Predicted
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-5 border-t-2 border-dashed border-slate-400" /> Historical average
              </span>
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-rose-50 px-4 py-3 ring-1 ring-rose-100">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-risk" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
                  Problem detected
                </p>
                <p className="mt-1 text-base font-semibold text-navy-900">
                  Weekday occupancy decreased by 24% compared with historical average.
                </p>
              </div>
            </div>

            <SectionTitle title="Possible causes" subtitle="Ranked by model confidence with supporting evidence" />
            <div className="grid gap-4 lg:grid-cols-3">
              {diagnosisCauses.map((cause) => (
                <div
                  key={cause.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                >
                  <div className="mb-2 text-xs font-bold text-teal-600">Cause {cause.id}</div>
                  <h3 className="text-base font-bold text-navy-900">{cause.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-800">Evidence: </span>
                    {cause.evidence}
                  </p>
                  <div className="mt-4">
                    <ConfidenceBar value={cause.confidence} />
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-xs text-slate-500">
                    <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-500" />
                    <span>{cause.sources.join(' · ')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800 ring-1 ring-teal-100">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Diagnosis is explainable and ready for Research Agent enrichment.
            </div>
          </Panel>
        </div>
      </Page>
    </>
  )
}

function ForecastStat({
  label,
  value,
  hint,
  danger,
}: {
  label: string
  value: string
  hint: string
  danger?: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-extrabold ${danger ? 'text-risk' : 'text-navy-900'}`}>
        {value}
      </div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  )
}
