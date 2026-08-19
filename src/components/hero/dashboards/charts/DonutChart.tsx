import { memo } from 'react'
import type { DonutSegment } from '../types'

type Props = {
  segments: DonutSegment[]
  centerLabel?: string
  animate?: boolean
  size?: number
}

export const DonutChart = memo(function DonutChart({ segments, centerLabel, animate = false, size = 88 }: Props) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  let offset = 0
  const r = 16
  const c = 2 * Math.PI * r

  return (
    <div className="flex items-center gap-2 lg:gap-3">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 40 40" className="size-full -rotate-90" aria-hidden>
          <circle cx="20" cy="20" r={r} fill="none" stroke="#eef2f7" strokeWidth="5" />
          {segments.map((seg, i) => {
            const dash = (seg.value / total) * c
            const el = (
              <circle
                key={seg.label}
                cx="20"
                cy="20"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="5"
                strokeDasharray={`${dash} ${c}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                className={animate ? 'dm-hero__fade-in' : ''}
                style={animate ? { animationDelay: `${i * 80}ms` } : undefined}
              />
            )
            offset += dash
            return el
          })}
        </svg>
        {centerLabel ? (
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-brand-deep lg:text-[9px]">
            {centerLabel}
          </span>
        ) : null}
      </div>
      <ul className="min-w-0 flex-1 space-y-1 text-[7px] text-slate-600 sm:text-[8px] lg:text-[9px]">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1">
              <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="truncate">{seg.label}</span>
            </span>
            <span className="shrink-0 font-semibold text-slate-800">{seg.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
})

export function DonutChartCompact({ segments, animate }: { segments: DonutSegment[]; animate?: boolean }) {
  return <DonutChart segments={segments} animate={animate} size={72} />
}
