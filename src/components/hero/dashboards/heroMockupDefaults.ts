import type { HeroModuleType } from '../../../types/heroCarousel'
import type { HeroMockupModuleData, HeroMockupSlideOverrides } from '../../../types/heroMockup'
import type { DashboardRegionalPack } from './dashboardRegionalData'

const MODULE_HEADERS: Record<HeroModuleType, { title: string; subtitle: string }> = {
  erp: { title: 'ERP Overview', subtitle: 'Complete visibility across your business' },
  finance: { title: 'Finance Overview', subtitle: 'Real-time financial performance' },
  inventory: { title: 'Inventory Overview', subtitle: 'Live stock and warehouse visibility' },
  pos: { title: 'POS Overview', subtitle: 'Fast connected retail sales system' },
  hr: { title: 'HR & Payroll Overview', subtitle: 'People, attendance and payroll insights' },
}

export function getDefaultMockupData(moduleType: HeroModuleType, regional: DashboardRegionalPack): HeroMockupModuleData {
  const header = MODULE_HEADERS[moduleType]

  switch (moduleType) {
    case 'finance':
      return {
        title: header.title,
        subtitle: header.subtitle,
        kpis: [
          { label: 'Cash Position', value: regional.financeCashKpi, hint: '+4.1%' },
          { label: 'Receivables', value: regional.erpReceivablesKpi, hint: 'Due 30d', tone: 'warning' },
          { label: 'Payables', value: `${regional.currency} 4.2M`, hint: 'Current cycle', tone: 'muted' },
          { label: 'Net Profit', value: regional.financeNetProfitKpi, hint: '+14.6%' },
        ],
      }
    case 'inventory':
      return {
        title: header.title,
        subtitle: header.subtitle,
        kpis: [
          { label: 'Inventory Value', value: regional.inventoryKpis[1]?.value ?? `${regional.currency} 38M`, hint: '+5.4%' },
          { label: 'Total Items', value: '12,480', hint: 'Across 4 warehouses', tone: 'muted' },
          { label: 'Low Stock', value: '24', hint: 'Needs attention', tone: 'warning' },
          { label: 'Out of Stock', value: '6', hint: 'Reorder now', tone: 'critical' },
        ],
      }
    case 'pos':
      return {
        title: header.title,
        subtitle: header.subtitle,
        kpis: [
          { label: "Today's Sales", value: regional.posTodayKpi, hint: '+12%' },
          { label: 'Transactions', value: '486', hint: 'Live tills', tone: 'muted' },
          { label: 'Average Basket', value: regional.posBasketKpi, hint: '+6.2%' },
          { label: 'Active Tills', value: '12', hint: 'Of 15 open', tone: 'muted' },
        ],
      }
    case 'hr':
      return {
        title: header.title,
        subtitle: header.subtitle,
        kpis: [
          { label: 'Total Employees', value: '128', hint: 'All branches', tone: 'muted' },
          { label: 'Present Today', value: '116', hint: '90.6%' },
          { label: 'On Leave', value: '7', hint: '3 pending', tone: 'warning' },
          { label: 'Monthly Payroll', value: regional.hrKpis[3]?.value ?? `${regional.currency} 8.6M`, hint: 'This cycle', tone: 'muted' },
        ],
      }
    default:
      return {
        title: header.title,
        subtitle: header.subtitle,
        kpis: [
          { label: 'Total Revenue', value: regional.erpRevenueKpi, hint: '+12.4%' },
          { label: 'Net Profit', value: regional.erpGrossKpi, hint: '+9.8%' },
          { label: 'Open Orders', value: '512', hint: '+8.1%', tone: 'muted' },
          { label: 'Inventory Value', value: regional.inventoryKpis[1]?.value ?? `${regional.currency} 38M`, hint: '+7.2%' },
        ],
      }
  }
}

export function mergeMockupOverrides(
  base: HeroMockupModuleData,
  overrides?: HeroMockupSlideOverrides | null,
  lang: 'en' | 'ar' = 'en',
): HeroMockupModuleData {
  if (!overrides) return base

  const pick = (b?: { en?: string; ar?: string }) => (b ? b[lang] || b.en || '' : undefined)

  return {
    ...base,
    title: pick(overrides.title) || base.title,
    subtitle: pick(overrides.subtitle) || base.subtitle,
    kpis: overrides.kpis?.length
      ? overrides.kpis.map((k, i) => ({
          label: pick(k.label) || base.kpis?.[i]?.label || '',
          value: k.value || base.kpis?.[i]?.value || '',
          hint: k.comparison || pick(k.hint) || base.kpis?.[i]?.hint,
          tone: k.tone ?? base.kpis?.[i]?.tone,
        }))
      : base.kpis,
    visible: overrides.visible ?? base.visible,
  }
}
