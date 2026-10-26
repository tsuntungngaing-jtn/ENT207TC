import type { ReactNode } from 'react'

export function Page({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex min-h-0 flex-1 flex-col overflow-hidden`}>
      <div className={`flex-1 overflow-y-auto px-4 py-5 sm:px-6 ${className}`}>{children}</div>
    </div>
  )
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-navy-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  )
}

export function ConfidenceBar({ value }: { value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Confidence</span>
        <span className="text-navy-900">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function StatusPill({
  status,
}: {
  status: 'pending' | 'approved' | 'modified' | 'rejected' | 'complete' | 'active'
}) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    modified: 'bg-sky-50 text-sky-700 ring-sky-200',
    rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
    complete: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    active: 'bg-teal-50 text-teal-700 ring-teal-200',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  )
}
