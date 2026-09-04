import type { HeroModuleType } from '../../../../../types/heroCarousel'
import type { DashboardRegionalPack } from '../../dashboardRegionalData'

export type MockV2Kpi = {
  label: string
  value: string
  trend: string
  tone?: 'positive' | 'neutral' | 'warning' | 'negative'
  sparkline?: number[]
}

export type MockV2ModuleData = {
  title: string
  subtitle: string
  kpis: MockV2Kpi[]
  aiInsight: { message: string; action: string }
  aiFloat?: { message: string; action: string }
}

export function getMockV2Defaults(module: HeroModuleType, regional: DashboardRegionalPack): MockV2ModuleData {
  switch (module) {
    case 'finance':
      return {
        title: 'Finance Overview',
        subtitle: 'Cash flow, receivables and profitability',
        kpis: [
          { label: 'Cash Position', value: regional.financeCashKpi, trend: '+4.1%', tone: 'positive', sparkline: [42, 48, 45, 52, 58, 62] },
          { label: 'Receivables', value: regional.erpReceivablesKpi, trend: '30 days', tone: 'warning', sparkline: [38, 40, 44, 42, 46, 48] },
          { label: 'Payables', value: `${regional.currency} 4.2M`, trend: 'Current cycle', tone: 'neutral', sparkline: [30, 32, 28, 34, 31, 33] },
          { label: 'Net Profit', value: regional.financeNetProfitKpi, trend: '+14.6%', tone: 'positive', sparkline: [22, 26, 24, 30, 34, 38] },
        ],
        aiInsight: { message: 'Receivables over 30 days require attention across two enterprise accounts.', action: 'Review aging' },
        aiFloat: { message: 'Cash runway remains healthy for the next two quarters.', action: 'View forecast' },
      }
    case 'inventory':
      return {
        title: 'Inventory Overview',
        subtitle: 'Stock health and warehouse visibility',
        kpis: [
          { label: 'Inventory Value', value: regional.inventoryKpis[1]?.value ?? `${regional.currency} 38M`, trend: '+5.4%', tone: 'positive', sparkline: [52, 54, 58, 56, 60, 64] },
          { label: 'Stock Availability', value: '94%', trend: 'In stock', tone: 'positive', sparkline: [88, 90, 91, 93, 94, 94] },
          { label: 'Low Stock', value: '24', trend: 'Reorder soon', tone: 'warning', sparkline: [18, 20, 22, 21, 23, 24] },
          { label: 'Warehouse Util.', value: '87%', trend: '4 sites', tone: 'neutral', sparkline: [80, 82, 84, 85, 86, 87] },
        ],
        aiInsight: { message: 'Eight products may reach reorder level this week based on current velocity.', action: 'View restock list' },
      }
    case 'pos':
      return {
        title: 'POS Overview',
        subtitle: 'Live retail performance across tills',
        kpis: [
          { label: "Today's Sales", value: regional.posTodayKpi, trend: '+12%', tone: 'positive', sparkline: [32, 38, 44, 52, 58, 64] },
          { label: 'Transactions', value: '486', trend: 'Live', tone: 'neutral', sparkline: [40, 42, 48, 50, 52, 54] },
          { label: 'Average Basket', value: regional.posBasketKpi, trend: '+6.2%', tone: 'positive', sparkline: [18, 20, 22, 24, 26, 28] },
          { label: 'Active Tills', value: '12', trend: 'Of 15 open', tone: 'neutral', sparkline: [10, 11, 11, 12, 12, 12] },
        ],
        aiInsight: { message: 'Evening sales are outperforming the weekly average by 18%.', action: 'See hourly trend' },
      }
    case 'hr':
      return {
        title: 'HR & Payroll Overview',
        subtitle: 'Workforce, attendance and payroll insights',
        kpis: [
          { label: 'Total Employees', value: '128', trend: 'All branches', tone: 'neutral', sparkline: [120, 122, 124, 126, 127, 128] },
          { label: 'Present Today', value: '116', trend: '90.6%', tone: 'positive', sparkline: [88, 90, 89, 91, 92, 90] },
          { label: 'Monthly Payroll', value: regional.hrKpis[3]?.value ?? `${regional.currency} 8.6M`, trend: 'This cycle', tone: 'neutral', sparkline: [72, 74, 76, 78, 80, 82] },
          { label: 'Open Leave', value: '7', trend: '3 pending', tone: 'warning', sparkline: [4, 5, 6, 5, 6, 7] },
        ],
        aiInsight: { message: 'Attendance is stable across all active branches this week.', action: 'Open workforce view' },
      }
    default:
      return {
        title: 'ERP Overview',
        subtitle: 'Executive visibility across your business',
        kpis: [
          { label: 'Revenue', value: regional.erpRevenueKpi, trend: '+12.4%', tone: 'positive', sparkline: [48, 52, 58, 62, 68, 72] },
          { label: 'Net Profit', value: regional.erpGrossKpi, trend: '+9.8%', tone: 'positive', sparkline: [28, 30, 32, 34, 36, 38] },
          { label: 'Open Orders', value: '512', trend: '+8.1%', tone: 'neutral', sparkline: [420, 440, 460, 480, 500, 512] },
          { label: 'Inventory Value', value: regional.inventoryKpis[1]?.value ?? `${regional.currency} 38M`, trend: '+7.2%', tone: 'positive', sparkline: [34, 36, 38, 40, 42, 44] },
        ],
        aiInsight: { message: 'Revenue is trending 12.4% above last quarter across core branches.', action: 'View executive report' },
        aiFloat: { message: 'Operations performance improved across key branch locations.', action: 'See breakdown' },
      }
  }
}
