export function RiskScoreRing({ score }: { score: number }) {
  const size = 168
  const stroke = 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const tone = score >= 70 ? '#dc2626' : score >= 45 ? '#d97706' : '#059669'

  return (
    <div className="relative mx-auto flex h-[168px] w-[168px] items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-extrabold tracking-tight text-navy-900">{score}</div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">/ 100</div>
      </div>
    </div>
  )
}
