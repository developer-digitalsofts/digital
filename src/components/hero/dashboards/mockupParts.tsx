import {
  AlertTriangle,
  Coffee,
  Droplets,
  Headphones,
  ShoppingBag,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Wallet,
  Watch,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const KPI_VARIANTS = ['dm-hero__kpi-tile--mint', 'dm-hero__kpi-tile--peach', 'dm-hero__kpi-tile--sky', 'dm-hero__kpi-tile--rose'] as const
const KPI_ICONS = [TrendingUp, Wallet, TrendingDown] as const

export function Panel({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`dm-hero__panel ${className}`}>
      <p className="dm-hero__panel-title">{title}</p>
      <div className="dm-hero__panel-body">{children}</div>
    </div>
  )
}

export function KpiStrip({ items }: { items: { label: string; value: string; hint?: string; tone?: 'up' | 'down' | 'warn' | 'muted' }[] }) {
  return (
    <div className="dm-hero__kpi-row">
      {items.slice(0, 3).map((item, i) => {
        const Icon = KPI_ICONS[i % KPI_ICONS.length]
        const hintClass =
          item.tone === 'warn' || item.hint?.includes('attention')
            ? 'dm-hero__kpi-hint dm-hero__kpi-hint--warn'
            : item.tone === 'down' || item.hint?.startsWith('-')
              ? 'dm-hero__kpi-hint dm-hero__kpi-hint--warn'
              : item.tone === 'muted'
                ? 'dm-hero__kpi-hint dm-hero__kpi-hint--muted'
                : 'dm-hero__kpi-hint'
        return (
          <div key={item.label} className={`dm-hero__kpi-tile ${KPI_VARIANTS[i % KPI_VARIANTS.length]}`}>
            <span className="dm-hero__kpi-icon" aria-hidden>
              <Icon strokeWidth={2.25} />
            </span>
            <p className="dm-hero__kpi-label">{item.label}</p>
            <p className="dm-hero__kpi-value">{item.value}</p>
            {item.hint ? <p className={hintClass}>{item.hint}</p> : null}
          </div>
        )
      })}
    </div>
  )
}

export function FillBarChart({
  values,
  colors,
  labels,
  legend,
  animate = false,
}: {
  values: number[][]
  colors: string[]
  labels: string[]
  legend?: string[]
  animate?: boolean
}) {
  const max = Math.max(...values.flat(), 1)

  return (
    <div className="dm-hero__fill-chart-wrap">
      <div className="dm-hero__fill-chart">
        <div className="dm-hero__fill-chart-y" aria-hidden>
          {[max, Math.round(max * 0.66), Math.round(max * 0.33), 0].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="dm-hero__fill-chart-main">
          <div className="dm-hero__fill-chart-grid" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} />
            ))}
          </div>
          <div className="dm-hero__fill-chart-cols">
            {values[0].map((_, i) => (
              <div key={labels[i] ?? i} className="dm-hero__fill-chart-col">
                <div className="dm-hero__fill-chart-bars">
                  {values.map((series, s) => (
                    <div
                      key={s}
                      className={`dm-hero__fill-chart-bar ${animate ? 'dm-hero__bar-rise' : ''}`}
                      style={{
                        height: `${Math.max(8, (series[i] / max) * 100)}%`,
                        backgroundColor: colors[s],
                      }}
                    />
                  ))}
                </div>
                <span className="dm-hero__fill-chart-label">{labels[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {legend ? (
        <div className="dm-hero__chart-legend">
          {legend.map((label, i) => (
            <span key={label} className="dm-hero__chart-legend-item">
              <span className="dm-hero__chart-legend-swatch" style={{ backgroundColor: colors[i] }} />
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function SparkAreaChart({
  values,
  color = '#FF714A',
  labels,
}: {
  values: number[]
  color?: string
  labels?: string[]
}) {
  const max = Math.max(...values, 1)
  const w = 240
  const h = 100
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w
      const y = h - (v / max) * (h - 8) - 4
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="dm-hero__area-chart">
      <svg viewBox={`0 0 ${w} ${h}`} className="dm-hero__area-chart-svg" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="heroSparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#heroSparkFill)" />
        <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={pts} />
      </svg>
      {labels ? (
        <div className="dm-hero__area-chart-labels">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function BranchProgressList({
  rows,
}: {
  rows: { name: string; value: number; amount: string }[]
}) {
  return (
    <ul className="dm-hero__branch-list">
      {rows.map((row) => (
        <li key={row.name} className="dm-hero__branch-list-item">
          <div className="dm-hero__branch-list-head">
            <span>{row.name}</span>
            <span>{row.amount}</span>
          </div>
          <div className="dm-hero__branch-bar-track">
            <div className="dm-hero__branch-bar-fill" style={{ width: `${row.value}%` }} />
          </div>
          <span className="dm-hero__branch-list-pct">{row.value}% of target</span>
        </li>
      ))}
    </ul>
  )
}

export function GaugeWidget({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
  const r = 22
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c

  return (
    <div className="dm-hero__gauge">
      <svg viewBox="0 0 52 52" className="dm-hero__gauge-ring" aria-hidden>
        <circle cx="26" cy="26" r={r} fill="none" stroke="#e8edf3" strokeWidth="5" />
        <circle
          cx="26"
          cy="26"
          r={r}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 26 26)"
        />
        <text x="26" y="29" textAnchor="middle" className="dm-hero__gauge-text">
          {value}%
        </text>
      </svg>
      <div>
        <p className="dm-hero__gauge-label">{label}</p>
        <p className="dm-hero__gauge-sub">{sublabel}</p>
      </div>
    </div>
  )
}

const productIconMap: Record<string, LucideIcon> = {
  headphones: Headphones,
  watch: Watch,
  phone: Smartphone,
  coffee: Coffee,
  dates: ShoppingBag,
  water: Droplets,
  bag: ShoppingBag,
  speaker: ShoppingBag,
}

export function ProductRows({ items }: { items: { name: string; qty: string; icon?: string }[] }) {
  return (
    <ul className="dm-hero__product-list">
      {items.map((item) => {
        const Icon = productIconMap[item.icon ?? 'bag'] ?? ShoppingBag
        return (
          <li key={item.name} className="dm-hero__list-row">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="dm-hero__list-icon">
                <Icon className="size-3" />
              </span>
              <span className="truncate">{item.name}</span>
            </span>
            <span className="shrink-0 font-bold text-slate-800">{item.qty}</span>
          </li>
        )
      })}
    </ul>
  )
}

export function BranchGrid({
  rows,
}: {
  rows: { branch: string; inStock: string; low: string; out: string }[]
}) {
  return (
    <div className="dm-hero__table-wrap">
      <table className="dm-hero__table">
        <thead>
          <tr>
            <th>Branch</th>
            <th>In Stock</th>
            <th>Low</th>
            <th>Out</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.branch}>
              <td>{row.branch}</td>
              <td>{row.inStock}</td>
              <td>{row.low}</td>
              <td>{row.out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DonutWidget({
  segments,
  center,
  centerSub = 'Total',
  size = 80,
}: {
  segments: { label: string; value: number; color: string }[]
  center: string
  centerSub?: string
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
    <div className="dm-hero__donut-layout">
      <div
        className="dm-hero__donut-ring"
        style={{ width: size, height: size, background: `conic-gradient(${stops})` }}
        aria-hidden
      >
        <div className="dm-hero__donut-ring-hole">
          <p className="dm-hero__donut-center">{center}</p>
          <p className="dm-hero__donut-center-sub">{centerSub}</p>
        </div>
      </div>
      <div className="dm-hero__donut-legend">
        {segments.map((segment) => (
          <div key={segment.label} className="dm-hero__donut-legend-row">
            <span className="dm-hero__donut-legend-left">
              <span className="dm-hero__donut-legend-swatch" style={{ backgroundColor: segment.color }} />
              <span>{segment.label}</span>
            </span>
            <span>{segment.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatusBadge({ text, tone }: { text: string; tone: 'positive' | 'warning' | 'critical' | 'info' | 'neutral' | 'purple' }) {
  const map = {
    positive: 'dm-hero__status--positive',
    warning: 'dm-hero__status--warning',
    critical: 'dm-hero__status--critical',
    info: 'dm-hero__status--info',
    neutral: 'dm-hero__status--info',
    purple: 'dm-hero__status--info',
  } as const
  return <span className={`dm-hero__status ${map[tone]}`}>{text}</span>
}

export function renderStatusCell(status: string | { text: string; tone?: 'positive' | 'warning' | 'critical' | 'info' | 'neutral' | 'purple' }) {
  if (typeof status === 'string') return status
  return <StatusBadge text={status.text} tone={status.tone ?? 'neutral'} />
}

export function AlertStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="dm-hero__alert-stat">
      <AlertTriangle className="dm-hero__alert-stat-icon" strokeWidth={2.25} />
      <div>
        <p className="dm-hero__stat-value">{value}</p>
        <p className="dm-hero__kpi-hint dm-hero__kpi-hint--warn">{label}</p>
      </div>
    </div>
  )
}

export function CompactTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: (string | React.ReactNode)[][]
}) {
  return (
    <div className="dm-hero__table-wrap">
      <table className="dm-hero__table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function LeaveList({ rows }: { rows: { name: string; type: string; status: string }[] }) {
  return (
    <ul className="dm-hero__leave-list">
      {rows.map((row) => (
        <li key={row.name} className="dm-hero__leave-row">
          <div className="dm-hero__leave-main">
            <span className="dm-hero__leave-name">{row.name}</span>
            <span className="dm-hero__leave-type">{row.type}</span>
          </div>
          <span className={`dm-hero__leave-status dm-hero__leave-status--${row.status.toLowerCase()}`}>{row.status}</span>
        </li>
      ))}
    </ul>
  )
}
