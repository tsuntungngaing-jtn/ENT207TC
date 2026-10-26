import { CheckCircle2, Lightbulb, Sparkles } from 'lucide-react'
import {
  researchFinding,
  researchReasoning,
  researchSources,
} from '../data/mock'
import { TopBar } from '../components/layout/TopBar'
import { ConfidenceBar, Page, Panel, SectionTitle } from '../components/ui/Primitives'

export function ResearchPage() {
  return (
    <>
      <TopBar
        title="Research Agent"
        subtitle="External intelligence for Tengchong demand context"
      />
      <Page>
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-12 animate-fade-up">
          <Panel className="lg:col-span-3">
            <SectionTitle title="Knowledge sources" subtitle="Live inputs" />
            <ul className="space-y-3">
              {researchSources.map((s) => (
                <li
                  key={s.name}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-navy-900">{s.name}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 ring-1 ring-emerald-200">
                      {s.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{s.detail}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="lg:col-span-5">
            <SectionTitle
              title="AI reasoning"
              subtitle="Chain-of-thought from multi-source research"
            />
            <div className="space-y-3">
              {researchReasoning.map((step, i) => (
                <div key={step} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-teal-300">
                    {i + 1}
                  </div>
                  <p className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-700">
                    {step}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-teal-700">
              <Sparkles className="h-3.5 w-3.5 animate-pulse-soft" />
              Research pass complete · 5 sources reconciled
            </div>
          </Panel>

          <Panel className="lg:col-span-4">
            <SectionTitle title="Actionable findings" />
            <div className="rounded-2xl bg-navy-900 p-5 text-white">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300">
                <Lightbulb className="h-3.5 w-3.5" />
                Finding
              </div>
              <p className="text-lg font-bold leading-snug">{researchFinding.title}</p>

              <div className="mt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Evidence
                </p>
                <ul className="space-y-2">
                  {researchFinding.evidence.map((e) => (
                    <li key={e} className="flex gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <ConfidenceBar value={researchFinding.confidence} />
              </div>

              <div className="mt-4 rounded-xl bg-teal-500/15 p-3 ring-1 ring-teal-400/30">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-300">
                  Operational implication
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-teal-50">
                  {researchFinding.implication}
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </Page>
    </>
  )
}
