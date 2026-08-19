import type { DetailMockupVariant } from '../../../types/detailPageSections'

type Props = {
  variant: DetailMockupVariant
  title?: string
}

type MockupSpec = {
  title: string
  subtitle: string
  kpis: { label: string; value: string; delta?: string }[]
  rows: { left: string; right: string; status?: string }[]
  sidebarActive: number
}

const MOCKUPS: Record<DetailMockupVariant, MockupSpec> = {
  petrol: {
    title: 'Tank & nozzle dashboard',
    subtitle: 'Live wet-stock and shift summary',
    kpis: [
      { label: 'Tank stock', value: '42,800 L', delta: '+1.2%' },
      { label: 'Nozzle sales', value: 'AED $1', delta: 'Shift A' },
      { label: 'Variance', value: '0.08%', delta: 'Within limit' },
    ],
    rows: [
      { left: 'Tank T-01 · Diesel', right: '18,420 L', status: 'ok' },
      { left: 'Nozzle N-04 · Petrol', right: 'AED $1', status: 'ok' },
      { left: 'Dip gain / loss', right: '-12 L', status: 'warn' },
      { left: 'Shift close pending', right: '2 nozzles', status: 'pending' },
    ],
    sidebarActive: 2,
  },
  accounts: {
    title: 'Finance control center',
    subtitle: 'Cash flow, receivables and bank status',
    kpis: [
      { label: 'Cash balance', value: 'AED $1', delta: '+4.1%' },
      { label: 'Receivables', value: 'AED $1', delta: '12 open' },
      { label: 'Bank unreconciled', value: 'AED $1', delta: '3 items' },
    ],
    rows: [
      { left: 'Cash receipt · INV-1042', right: 'AED $1', status: 'ok' },
      { left: 'Supplier payment · PO-88', right: 'AED $1', status: 'ok' },
      { left: 'Bank reconciliation', right: 'Pending', status: 'pending' },
      { left: 'P&L preview · May', right: 'AED $1 net', status: 'ok' },
    ],
    sidebarActive: 1,
  },
  inventory: {
    title: 'Inventory overview',
    subtitle: 'Stock levels, transfers and valuation',
    kpis: [
      { label: 'SKUs tracked', value: '1,248', delta: 'Active' },
      { label: 'Low stock', value: '17', delta: 'Reorder' },
      { label: 'Stock value', value: 'AED $1', delta: '+2.3%' },
    ],
    rows: [
      { left: 'Transfer · WH-A to WH-B', right: '240 units', status: 'ok' },
      { left: 'GRN · PO-5521', right: 'Received', status: 'ok' },
      { left: 'Fast-moving SKU alert', right: '8 items', status: 'warn' },
      { left: 'Valuation run', right: 'Completed', status: 'ok' },
    ],
    sidebarActive: 2,
  },
  production: {
    title: 'Production control',
    subtitle: 'Work orders, BOM and material consumption',
    kpis: [
      { label: 'Open orders', value: '14', delta: '3 due today' },
      { label: 'Output today', value: '2,480 units', delta: '+6%' },
      { label: 'Material variance', value: '1.4%', delta: 'Review' },
    ],
    rows: [
      { left: 'WO-104 · BOM run', right: 'In progress', status: 'pending' },
      { left: 'Consumption voucher', right: 'Posted', status: 'ok' },
      { left: 'Gate pass inward', right: 'Approved', status: 'ok' },
      { left: 'FOH absorption', right: 'Updated', status: 'ok' },
    ],
    sidebarActive: 3,
  },
  pos: {
    title: 'POS sales dashboard',
    subtitle: 'Daily sales, transactions and top products',
    kpis: [
      { label: 'Today sales', value: 'AED $1', delta: '+8.4%' },
      { label: 'Transactions', value: '412', delta: 'Live' },
      { label: 'Avg ticket', value: 'AED $1', delta: '+2%' },
    ],
    rows: [
      { left: 'Top product · Engine oil 1L', right: 'AED $1', status: 'ok' },
      { left: 'VAT invoice batch', right: 'Synced', status: 'ok' },
      { left: 'Returns today', right: '3', status: 'warn' },
      { left: 'Shift summary', right: 'Ready', status: 'ok' },
    ],
    sidebarActive: 3,
  },
  payroll: {
    title: 'Payroll & attendance',
    subtitle: 'Attendance, payroll summary and leave requests',
    kpis: [
      { label: 'Present today', value: '186', delta: '96%' },
      { label: 'Payroll run', value: 'AED $1', delta: 'Draft' },
      { label: 'Leave pending', value: '7', delta: 'Approve' },
    ],
    rows: [
      { left: 'Attendance import', right: 'Completed', status: 'ok' },
      { left: 'Overtime · Production', right: '14 staff', status: 'warn' },
      { left: 'Salary sheet · May', right: 'Review', status: 'pending' },
      { left: 'EOBI / tax calc', right: 'Ready', status: 'ok' },
    ],
    sidebarActive: 4,
  },
  textile: {
    title: 'Textile operations',
    subtitle: 'Fabric production, dyeing and batch tracking',
    kpis: [
      { label: 'Active batches', value: '22', delta: 'Floor 2' },
      { label: 'Fabric output', value: '18,400 m', delta: '+5%' },
      { label: 'WIP value', value: 'AED $1', delta: 'Live' },
    ],
    rows: [
      { left: 'Dyeing batch · DB-441', right: 'Running', status: 'pending' },
      { left: 'Knitting order', right: 'Completed', status: 'ok' },
      { left: 'Quality hold', right: '2 rolls', status: 'warn' },
      { left: 'Dispatch ready', right: '1,240 m', status: 'ok' },
    ],
    sidebarActive: 2,
  },
  agriculture: {
    title: 'Smart agriculture ERP',
    subtitle: 'Crop cycles, fields, inputs and farm profitability',
    kpis: [
      { label: 'Active crop cycles', value: '12', delta: 'Season' },
      { label: 'Fields cultivated', value: '840 ac', delta: 'Mapped' },
      { label: 'Harvest due', value: '18 days', delta: 'Wheat' },
    ],
    rows: [
      { left: 'Seed & fertilizer consumption', right: 'Updated', status: 'ok' },
      { left: 'Livestock count', right: '246 head', status: 'ok' },
      { left: 'Irrigation alert · Block C', right: 'Schedule due', status: 'warn' },
      { left: 'Farm P&L preview', right: 'AED $1', status: 'ok' },
    ],
    sidebarActive: 2,
  },
  poultry: {
    title: 'Poultry control shed',
    subtitle: 'Flock performance, feed and mortality tracking',
    kpis: [
      { label: 'Live birds', value: '48,200', delta: 'Shed 3' },
      { label: 'Feed consumed', value: '6.2 t', delta: 'Today' },
      { label: 'Mortality', value: '0.09%', delta: 'Normal' },
    ],
    rows: [
      { left: 'Feed issue voucher', right: 'Posted', status: 'ok' },
      { left: 'Weight sampling', right: 'Due', status: 'pending' },
      { left: 'Vaccination schedule', right: 'On track', status: 'ok' },
      { left: 'Sales dispatch', right: 'AED $1', status: 'ok' },
    ],
    sidebarActive: 2,
  },
  crm: {
    title: 'CRM pipeline',
    subtitle: 'Leads, follow-ups and conversion tracking',
    kpis: [
      { label: 'Open leads', value: '128', delta: '+12' },
      { label: 'Won this month', value: '34', delta: '18%' },
      { label: 'Follow-ups due', value: '19', delta: 'Today' },
    ],
    rows: [
      { left: 'Lead · Dubai distributor', right: 'Qualified', status: 'ok' },
      { left: 'Demo scheduled', right: 'Tomorrow', status: 'pending' },
      { left: 'Proposal sent', right: 'Awaiting', status: 'warn' },
      { left: 'Customer visit log', right: 'Updated', status: 'ok' },
    ],
    sidebarActive: 0,
  },
  'generic-industry': {
    title: 'Operations dashboard',
    subtitle: 'Branch activity and executive KPIs',
    kpis: [
      { label: 'Active branches', value: '12', delta: 'Live' },
      { label: 'Today revenue', value: 'AED $1', delta: '+3.8%' },
      { label: 'Open tasks', value: '28', delta: 'Ops' },
    ],
    rows: [
      { left: 'Daily close status', right: '8 / 12', status: 'pending' },
      { left: 'Stock alerts', right: '5 items', status: 'warn' },
      { left: 'Approvals queue', right: '4 pending', status: 'pending' },
      { left: 'Management report', right: 'Ready', status: 'ok' },
    ],
    sidebarActive: 0,
  },
  'generic-module': {
    title: 'Module dashboard',
    subtitle: 'Transactions, approvals and live reporting',
    kpis: [
      { label: 'Posted today', value: '146', delta: 'Vouchers' },
      { label: 'Pending approvals', value: '9', delta: 'Review' },
      { label: 'Report refresh', value: 'Live', delta: 'Now' },
    ],
    rows: [
      { left: 'Core transaction run', right: 'Completed', status: 'ok' },
      { left: 'Exception queue', right: '2 items', status: 'warn' },
      { left: 'Branch sync', right: 'All online', status: 'ok' },
      { left: 'Audit trail export', right: 'Available', status: 'ok' },
    ],
    sidebarActive: 1,
  },
}

const SIDEBAR_LABELS = ['Overview', 'Finance', 'Stock', 'Sales', 'HR', 'Reports']

function statusClass(status?: string) {
  if (status === 'warn') return 'accounts-proto-mockup__status--warn'
  if (status === 'pending') return 'accounts-proto-mockup__status--pending'
  return 'accounts-proto-mockup__status--ok'
}

export function DetailSoftwareMockup({ variant, title }: Props) {
  const spec = MOCKUPS[variant] ?? MOCKUPS['generic-module']

  return (
    <div className="accounts-proto-mockup" aria-hidden>
      <div className="accounts-proto-mockup__chrome">
        <span className="accounts-proto-mockup__dot accounts-proto-mockup__dot--r" />
        <span className="accounts-proto-mockup__dot accounts-proto-mockup__dot--y" />
        <span className="accounts-proto-mockup__dot accounts-proto-mockup__dot--g" />
        <span className="accounts-proto-mockup__url">app.digitalmanager.ae</span>
      </div>
      <div className="accounts-proto-mockup__shell">
        <aside className="accounts-proto-mockup__sidebar">
          {SIDEBAR_LABELS.map((label, idx) => (
            <div
              key={label}
              className={`accounts-proto-mockup__nav ${idx === spec.sidebarActive ? 'is-active' : ''}`}
            >
              <span className="accounts-proto-mockup__nav-icon" aria-hidden />
              <span>{label}</span>
            </div>
          ))}
        </aside>
        <div className="accounts-proto-mockup__main">
          <header className="accounts-proto-mockup__header">
            <div>
              <p className="accounts-proto-mockup__title">{title ?? spec.title}</p>
              <p className="accounts-proto-mockup__subtitle">{spec.subtitle}</p>
            </div>
          </header>
          <div className="accounts-proto-mockup__kpis">
            {spec.kpis.map((kpi) => (
              <div key={kpi.label} className="accounts-proto-mockup__kpi">
                <p className="accounts-proto-mockup__kpi-label">{kpi.label}</p>
                <p className="accounts-proto-mockup__kpi-value">{kpi.value}</p>
                {kpi.delta ? <p className="accounts-proto-mockup__kpi-delta">{kpi.delta}</p> : null}
              </div>
            ))}
          </div>
          <div className="accounts-proto-mockup__table">
            {spec.rows.map((row) => (
              <div key={row.left} className="accounts-proto-mockup__row">
                <span className="accounts-proto-mockup__row-left">{row.left}</span>
                <span className={`accounts-proto-mockup__row-right ${statusClass(row.status)}`}>
                  {row.right}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function mockupVariantForSlug(slug: string, kind: 'module' | 'industry'): DetailMockupVariant {
  const map: Record<string, DetailMockupVariant> = {
    'accounts-management-software': 'accounts',
    'inventory-management-software': 'inventory',
    'production-management-software': 'production',
    'point-of-sale-management-software': 'pos',
    'fbr-pos-integration-software': 'pos',
    'payroll-management-software': 'payroll',
    'petrol-pump-software': 'petrol',
    'petrol-gas-filling-station-software': 'petrol',
    'garments-manufacturing-software': 'textile',
    'cloud-erp-software-for-textile-industries': 'textile',
    'knitting-dyeing-industry-software': 'textile',
    'poultry-control-shed-management-software': 'poultry',
    'crm-software': 'crm',
  }
  return map[slug] ?? (kind === 'industry' ? 'generic-industry' : 'generic-module')
}
