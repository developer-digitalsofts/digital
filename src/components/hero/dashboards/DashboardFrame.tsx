import {
  BarChart3,
  CalendarDays,
  LayoutGrid,
  MoreHorizontal,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from 'lucide-react'
import type { HeroModuleType } from '../../../types/heroCarousel'
import type { DashboardFrameProps } from './types'

const SIDEBAR_MODULES: { type: HeroModuleType; icon: typeof LayoutGrid }[] = [
  { type: 'erp', icon: LayoutGrid },
  { type: 'finance', icon: Wallet },
  { type: 'inventory', icon: Package },
  { type: 'pos', icon: ShoppingCart },
  { type: 'hr', icon: Users },
]

const SIDEBAR_EXTRA = [BarChart3, Settings]

export function DashboardFrame({ title, subtitle, moduleType = 'erp', children }: DashboardFrameProps) {
  return (
    <div className="dm-hero__dashboard-frame">
      <div className="dm-hero__dash-shell">
        <aside className="dm-hero__dash-sidebar" aria-hidden>
          {SIDEBAR_MODULES.map(({ type, icon: Icon }) => (
            <div
              key={type}
              className={`dm-hero__dash-sidebar-icon ${type === moduleType ? 'is-active' : ''}`}
            >
              <Icon strokeWidth={2} aria-hidden />
            </div>
          ))}
          <div className="dm-hero__dash-sidebar-spacer" aria-hidden />
          {SIDEBAR_EXTRA.map((Icon, i) => (
            <div key={i} className="dm-hero__dash-sidebar-icon">
              <Icon strokeWidth={2} aria-hidden />
            </div>
          ))}
        </aside>

        <div className="dm-hero__dash-main">
          <header className="dm-hero__dash-header">
            <div className="min-w-0">
              <p className="dm-hero__dash-header-title">{title}</p>
              {subtitle ? <p className="dm-hero__dash-header-sub">{subtitle}</p> : null}
            </div>
            <div className="dm-hero__dash-header-actions" aria-hidden>
              <div className="dm-hero__dash-date">
                <CalendarDays aria-hidden />
                <span>May 20 – May 26, 2025</span>
              </div>
              <button type="button" className="dm-hero__dash-menu-btn" aria-hidden tabIndex={-1}>
                <MoreHorizontal aria-hidden />
              </button>
            </div>
          </header>
          <div className="dm-hero__dash-body">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function DashboardBody({ children }: { children: React.ReactNode }) {
  return <div className="dm-hero__dash-content">{children}</div>
}
