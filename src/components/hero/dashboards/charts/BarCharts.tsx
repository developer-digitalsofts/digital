import { memo } from 'react'

type Props = {
  labels: string[]
  series: { label: string; color: string; values: number[] }[]
  animate?: boolean
}

function maxInSeries(series: { values: number[] }[]) {
  return Math.max(...series.flatMap((s) => s.values), 1)
}

export const GroupedBarChart = memo(function GroupedBarChart({ labels, series, animate = false }: Props) {
  const max = maxInSeries(series)
  const plotHeight = 112
  const colCount = labels.length

  return (
    <div className="flex h-full min-h-[88px] flex-col lg:min-h-[118px]">
      <div className="relative border-b border-slate-100 pb-1" style={{ height: plotHeight }}>
        {[0, 1, 2].map((line) => (
          <div
            key={line}
            className="pointer-events-none absolute inset-x-0 border-t border-dashed border-slate-100"
            style={{ bottom: `${((line + 1) / 4) * plotHeight}px` }}
          />
        ))}
        <div
          className="grid h-full w-full items-end gap-1 lg:gap-1.5"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
          {labels.map((label, i) => (
            <div key={label} className="flex h-full items-end justify-center gap-0.5 lg:gap-1">
              {series.map((s) => {
                const barHeight = Math.max(10, Math.round((s.values[i] / max) * (plotHeight - 8)))
                return (
                  <div
                    key={s.label}
                    className={`w-2 rounded-t-sm lg:w-2.5 ${animate ? 'dm-hero__bar-rise' : ''}`}
                    style={{
                      height: barHeight,
                      backgroundColor: s.color,
                      animationDelay: animate ? `${i * 60}ms` : undefined,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
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

type DualProps = {
  labels: string[]
  actual: number[]
  target: number[]
  animate?: boolean
}

export const DualBarChart = memo(function DualBarChart({ labels, actual, target, animate = false }: DualProps) {
  return (
    <GroupedBarChart
      labels={labels}
      series={[
        { label: 'Actual', color: '#f47c4d', values: actual },
        { label: 'Target', color: '#94a3b8', values: target },
      ]}
      animate={animate}
    />
  )
})

type StackProps = {
  labels: string[]
  inbound: number[]
  outbound: number[]
  animate?: boolean
}

export const DualLineBarChart = memo(function DualLineBarChart({ labels, inbound, outbound, animate = false }: StackProps) {
  return (
    <GroupedBarChart
      labels={labels}
      series={[
        { label: 'Inbound', color: '#14b8a6', values: inbound },
        { label: 'Outbound', color: '#f47c4d', values: outbound },
      ]}
      animate={animate}
    />
  )
})
