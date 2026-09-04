import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HeroModuleDashboard } from './dashboards/HeroModuleDashboard'
import { mergeMockupOverrides } from './dashboards/heroMockupDefaults'
import { mergeMockV2Overrides } from './dashboards/v2/useMockV2Data'
import { getMockV2Defaults } from './dashboards/v2/data/moduleDefaults'

vi.mock('./dashboards/useDashboardRegionalData', () => ({
  useDashboardRegionalData: () => ({
    erpRevenueKpi: 'AED 2.4M',
    erpGrossKpi: 'AED 612K',
    erpReceivablesKpi: 'AED 318K',
    currency: 'AED',
    erpRevenueTarget: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      actual: [68, 72, 65, 78, 74, 82],
      target: [64, 70, 68, 72, 76, 80],
    },
    erpDocuments: {
      rows: [
        { doc: 'SO-20481', branch: 'Dubai', amount: 'AED 42.9K', status: { text: 'Posted', tone: 'info' } },
      ],
    },
    inventoryKpis: [{ label: 'x', value: 'AED 1.25M' }, { label: 'Inventory Value', value: 'AED 1.25M' }],
    financeCashKpi: 'AED 842K',
    financeNetProfitKpi: 'AED 560K',
    financeGroupedBars: { labels: ['Jan'], revenue: [1], expenses: [1] },
    financeAgingDonut: [{ label: '0-30', value: 42, color: '#12B8A6' }],
    financeTransactions: { rows: [{ ref: 'PAY-1', account: 'A', amount: 'AED 1', status: { text: 'Paid', tone: 'positive' } }] },
    erpBranchPerformance: [{ name: 'Dubai', value: 92, amount: 'AED 980K' }],
    inventoryWarehouses: [{ name: 'Dubai', value: 92 }],
    posHourlySales: { labels: ['8a'], values: [1] },
    posTodayKpi: 'AED 132,760',
    posTopProducts: [{ name: 'Coffee', qty: 1 }],
    posReceipts: { rows: [{ receipt: 'R-1', till: 'T-1', payment: 'Card', amount: 'AED 428', status: { text: 'Done', tone: 'positive' } }] },
    hrDepartmentDonut: [{ label: 'Sales', value: 32, color: '#12B8A6' }],
    hrLeaveRequests: [{ name: 'Sara', type: 'Annual', status: 'Pending' }],
    hrPayrollSummary: [{ label: 'Processed', value: 'AED 428K', tone: 'positive' }],
    hrKpis: [{ label: 'Payroll', value: 'AED 428K' }],
  }),
}))

vi.mock('../../i18n/I18nProvider', () => ({
  useI18n: () => ({ lang: 'en' as const }),
}))

describe('HeroModuleDashboard', () => {
  it('renders ERP overview mockup', () => {
    render(<HeroModuleDashboard moduleType="erp" animate={false} />)
    expect(screen.getByText('ERP Overview')).toBeInTheDocument()
    expect(screen.getByText('Revenue & Profitability')).toBeInTheDocument()
  })

  it('renders Finance overview mockup', () => {
    render(<HeroModuleDashboard moduleType="finance" animate={false} />)
    expect(screen.getByText('Finance Overview')).toBeInTheDocument()
  })

  it('renders image mockup when mockupMode is image', () => {
    render(
      <HeroModuleDashboard
        moduleType="erp"
        mockupMode="image"
        mockupImage="/test-dashboard.png"
        mockupAltText={{ en: 'ERP dashboard screenshot', ar: '' }}
      />,
    )
    expect(screen.getByRole('img', { name: 'ERP dashboard screenshot' })).toHaveAttribute('src', '/test-dashboard.png')
  })

  it('hides mockup when mockupVisible is false', () => {
    const { container } = render(<HeroModuleDashboard moduleType="erp" mockupVisible={false} />)
    expect(container.firstChild).toBeNull()
  })
})

describe('hero mockup CMS fallbacks', () => {
  it('merges KPI overrides without dropping labels', () => {
    const merged = mergeMockupOverrides(
      {
        title: 'ERP Overview',
        subtitle: 'Complete visibility',
        kpis: [{ label: 'Total Revenue', value: 'AED 2.4M', hint: '+12.4%' }],
      },
      { kpis: [{ value: 'AED 2.5M', comparison: '+15%' }] },
    )
    expect(merged.kpis?.[0]?.value).toBe('AED 2.5M')
    expect(merged.kpis?.[0]?.hint).toBe('+15%')
    expect(merged.kpis?.[0]?.label).toBe('Total Revenue')
  })

  it('keeps defaults when CMS overrides are empty', () => {
    const merged = mergeMockupOverrides(
      { title: 'POS Overview', subtitle: 'Retail', kpis: [{ label: "Today's Sales", value: 'AED 132,760' }] },
      {},
    )
    expect(merged.title).toBe('POS Overview')
    expect(merged.kpis?.[0]?.value).toBe('AED 132,760')
  })

  it('merges v2 KPI overrides from CMS shape', () => {
    const base = getMockV2Defaults('erp', {
      erpRevenueKpi: 'AED 2.4M',
      erpGrossKpi: 'AED 612K',
      erpReceivablesKpi: 'AED 318K',
      inventoryKpis: [{ label: 'Inventory Value', value: 'AED 1.25M' }],
    } as never)
    const merged = mergeMockV2Overrides(base, { kpis: [{ value: 'AED 2.5M', comparison: '+15%' }] })
    expect(merged.kpis[0]?.value).toBe('AED 2.5M')
    expect(merged.kpis[0]?.trend).toBe('+15%')
    expect(merged.kpis[0]?.label).toBe('Revenue')
  })
})
