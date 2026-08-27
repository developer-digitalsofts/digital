/** Decorative mini-dashboard previews for the ERP function grid cards. */
import { useDashboardRegionalData } from '../hero/dashboards/useDashboardRegionalData'

const accountBars = [
  42, 58, 48, 72, 55, 68, 62, 78, 70, 82, 65, 74, 88, 76, 80, 72, 85, 68, 90, 78, 82, 70, 86, 74, 80, 68, 76, 84, 72, 78,
] as const

export function AccountsFinancePreview() {
  const { modulePreviewCashFlow } = useDashboardRegionalData()
  return (
    <div className="erp-function-grid__preview-panel" aria-hidden>
      <div className="erp-function-grid__preview-kpi">
        <span className="erp-function-grid__preview-kpi-label">Cash Flow This Month</span>
        <div className="erp-function-grid__preview-kpi-row">
          <strong className="erp-function-grid__preview-kpi-value">{modulePreviewCashFlow}</strong>
          <span className="erp-function-grid__preview-trend erp-function-grid__preview-trend--up">+12.6% vs last month</span>
        </div>
      </div>
      <div className="erp-function-grid__preview-bars" aria-hidden>
        {accountBars.map((height, i) => (
          <span
            key={i}
            className={`erp-function-grid__preview-bar ${i % 2 === 0 ? 'erp-function-grid__preview-bar--primary' : 'erp-function-grid__preview-bar--secondary'}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}

const inventoryRows = [
  { item: 'Cotton Yarn', stock: '12,450', status: 'In Stock', tone: 'ok' as const },
  { item: 'Dyed Fabric', stock: '8,200', status: 'In Stock', tone: 'ok' as const },
  { item: 'Trims & Accessories', stock: '1,180', status: 'Low Stock', tone: 'warn' as const },
]

export function InventoryPreview() {
  return (
    <div className="erp-function-grid__preview-panel erp-function-grid__preview-panel--table" aria-hidden>
      <table className="erp-function-grid__preview-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventoryRows.map((row) => (
            <tr key={row.item}>
              <td>{row.item}</td>
              <td>{row.stock}</td>
              <td>
                <span className={`erp-function-grid__status erp-function-grid__status--${row.tone}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PosPreview() {
  const { modulePreviewPosSales } = useDashboardRegionalData()
  return (
    <div className="erp-function-grid__preview-panel" aria-hidden>
      <div className="erp-function-grid__preview-kpi">
        <span className="erp-function-grid__preview-kpi-label">Today&apos;s Sales</span>
        <div className="erp-function-grid__preview-kpi-row">
          <strong className="erp-function-grid__preview-kpi-value">{modulePreviewPosSales}</strong>
          <span className="erp-function-grid__preview-trend erp-function-grid__preview-trend--up">+18.3%</span>
        </div>
      </div>
      <svg className="erp-function-grid__preview-area-chart" viewBox="0 0 280 72" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="erp-pos-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(244, 124, 77, 0.28)" />
            <stop offset="100%" stopColor="rgba(244, 124, 77, 0.02)" />
          </linearGradient>
        </defs>
        <path
          d="M0 58 L24 52 L48 46 L72 50 L96 38 L120 42 L144 28 L168 34 L192 22 L216 30 L240 18 L264 24 L280 12 L280 72 L0 72 Z"
          fill="url(#erp-pos-fill)"
        />
        <path
          d="M0 58 L24 52 L48 46 L72 50 L96 38 L120 42 L144 28 L168 34 L192 22 L216 30 L240 18 L264 24 L280 12"
          fill="none"
          stroke="#f47c4d"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export function ProductionPreview() {
  return (
    <div className="erp-function-grid__preview-panel erp-function-grid__preview-panel--compact" aria-hidden>
      <div className="erp-function-grid__preview-split">
        <div className="erp-function-grid__preview-metric">
          <span className="erp-function-grid__preview-metric-label">Work Orders</span>
          <strong className="erp-function-grid__preview-metric-value">35 In Process</strong>
        </div>
        <div className="erp-function-grid__preview-donut" aria-hidden>
          <svg viewBox="0 0 48 48" className="erp-function-grid__preview-donut-svg">
            <circle cx="24" cy="24" r="18" fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <circle
              cx="24"
              cy="24"
              r="18"
              fill="none"
              stroke="#f47c4d"
              strokeWidth="6"
              strokeDasharray="78 113"
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
            <circle
              cx="24"
              cy="24"
              r="18"
              fill="none"
              stroke="#141d38"
              strokeWidth="6"
              strokeDasharray="35 156"
              strokeDashoffset="-78"
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function PayrollPreview() {
  const { modulePreviewPayroll } = useDashboardRegionalData()
  return (
    <div className="erp-function-grid__preview-panel erp-function-grid__preview-panel--compact" aria-hidden>
      <div className="erp-function-grid__preview-split">
        <div className="erp-function-grid__preview-metric">
          <span className="erp-function-grid__preview-metric-label">Total Payroll</span>
          <strong className="erp-function-grid__preview-metric-value">{modulePreviewPayroll} This Month</strong>
        </div>
        <div className="erp-function-grid__preview-avatar" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function InvoicingPreview() {
  return (
    <div className="erp-function-grid__preview-panel erp-function-grid__preview-panel--compact" aria-hidden>
      <div className="erp-function-grid__preview-split">
        <div className="erp-function-grid__preview-metric">
          <span className="erp-function-grid__preview-metric-label">Invoices This Month</span>
          <div className="erp-function-grid__preview-metric-row">
            <strong className="erp-function-grid__preview-metric-value">1,286</strong>
            <span className="erp-function-grid__preview-trend erp-function-grid__preview-trend--up">+22.1%</span>
          </div>
        </div>
        <div className="erp-function-grid__preview-doc-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M8 4h8l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
            <path d="M16 4v4h4M9 13h6M9 17h4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
