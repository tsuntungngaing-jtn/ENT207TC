import { ArrowUpRight, RefreshCw } from 'lucide-react'
import { feedbackMetrics } from '../data/mock'
import { TopBar } from '../components/layout/TopBar'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'

export function FeedbackPage() {
  const occ = feedbackMetrics[0]
  const lift = occ.after - occ.before

  return (
    <>
      <TopBar
        title="Performance Feedback"
        subtitle="Outcome tracking and model learning loop"
      />
      <Page>
        <div className="mx-auto flex max-w-7xl flex-col gap-5 animate-fade-up">
          <div className="grid gap-5 lg:grid-cols-3">
            <Panel>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Before action</p>
              <p className="mt-3 text-sm text-slate-500">Occupancy</p>
              <p className="text-4xl font-extrabold text-navy-900">{occ.before}%</p>
              <p className="mt-2 text-xs text-slate-500">Baseline locked at strategy approval</p>
            </Panel>
            <Panel>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">After action</p>
              <p className="mt-3 text-sm text-slate-500">Occupancy</p>
              <p className="text-4xl font-extrabold text-teal-600">{occ.after}%</p>
              <p className="mt-2 text-xs text-slate-500">Measured 7 days post-launch</p>
            </Panel>
            <Panel className="bg-navy-900 text-white">
              <p className="text-xs font-bold uppercase tracking-wide text-teal-300">
                Strategy effectiveness
              </p>
              <p className="mt-3 flex items-center gap-2 text-4xl font-extrabold text-teal-300">
                +{lift}%
                <ArrowUpRight className="h-8 w-8" />
              </p>
              <p className="mt-2 text-sm text-slate-300">Occupancy lift vs pre-action baseline</p>
            </Panel>
          </div>

          <Panel>
            <SectionTitle title="Metric comparison" subtitle="Before / after across key KPIs" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {feedbackMetrics.map((m) => {
                const delta = +(m.after - m.before).toFixed(1)
                const positive = m.label === 'Weekday ADR' ? delta <= 0 : delta > 0
                return (
                  <div key={m.label} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {m.label}
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <div>
                        <div className="text-xs text-slate-500">Before</div>
                        <div className="font-bold text-slate-600">
                          {m.unit === '¥' ? m.unit : ''}
                          {m.before}
                          {m.unit !== '¥' ? m.unit : ''}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">After</div>
                        <div className="text-lg font-extrabold text-navy-900">
                          {m.unit === '¥' ? m.unit : ''}
                          {m.after}
                          {m.unit !== '¥' ? m.unit : ''}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`mt-3 text-sm font-bold ${positive ? 'text-ok' : 'text-warn'}`}
                    >
                      {delta > 0 ? '+' : ''}
                      {delta}
                      {m.unit === '%' ? ' pts' : m.unit === '¥' ? ' ¥' : ''}
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel className="flex items-start gap-4 border-teal-200 bg-teal-50/60">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white">
              <RefreshCw className="h-5 w-5 animate-pulse-soft" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Feedback collected. Model improvement in progress.
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                Outcome tags from this cycle are updating weak-season priors. Similar demand regimes
                will prefer weekday packages over unfenced ADR cuts in future recommendations.
              </p>
            </div>
          </Panel>
        </div>
      </Page>
    </>
  )
}
