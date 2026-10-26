import { type ReactNode } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { useAppState } from '../context/AppState'
import { TopBar } from '../components/layout/TopBar'
import {
  ConfidenceBar,
  Page,
  Panel,
  SectionTitle,
  StatusPill,
} from '../components/ui/Primitives'

export function StrategyPage() {
  const { strategies, setStrategyStatus, primaryApproval, setPrimaryApproval } = useAppState()

  return (
    <>
      <TopBar
        title="Strategy Center"
        subtitle="AI recommendations with human-in-the-loop approval"
      />
      <Page>
        <div className="mx-auto flex max-w-7xl flex-col gap-5 animate-fade-up">
          <Panel className="border-teal-200 bg-gradient-to-br from-white via-white to-teal-50/50">
            <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-teal-600">
              Human approval
            </div>
            <h2 className="text-xl font-extrabold text-navy-900">
              AI Recommendation: Launch weekday autumn package
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-navy-800">Reasoning: </span>
              Based on booking pace, competitor pricing, and weather. Weekday demand softens next
              week; weekend ADR should stay protected.
            </p>
            <div className="mt-4 max-w-sm">
              <ConfidenceBar value={76} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <ActionButton
                tone="approve"
                label="Approve"
                icon={<Check className="h-4 w-4" />}
                onClick={() => setPrimaryApproval('approved')}
              />
              <ActionButton
                tone="modify"
                label="Modify"
                icon={<Pencil className="h-4 w-4" />}
                onClick={() => setPrimaryApproval('modified')}
              />
              <ActionButton
                tone="reject"
                label="Reject"
                icon={<X className="h-4 w-4" />}
                onClick={() => setPrimaryApproval('rejected')}
              />
              <StatusPill status={primaryApproval} />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              The system keeps humans in control — no OTA price change executes without approval.
            </p>
            {primaryApproval === 'approved' ? (
              <p
                role="status"
                className="mt-3 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900"
              >
                Queued in Dispatch — draft shows 8% discount + weekday package; Approve there to
                commit.
              </p>
            ) : null}
          </Panel>

          <div>
            <SectionTitle
              title="Recommendation center"
              subtitle="Ranked strategies with impact, risk, and alternatives"
            />
            <div className="grid gap-4 lg:grid-cols-3">
              {strategies.map((s, i) => (
                <Panel key={s.id} className="flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-600">Recommendation {i + 1}</span>
                    <StatusPill status={s.status} />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {s.explanation}
                  </p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <Row label="Expected impact" value={s.impact} />
                    <Row label="Risk" value={s.risk} />
                    <Row label="Alternative" value={s.alternative} />
                  </dl>
                  <div className="mt-4">
                    <ConfidenceBar value={s.confidence} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SmallBtn label="Approve" onClick={() => setStrategyStatus(s.id, 'approved')} />
                    <SmallBtn label="Edit" onClick={() => setStrategyStatus(s.id, 'modified')} />
                    <SmallBtn label="Reject" onClick={() => setStrategyStatus(s.id, 'rejected')} danger />
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </div>
      </Page>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 font-semibold text-slate-500">{label}</dt>
      <dd className="text-navy-900">{value}</dd>
    </div>
  )
}

function ActionButton({
  tone,
  label,
  icon,
  onClick,
}: {
  tone: 'approve' | 'modify' | 'reject'
  label: string
  icon: ReactNode
  onClick: () => void
}) {
  const styles = {
    approve: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    modify: 'bg-navy-900 hover:bg-navy-800 text-white',
    reject: 'bg-white text-risk ring-1 ring-rose-200 hover:bg-rose-50',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles[tone]}`}
    >
      {icon}
      {label}
    </button>
  )
}

function SmallBtn({
  label,
  onClick,
  danger,
}: {
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition ${
        danger
          ? 'bg-white text-risk ring-rose-200 hover:bg-rose-50'
          : 'bg-slate-50 text-navy-900 ring-slate-200 hover:bg-teal-50 hover:ring-teal-200'
      }`}
    >
      {label}
    </button>
  )
}
