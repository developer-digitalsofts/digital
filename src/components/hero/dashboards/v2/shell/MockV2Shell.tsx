import type { ReactNode } from 'react'
import {
  BarChart3,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from 'lucide-react'
import type { HeroModuleType } from '../../../../../types/heroCarousel'
import { SITE_LOGO_SRC } from '../../../../../constants'
import { AiInsightPanel } from '../components/Widgets'
import { mockV2 } from '../tokens'

const NAV: { type: HeroModuleType; icon: typeof LayoutGrid; label: string }[] = [
  { type: 'erp', icon: LayoutGrid, label: 'Overview' },
  { type: 'finance', icon: Wallet, label: 'Finance' },
  { type: 'inventory', icon: Package, label: 'Inventory' },
  { type: 'pos', icon: ShoppingCart, label: 'POS' },
  { type: 'hr', icon: Users, label: 'HR' },
]

export function MockV2Sidebar({ activeModule = 'erp' }: { activeModule?: HeroModuleType }) {
  return (
    <aside className="dm-mock-v2__sidebar" aria-hidden>
      <div className="dm-mock-v2__brand">
        <img src={SITE_LOGO_SRC} alt="" className="dm-mock-v2__brand-logo" width={28} height={28} />
        <span className="dm-mock-v2__brand-text">DigitalManager</span>
      </div>
      <nav className="dm-mock-v2__nav">
        {NAV.map(({ type, icon: Icon, label }) => (
          <div key={type} className={`dm-mock-v2__nav-item ${type === activeModule ? 'is-active' : ''}`}>
            <Icon strokeWidth={1.75} aria-hidden />
            <span>{label}</span>
          </div>
        ))}
      </nav>
      <div className="dm-mock-v2__nav-item dm-mock-v2__nav-item--muted" aria-hidden>
        <BarChart3 strokeWidth={1.75} />
        <span>Reports</span>
      </div>
      <div className="dm-mock-v2__nav-item dm-mock-v2__nav-item--muted" aria-hidden>
        <Settings strokeWidth={1.75} />
        <span>Settings</span>
      </div>
      <div className="dm-mock-v2__sidebar-spacer" />
      <div className="dm-mock-v2__user" aria-hidden>
        <span className="dm-mock-v2__user-avatar">AM</span>
        <div>
          <span className="dm-mock-v2__user-name">Alex Morgan</span>
          <span className="dm-mock-v2__user-role">Administrator</span>
        </div>
      </div>
    </aside>
  )
}

export function MockV2Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="dm-mock-v2__header">
      <div className="dm-mock-v2__header-copy">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="dm-mock-v2__header-actions" aria-hidden>
        <span className="dm-mock-v2__header-date">Mar 1 – Mar 31, 2026</span>
        <span className="dm-mock-v2__header-icon">⌕</span>
        <span className="dm-mock-v2__header-icon dm-mock-v2__header-icon--dot">◔</span>
        <span className="dm-mock-v2__header-avatar">AM</span>
      </div>
    </header>
  )
}

export function MockV2KpiStrip({
  items,
  animate = false,
}: {
  items: { label: string; value: string; trend: string; tone?: string; sparkline?: number[] }[]
  animate?: boolean
}) {
  return (
    <div className="dm-mock-v2__kpis">
      {items.slice(0, 4).map((item, i) => (
        <div
          key={item.label}
          className={`dm-mock-v2__kpi ${item.tone === 'positive' ? 'dm-mock-v2__kpi--positive' : ''} ${animate ? 'dm-mock-v2__kpi--rise' : ''}`}
          style={animate ? { animationDelay: `${i * 70}ms` } : undefined}
        >
          <div className="dm-mock-v2__kpi-top">
            <span className="dm-mock-v2__kpi-label">{item.label}</span>
            {item.sparkline ? (
              <svg viewBox="0 0 48 16" className="dm-mock-v2__kpi-spark" aria-hidden>
                <polyline
                  fill="none"
                  stroke={mockV2.coral}
                  strokeWidth="1.75"
                  points={item.sparkline
                    .map((v, idx) => {
                      const max = Math.max(...item.sparkline!)
                      const min = Math.min(...item.sparkline!)
                      const x = (idx / (item.sparkline!.length - 1)) * 48
                      const y = 16 - ((v - min) / Math.max(max - min, 1)) * 14 - 1
                      return `${x},${y}`
                    })
                    .join(' ')}
                />
              </svg>
            ) : (
              <span className="dm-mock-v2__kpi-spark dm-mock-v2__kpi-spark--empty" aria-hidden />
            )}
          </div>
          <p className="dm-mock-v2__kpi-value">{item.value}</p>
          <span className={`dm-mock-v2__kpi-trend dm-mock-v2__kpi-trend--${item.tone ?? 'neutral'}`}>{item.trend}</span>
        </div>
      ))}
    </div>
  )
}

export function MockV2Panel({
  title,
  legend,
  className = '',
  children,
}: {
  title: string
  legend?: React.ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section className={`dm-mock-v2__panel ${className}`}>
      <div className="dm-mock-v2__panel-head">
        <h4>{title}</h4>
        {legend}
      </div>
      <div className="dm-mock-v2__panel-body">{children}</div>
    </section>
  )
}

type ShellProps = {
  moduleType: HeroModuleType
  title: string
  subtitle?: string
  kpis: { label: string; value: string; trend: string; tone?: string; sparkline?: number[] }[]
  animate?: boolean
  floatInsight?: { message: string; action: string }
  children: ReactNode
}

export function MockV2Shell({ moduleType, title, subtitle, kpis, animate = false, floatInsight, children }: ShellProps) {
  return (
    <div className={`dm-mock-v2 ${animate ? 'dm-mock-v2--animate' : ''}`}>
      <div className="dm-mock-v2__ambient" aria-hidden />
      <div className="dm-mock-v2__frame">
        <div className="dm-mock-v2__shell">
          <MockV2Sidebar activeModule={moduleType} />
          <div className="dm-mock-v2__main">
            <MockV2Header title={title} subtitle={subtitle} />
            <div className="dm-mock-v2__body">
              <MockV2KpiStrip items={kpis} animate={animate} />
              {children}
            </div>
          </div>
        </div>
      </div>
      {floatInsight ? (
        <div className="dm-mock-v2__float-wrap" aria-hidden>
          <AiInsightPanel message={floatInsight.message} action={floatInsight.action} variant="float" />
        </div>
      ) : null}
    </div>
  )
}
