import { ArrowRight, X } from 'lucide-react'
import type { AgentStage } from '../../types'
import { StatusPill } from '../ui/Primitives'

export function AgentPipeline({
  stages,
  activeId,
  onSelect,
}: {
  stages: AgentStage[]
  activeId?: string | null
  onSelect: (stage: AgentStage) => void
}) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-stretch gap-2">
        {stages.map((stage, i) => {
          const selected = activeId === stage.id
          return (
            <div key={stage.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelect(stage)}
                className={[
                  'w-[132px] rounded-2xl border px-3 py-3 text-left transition-all',
                  selected
                    ? 'border-teal-400 bg-teal-50 shadow-md shadow-teal-500/10'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm',
                  stage.status === 'active' && !selected ? 'ring-2 ring-teal-400/30' : '',
                ].join(' ')}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <StatusPill status={stage.status} />
                </div>
                <div className="text-sm font-bold leading-snug text-navy-900">{stage.short}</div>
                <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500">
                  {stage.title}
                </div>
              </button>
              {i < stages.length - 1 ? (
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function AgentDetailPanel({
  stage,
  onClose,
}: {
  stage: AgentStage
  onClose: () => void
}) {
  return (
    <div className="animate-fade-up rounded-2xl border border-teal-200 bg-gradient-to-br from-white to-teal-50/40 p-5 shadow-lg shadow-teal-500/5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <StatusPill status={stage.status} />
            <span className="text-xs font-medium text-slate-400">Agent detail</span>
          </div>
          <h3 className="text-lg font-bold text-navy-900">{stage.title}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-navy-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">Purpose</h4>
          <p className="text-sm leading-relaxed text-slate-700">{stage.purpose}</p>
        </div>
        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
            Data sources
          </h4>
          <div className="flex flex-wrap gap-2">
            {stage.dataSources.map((s) => (
              <span
                key={s}
                className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-navy-800 ring-1 ring-slate-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
            Reasoning process
          </h4>
          <ul className="space-y-2">
            {stage.reasoning.map((r) => (
              <li key={r} className="flex gap-2 text-sm text-slate-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
            Generated insights
          </h4>
          <ul className="space-y-2">
            {stage.insights.map((insight) => (
              <li
                key={insight}
                className="rounded-xl bg-navy-900 px-3 py-2.5 text-sm text-teal-50"
              >
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
