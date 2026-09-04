import { memo, useId } from 'react'

import { mockV2 } from '../tokens'



type Series = { label: string; color: string; values: number[]; area?: boolean }



type Props = {

  labels: string[]

  series: Series[]

  animate?: boolean

  height?: number

}



export const AreaLineChart = memo(function AreaLineChart({ labels, series, animate = false, height = 120 }: Props) {

  const uid = useId().replace(/:/g, '')

  const primary = series[0]

  const secondary = series[1]

  const max = Math.max(...series.flatMap((s) => s.values), 1)

  const w = 100

  const h = height



  const points = (values: number[]) =>

    values

      .map((v, i) => {

        const x = (i / Math.max(values.length - 1, 1)) * w

        const y = h - (v / max) * (h - 12) - 6

        return `${x},${y}`

      })

      .join(' ')



  const areaPoints = primary ? `0,${h} ${points(primary.values)} ${w},${h}` : ''



  return (

    <div className="dm-mock-v2__chart">

      <svg viewBox={`0 0 ${w} ${h}`} className="dm-mock-v2__chart-svg" preserveAspectRatio="none" aria-hidden>

        {[0.25, 0.5, 0.75].map((r) => (

          <line key={r} x1="0" y1={h * r} x2={w} y2={h * r} stroke={mockV2.border} strokeWidth="0.35" />

        ))}

        {primary?.area ? (

          <>

            <defs>

              <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">

                <stop offset="0%" stopColor={mockV2.coral} stopOpacity="0.18" />

                <stop offset="100%" stopColor={mockV2.coral} stopOpacity="0" />

              </linearGradient>

            </defs>

            <polygon

              points={areaPoints}

              fill={`url(#area-${uid})`}

              className={animate ? 'dm-mock-v2__chart-draw' : undefined}

            />

          </>

        ) : null}

        {primary ? (

          <polyline

            fill="none"

            stroke={mockV2.coral}

            strokeWidth="2"

            strokeLinejoin="round"

            strokeLinecap="round"

            points={points(primary.values)}

            className={animate ? 'dm-mock-v2__chart-draw' : undefined}

          />

        ) : null}

        {secondary ? (

          <polyline

            fill="none"

            stroke={mockV2.amber}

            strokeWidth="1.5"

            strokeLinejoin="round"

            strokeLinecap="round"

            points={points(secondary.values)}

            className={animate ? 'dm-mock-v2__chart-draw dm-mock-v2__chart-draw--delay' : undefined}

          />

        ) : null}

      </svg>

      <div className="dm-mock-v2__chart-labels">

        {labels.map((l) => (

          <span key={l}>{l}</span>

        ))}

      </div>

    </div>

  )

})



export function BarComparisonChart({

  labels,

  a,

  b,

  aLabel,

  bLabel,

  animate = false,

}: {

  labels: string[]

  a: number[]

  b: number[]

  aLabel: string

  bLabel: string

  animate?: boolean

}) {

  const max = Math.max(...a, ...b, 1)

  return (

    <div className="dm-mock-v2__bar-chart">

      <div className="dm-mock-v2__bar-chart-legend">

        <span><i style={{ background: mockV2.coral }} />{aLabel}</span>

        <span><i style={{ background: mockV2.coralSoft }} />{bLabel}</span>

      </div>

      <div className="dm-mock-v2__bar-chart-cols">

        {labels.map((label, i) => (

          <div key={label} className="dm-mock-v2__bar-chart-col">

            <div className="dm-mock-v2__bar-chart-bars">

              <div

                className={`dm-mock-v2__bar-chart-bar ${animate ? 'dm-mock-v2__bar-rise' : ''}`}

                style={{ height: `${(a[i] / max) * 100}%`, background: mockV2.coral }}

              />

              <div

                className={`dm-mock-v2__bar-chart-bar ${animate ? 'dm-mock-v2__bar-rise' : ''}`}

                style={{ height: `${(b[i] / max) * 100}%`, background: mockV2.coralSoft, animationDelay: '60ms' }}

              />

            </div>

            <span>{label}</span>

          </div>

        ))}

      </div>

    </div>

  )

}



export function DonutSplit({

  segments,

  center,

  size = 72,

}: {

  segments: { label: string; value: number; color: string }[]

  center: string

  size?: number

}) {

  const total = segments.reduce((s, x) => s + x.value, 0) || 1

  let acc = 0

  const stops = segments

    .map((s) => {

      const start = (acc / total) * 100

      acc += s.value

      return `${s.color} ${start}% ${(acc / total) * 100}%`

    })

    .join(', ')



  return (

    <div className="dm-mock-v2__donut">

      <div className="dm-mock-v2__donut-ring" style={{ width: size, height: size, background: `conic-gradient(${stops})` }}>

        <div className="dm-mock-v2__donut-hole">

          <span>{center}</span>

        </div>

      </div>

      <ul className="dm-mock-v2__donut-legend">

        {segments.map((s) => (

          <li key={s.label}>

            <span><i style={{ background: s.color }} />{s.label}</span>

            <span>{Math.round((s.value / total) * 100)}%</span>

          </li>

        ))}

      </ul>

    </div>

  )

}



export function HealthBars({ items }: { items: { label: string; value: number; tone?: 'teal' | 'blue' | 'success' | 'primary' | 'amber' }[] }) {

  const colors = {

    teal: mockV2.coral,

    primary: mockV2.coral,

    blue: mockV2.coralSoft,

    amber: mockV2.amber,

    success: mockV2.success,

  }

  return (

    <ul className="dm-mock-v2__health-bars">

      {items.map((item) => (

        <li key={item.label}>

          <div className="dm-mock-v2__health-bars-head">

            <span>{item.label}</span>

            <span>{item.value}%</span>

          </div>

          <div className="dm-mock-v2__health-bars-track">

            <span style={{ width: `${item.value}%`, background: colors[item.tone ?? 'primary'] }} />

          </div>

        </li>

      ))}

    </ul>

  )

}



export function Sparkline({ values, color = mockV2.coral }: { values: number[]; color?: string }) {

  if (values.length < 2) return null

  const max = Math.max(...values)

  const min = Math.min(...values)

  const range = max - min || 1

  const pts = values

    .map((v, i) => {

      const x = (i / (values.length - 1)) * 48

      const y = 16 - ((v - min) / range) * 14 - 1

      return `${x},${y}`

    })

    .join(' ')

  return (

    <svg viewBox="0 0 48 16" className="dm-mock-v2__spark" aria-hidden>

      <polyline fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" points={pts} />

    </svg>

  )

}


