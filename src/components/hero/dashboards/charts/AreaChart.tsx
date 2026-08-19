import { memo } from 'react'

type StackProps = {
  labels: string[]
  series: { label: string; color: string; values: number[] }[]
  animate?: boolean
}

export const StackedBarChart = memo(function StackedBarChart({ labels, series, animate = false }: StackProps) {
  const maxTotals = labels.map((_, i) => series.reduce((sum, s) => sum + s.values[i], 0))
  const max = Math.max(...maxTotals, 1)
  const plotHeight = 112
  const colCount = labels.length

  return (
    <div className="flex h-full min-h-[88px] flex-col lg:min-h-[118px]">
      <div
        className="grid items-end gap-1.5 lg:gap-2"
        style={{ height: plotHeight, gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
      >
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col justify-end gap-0.5">
            {series.map((s) => (
              <div
                key={s.label}
                className={`w-full rounded-sm ${animate ? 'dm-hero__bar-rise' : ''}`}
                style={{
                  height: Math.max(4, Math.round((s.values[i] / max) * (plotHeight - 8))),
                  backgroundColor: s.color,
                  animationDelay: animate ? `${i * 70}ms` : undefined,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        className="mt-1 grid gap-1 text-center text-[7px] text-slate-400 lg:text-[8px]"
        style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
      >
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
})

type Props = {
  labels: string[]
  values: number[]
  animate?: boolean
}

export const AreaChart = memo(function AreaChart({ labels, values, animate = false }: Props) {
  const max = Math.max(...values, 1)
  const w = 100
  const h = 40
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - (v / max) * (h - 4) - 2
    return `${x},${y}`
  })
  const line = points.join(' ')
  const area = `${line} ${w},${h} 0,${h}`

  return (
    <div className="flex h-full min-h-[88px] flex-col lg:min-h-[118px]">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full flex-1" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="heroAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f47c4d" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f47c4d" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {[10, 20, 30].map((y) => (
          <line key={y} x1="0" y1={y} x2={w} y2={y} stroke="#eef2f7" strokeWidth="0.5" />
        ))}
        <polygon points={area} fill="url(#heroAreaFill)" className={animate ? 'dm-hero__fade-in' : ''} />
        <polyline
          fill="none"
          stroke="#f47c4d"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={line}
          className={animate ? 'dm-hero__fade-in' : ''}
        />
      </svg>
      <div className="mt-1 grid gap-0 text-center text-[7px] text-slate-400 lg:text-[8px]" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
})
