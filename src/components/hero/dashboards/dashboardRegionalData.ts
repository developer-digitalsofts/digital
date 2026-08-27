/**
 * Per-country illustrative dashboard demo data for hero mockups.
 * Values are fictional UI examples — not converted exchange rates.
 */
import { normalizeCountryCode, type GccCountryCode } from '../../../config/gccCountries'
import type { BranchRow, DonutSegment, KpiItem, TableColumn, TableRow } from './types'

type RegionalConfig = {
  currency: string
  cities: [string, string, string, string]
  companies: [string, string, string, string]
  amounts: {
    erpRevenue: string
    erpGross: string
    erpReceivables: string
    branchAmounts: [string, string, string, string]
    docAmounts: [string, string, string, string]
    financeRevenue: string
    financeNetProfit: string
    financeCash: string
    txnAmounts: [string, string, string, string]
    inventorySales: string
    inventoryValue: string
    posToday: string
    posBasket: string
    posReceiptAmounts: [string, string, string, string]
    hrPayroll: string
    moduleCashFlow: string
    modulePosSales: string
    modulePayroll: string
  }
}

const REGIONAL: Record<GccCountryCode, RegionalConfig> = {
  AE: {
    currency: 'AED',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
    companies: ['Al Noor Trading', 'Gulf Retail LLC', 'Dubai Holdings', 'Emirates Supplies'],
    amounts: {
      erpRevenue: '2.4M',
      erpGross: '612K',
      erpReceivables: '318K',
      branchAmounts: ['980K', '640K', '420K', '360K'],
      docAmounts: ['42,900', '18,200', '9,450', '6,780'],
      financeRevenue: '1.2M',
      financeNetProfit: '560K',
      financeCash: '842K',
      txnAmounts: ['12,400', '28,900', '64,200', '9,850'],
      inventorySales: '245,300',
      inventoryValue: '1.25M',
      posToday: '132,760',
      posBasket: '273',
      posReceiptAmounts: ['428', '156', '892', '312'],
      hrPayroll: '428K',
      moduleCashFlow: '46.32M',
      modulePosSales: '1.24M',
      modulePayroll: '6.45M',
    },
  },
  SA: {
    currency: 'SAR',
    cities: ['Riyadh', 'Jeddah', 'Dammam', 'Khobar'],
    companies: ['Riyadh Trading Co.', 'Jeddah Retail Group', 'Eastern Supplies', 'Najd Holdings'],
    amounts: {
      erpRevenue: '2.4M',
      erpGross: '612K',
      erpReceivables: '318K',
      branchAmounts: ['980K', '640K', '420K', '360K'],
      docAmounts: ['42,900', '18,200', '9,450', '6,780'],
      financeRevenue: '1.2M',
      financeNetProfit: '560K',
      financeCash: '842K',
      txnAmounts: ['12,400', '28,900', '64,200', '9,850'],
      inventorySales: '245,300',
      inventoryValue: '1.25M',
      posToday: '132,760',
      posBasket: '273',
      posReceiptAmounts: ['428', '156', '892', '312'],
      hrPayroll: '428K',
      moduleCashFlow: '46.32M',
      modulePosSales: '1.24M',
      modulePayroll: '6.45M',
    },
  },
  QA: {
    currency: 'QAR',
    cities: ['Doha', 'Al Rayyan', 'Al Wakrah', 'Lusail'],
    companies: ['Doha Trading LLC', 'West Bay Retail', 'Qatar Gulf Supplies', 'Al Rayyan Logistics'],
    amounts: {
      erpRevenue: '2.2M',
      erpGross: '580K',
      erpReceivables: '295K',
      branchAmounts: ['920K', '610K', '400K', '340K'],
      docAmounts: ['41,200', '17,400', '9,100', '6,500'],
      financeRevenue: '1.1M',
      financeNetProfit: '520K',
      financeCash: '810K',
      txnAmounts: ['11,800', '27,400', '61,500', '9,400'],
      inventorySales: '228,400',
      inventoryValue: '1.18M',
      posToday: '124,500',
      posBasket: '256',
      posReceiptAmounts: ['410', '148', '860', '298'],
      hrPayroll: '410K',
      moduleCashFlow: '42.8M',
      modulePosSales: '1.12M',
      modulePayroll: '6.1M',
    },
  },
  OM: {
    currency: 'OMR',
    cities: ['Muscat', 'Sohar', 'Salalah', 'Nizwa'],
    companies: ['Muscat Trading Co.', 'Sohar Industrial', 'Salalah Retail', 'Gulf Coast Supplies'],
    amounts: {
      erpRevenue: '98K',
      erpGross: '24K',
      erpReceivables: '12K',
      branchAmounts: ['38K', '26K', '18K', '14K'],
      docAmounts: ['1,820', '780', '420', '310'],
      financeRevenue: '52K',
      financeNetProfit: '22K',
      financeCash: '34K',
      txnAmounts: ['520', '1,180', '2,640', '410'],
      inventorySales: '9,850',
      inventoryValue: '48K',
      posToday: '5,420',
      posBasket: '11',
      posReceiptAmounts: ['18', '6', '34', '12'],
      hrPayroll: '17K',
      moduleCashFlow: '185K',
      modulePosSales: '5.2K',
      modulePayroll: '26K',
    },
  },
  KW: {
    currency: 'KWD',
    cities: ['Kuwait City', 'Hawalli', 'Farwaniya', 'Ahmadi'],
    companies: ['Kuwait Trading House', 'Hawalli Retail', 'Farwaniya Supplies', 'Gulf Plaza Co.'],
    amounts: {
      erpRevenue: '85K',
      erpGross: '22K',
      erpReceivables: '11K',
      branchAmounts: ['34K', '24K', '16K', '12K'],
      docAmounts: ['1,580', '680', '360', '270'],
      financeRevenue: '44K',
      financeNetProfit: '19K',
      financeCash: '29K',
      txnAmounts: ['460', '1,040', '2,320', '360'],
      inventorySales: '8,640',
      inventoryValue: '42K',
      posToday: '4,780',
      posBasket: '9',
      posReceiptAmounts: ['16', '5', '30', '11'],
      hrPayroll: '15K',
      moduleCashFlow: '158K',
      modulePosSales: '4.8K',
      modulePayroll: '22K',
    },
  },
  BH: {
    currency: 'BHD',
    cities: ['Manama', 'Riffa', 'Muharraq', 'Isa Town'],
    companies: ['Al Manama Trading', 'Riffa Retail Co.', 'Gulf Harbour Supplies', 'Muharraq Logistics'],
    amounts: {
      erpRevenue: '245K',
      erpGross: '62K',
      erpReceivables: '32K',
      branchAmounts: ['98K', '64K', '42K', '36K'],
      docAmounts: ['4,290', '1,820', '945', '678'],
      financeRevenue: '122K',
      financeNetProfit: '56K',
      financeCash: '84K',
      txnAmounts: ['1,240', '2,890', '6,420', '985'],
      inventorySales: '24,530',
      inventoryValue: '125K',
      posToday: '13,276',
      posBasket: '27',
      posReceiptAmounts: ['42', '15', '89', '31'],
      hrPayroll: '42K',
      moduleCashFlow: '463K',
      modulePosSales: '12.4K',
      modulePayroll: '64.5K',
    },
  },
}

function money(currency: string, amount: string) {
  return `${currency} ${amount}`
}

function buildPack(code: GccCountryCode) {
  const cfg = REGIONAL[code]
  return buildPackWithParts(cfg.currency, cfg.cities, cfg.companies, cfg.amounts)
}

function buildPackWithParts(
  currency: string,
  cities: [string, string, string, string],
  companies: [string, string, string, string],
  a: RegionalConfig['amounts'],
) {
  const erpBranchPerformance = cities.map((name, i) => ({
    name,
    value: [92, 78, 65, 58][i],
    amount: money(currency, a.branchAmounts[i]),
  }))

  const erpDocuments: { columns: TableColumn[]; rows: TableRow[] } = {
    columns: [
      { key: 'doc', label: 'Document' },
      { key: 'branch', label: 'Branch' },
      { key: 'amount', label: 'Amount', align: 'right' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { doc: 'SO-20481', branch: cities[0], amount: money(currency, a.docAmounts[0]), status: { text: 'Posted', tone: 'info' } },
      { doc: 'GRN-8832', branch: cities[1], amount: money(currency, a.docAmounts[1]), status: { text: 'Approved', tone: 'positive' } },
      { doc: 'INV-9910', branch: cities[2], amount: money(currency, a.docAmounts[2]), status: { text: 'Sent', tone: 'neutral' } },
      { doc: 'PO-4421', branch: cities[3], amount: money(currency, a.docAmounts[3]), status: { text: 'Cleared', tone: 'purple' } },
    ],
  }

  const financeTransactions: { columns: TableColumn[]; rows: TableRow[] } = {
    columns: [
      { key: 'ref', label: 'Reference' },
      { key: 'account', label: 'Account' },
      { key: 'amount', label: 'Amount', align: 'right' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { ref: 'PAY-8841', account: companies[0], amount: money(currency, a.txnAmounts[0]), status: { text: 'Paid', tone: 'positive' } },
      { ref: 'RCT-9912', account: companies[1], amount: money(currency, a.txnAmounts[1]), status: { text: 'Paid', tone: 'positive' } },
      { ref: 'INV-7720', account: companies[2], amount: money(currency, a.txnAmounts[2]), status: { text: 'Pending', tone: 'warning' } },
      { ref: 'PAY-8813', account: companies[3], amount: money(currency, a.txnAmounts[3]), status: { text: 'Overdue', tone: 'critical' } },
    ],
  }

  const inventoryBranchStock: BranchRow[] = cities.map((branch, i) => ({
    branch,
    inStock: ['1,240', '980', '760', '540'][i],
    low: ['18', '12', '9', '6'][i],
    out: ['3', '2', '1', '0'][i],
  }))

  const inventoryWarehouses = cities.map((name, i) => ({ name, value: [92, 88, 85, 90][i] }))

  const posReceipts: { columns: TableColumn[]; rows: TableRow[] } = {
    columns: [
      { key: 'receipt', label: 'Receipt' },
      { key: 'till', label: 'Till' },
      { key: 'payment', label: 'Payment' },
      { key: 'amount', label: 'Amount', align: 'right' },
      { key: 'status', label: 'Status' },
    ],
    rows: [
      { receipt: 'RCP-4481', till: 'T-03', payment: 'Card', amount: money(currency, a.posReceiptAmounts[0]), status: { text: 'Completed', tone: 'positive' } },
      { receipt: 'RCP-4482', till: 'T-07', payment: 'Cash', amount: money(currency, a.posReceiptAmounts[1]), status: { text: 'Completed', tone: 'positive' } },
      { receipt: 'RCP-4483', till: 'T-01', payment: 'Wallet', amount: money(currency, a.posReceiptAmounts[2]), status: { text: 'Completed', tone: 'info' } },
      { receipt: 'RCP-4484', till: 'T-05', payment: 'Card', amount: money(currency, a.posReceiptAmounts[3]), status: { text: 'Refunded', tone: 'warning' } },
    ],
  }

  const erpKpis: KpiItem[] = [
    { label: 'Revenue', value: money(currency, a.erpRevenue), hint: '+8.2%', tone: 'positive' },
    { label: 'Gross Profit', value: money(currency, a.erpGross), hint: '+11.3%', tone: 'positive' },
    { label: 'Receivables', value: money(currency, a.erpReceivables), hint: 'Due 30d', tone: 'warning' },
    { label: 'Active Branches', value: '12', hint: 'All Active', tone: 'info' },
  ]

  const financeKpis: KpiItem[] = [
    { label: 'Cash in Hand', value: money(currency, a.financeCash), hint: '+4.1%', tone: 'positive' },
    { label: 'Net Cash Flow', value: money(currency, a.financeNetProfit), hint: 'This month', tone: 'info' },
    { label: 'Receivables', value: money(currency, a.erpReceivables), hint: 'Due 30d', tone: 'warning' },
    { label: 'Net Profit Margin', value: '18.4%', hint: 'Stable', tone: 'positive' },
  ]

  const inventoryKpis: KpiItem[] = [
    { label: 'Stock Accuracy', value: '97%', hint: 'On target', tone: 'positive' },
    { label: 'Inventory Value', value: money(currency, a.inventoryValue), hint: '+5.4%', tone: 'info' },
    { label: 'Low Stock Items', value: '24', hint: 'Alert', tone: 'warning' },
    { label: 'Fast-Moving Items', value: '32', hint: 'This week', tone: 'purple' },
  ]

  const posKpis: KpiItem[] = [
    { label: "Today's Sales", value: money(currency, a.posToday), hint: '+12%', tone: 'positive' },
    { label: 'Transactions', value: '486', hint: 'Live', tone: 'info' },
    { label: 'Average Basket', value: money(currency, a.posBasket), hint: '+6.2%', tone: 'positive' },
    { label: 'Active Tills', value: '12/15', hint: 'Open', tone: 'info' },
  ]

  const hrKpis: KpiItem[] = [
    { label: 'Active Employees', value: '128', hint: 'All branches', tone: 'info' },
    { label: 'Present Today', value: '116', hint: '90.6%', tone: 'positive' },
    { label: 'On Leave', value: '7', hint: 'Pending', tone: 'warning' },
    { label: 'Monthly Payroll', value: money(currency, a.hrPayroll), hint: 'This cycle', tone: 'purple' },
  ]

  const hrPayrollSummary = [
    { label: 'Processed', value: money(currency, a.hrPayroll), tone: 'positive' as const },
    { label: 'Pending', value: money(currency, '24K'), tone: 'warning' as const },
    { label: 'Next Run', value: '28 May', tone: 'info' as const },
  ]

  return {
    currency,
    cities,
    companies,
    erpKpis,
    erpBranchPerformance,
    erpDocuments,
    financeKpis,
    financeTransactions,
    financeGroupedBars: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      revenue: [58, 62, 55, 70, 66, 74],
      expenses: [42, 45, 40, 48, 44, 50],
    },
    financeRevenueKpi: money(currency, a.financeRevenue),
    financeNetProfitKpi: money(currency, a.financeNetProfit),
    financeCashKpi: money(currency, a.financeCash),
    erpRevenueKpi: money(currency, a.erpRevenue),
    erpGrossKpi: money(currency, a.erpGross),
    erpReceivablesKpi: money(currency, a.erpReceivables),
    inventoryKpis,
    inventoryBranchStock,
    inventoryWarehouses,
    inventorySalesWeek: money(currency, a.inventorySales),
    posKpis,
    posReceipts,
    posTodayKpi: money(currency, a.posToday),
    posBasketKpi: money(currency, a.posBasket),
    hrKpis,
    hrPayrollSummary,
    erpRevenueTarget: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      actual: [68, 72, 65, 78, 74, 82],
      target: [64, 70, 68, 72, 76, 80],
    },
    financeAgingDonut: [
      { label: '0–30 days', value: 42, color: '#14b8a6' },
      { label: '31–60 days', value: 28, color: '#FF714A' },
      { label: '61–90 days', value: 17, color: '#6366f1' },
      { label: '90+ days', value: 13, color: '#ef4444' },
    ] as DonutSegment[],
    inventorySalesTrend: [22, 28, 26, 34, 32, 38, 36, 40],
    posHourlySales: {
      labels: ['8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'],
      values: [18, 32, 48, 56, 62, 78, 84, 52],
    },
    hrDepartmentDonut: [
      { label: 'Sales', value: 32, color: '#f47c4d' },
      { label: 'Finance', value: 18, color: '#6366f1' },
      { label: 'Operations', value: 34, color: '#141d38' },
      { label: 'Support', value: 16, color: '#14b8a6' },
    ] as DonutSegment[],
    hrLeaveRequests: [
      { name: 'Sara Ali', type: 'Annual', status: 'Pending' },
      { name: 'Omar Khan', type: 'Sick', status: 'Approved' },
      { name: 'Layla Mansour', type: 'Annual', status: 'Pending' },
      { name: 'Fatima Hassan', type: 'Remote', status: 'Approved' },
      { name: 'Ahmed Saleh', type: 'Annual', status: 'Pending' },
    ],
    modulePreviewCashFlow: money(currency, a.moduleCashFlow),
    modulePreviewPosSales: money(currency, a.modulePosSales),
    modulePreviewPayroll: money(currency, a.modulePayroll),
    inventoryPosProducts: [
      { name: 'Wireless Headphones', qty: '142', icon: 'headphones' },
      { name: 'Smart Watch', qty: '118', icon: 'watch' },
      { name: 'Bluetooth Speaker', qty: '96', icon: 'bag' },
      { name: 'Power Bank', qty: '84', icon: 'phone' },
      { name: 'USB-C Cable', qty: '72', icon: 'bag' },
    ],
    posTopProducts: [
      { name: 'Premium Coffee', qty: 86 },
      { name: 'Organic Dates', qty: 64 },
      { name: 'Mineral Water', qty: 52 },
      { name: 'Fresh Juice', qty: 41 },
      { name: 'Energy Bar', qty: 36 },
    ],
  }
}

export type DashboardRegionalPack = ReturnType<typeof buildPack>

const cache = new Map<GccCountryCode, DashboardRegionalPack>()

export function getDashboardRegionalData(countryCode: string): DashboardRegionalPack {
  const code = normalizeCountryCode(countryCode)
  if (!cache.has(code)) cache.set(code, buildPack(code))
  return cache.get(code)!
}

/** Prefer CMS locale `regional` dashboard values over static country defaults. */
export function getDashboardRegionalDataFromLocale(
  countryCode: string,
  regional: {
    currency?: string
    cities?: string[]
    companies?: string[]
    dashboard?: {
      erpRevenue?: string
      erpGross?: string
      erpReceivables?: string
      branchAmounts?: string[]
      financeCash?: string
      posToday?: string
      posBasket?: string
      inventoryValue?: string
      hrPayroll?: string
      moduleCashFlow?: string
      modulePosSales?: string
      modulePayroll?: string
      docAmounts?: string[]
      financeRevenue?: string
      financeNetProfit?: string
      txnAmounts?: string[]
      inventorySales?: string
      posReceiptAmounts?: string[]
    }
  },
): DashboardRegionalPack {
  const code = normalizeCountryCode(countryCode)
  const base = REGIONAL[code] ?? REGIONAL.AE
  const currency = regional.currency || base.currency
  const cities = [
    regional.cities?.[0] ?? base.cities[0],
    regional.cities?.[1] ?? base.cities[1],
    regional.cities?.[2] ?? base.cities[2],
    regional.cities?.[3] ?? base.cities[3] ?? base.cities[0],
  ] as [string, string, string, string]
  const companies = [
    regional.companies?.[0] ?? base.companies[0],
    regional.companies?.[1] ?? base.companies[1],
    regional.companies?.[2] ?? base.companies[2],
    regional.companies?.[3] ?? base.companies[3] ?? base.companies[0],
  ] as [string, string, string, string]
  const dash = regional.dashboard || {}
  const { branchAmounts: cmsBranches, ...dashRest } = dash
  let amounts = { ...base.amounts, ...dashRest }
  if (Array.isArray(cmsBranches) && cmsBranches.length >= 3) {
    amounts = {
      ...amounts,
      branchAmounts: [
        cmsBranches[0] ?? amounts.branchAmounts[0],
        cmsBranches[1] ?? amounts.branchAmounts[1],
        cmsBranches[2] ?? amounts.branchAmounts[2],
        cmsBranches[3] ?? amounts.branchAmounts[2],
      ] as [string, string, string, string],
    }
  }
  return buildPackWithParts(currency, cities, companies, amounts as RegionalConfig['amounts'])
}
