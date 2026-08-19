/** Centralized Lucide icon names for approved detail-page sections. */
export const detailIconMap = {
  purchase: 'ShoppingCart',
  sales: 'Store',
  inventory: 'Package',
  accounts: 'Landmark',
  tank: 'Fuel',
  payroll: 'Users',
  reporting: 'BarChart3',
  production: 'Factory',
  transactions: 'ReceiptText',
  solution: 'CircleCheck',
  problem: 'TriangleAlert',
  implementation: 'Settings',
  hr: 'Users',
  security: 'Shield',
  cloud: 'Cloud',
  integration: 'Plug',
  crm: 'Target',
  default: 'Sparkles',
} as const

export type DetailIconKey = keyof typeof detailIconMap

const LUCIDE_NAMES = new Set(Object.values(detailIconMap))

/** Resolve a consistent icon name from feature/tab labels and optional CMS icon hints. */
export function resolveDetailIconName(label: string, iconHint?: string): string {
  const text = `${label} ${iconHint ?? ''}`.toLowerCase()

  if (/^problem$|^challenge/.test(text.trim()) || /\bproblem\b/.test(text)) {
    return detailIconMap.problem
  }
  if (/^solution$/.test(text.trim()) || /\bsolution\b/.test(text)) {
    return detailIconMap.solution
  }
  if (/\btransaction/.test(text) || /\bvoucher/.test(text) || /\binvoice/.test(text)) {
    return detailIconMap.transactions
  }
  if (/\breport/.test(text) || /\bdashboard/.test(text) || /\banalytic/.test(text)) {
    return detailIconMap.reporting
  }
  if (/purchase|procurement|supplier|\bbuy\b/.test(text)) {
    return detailIconMap.purchase
  }
  if (/sales|billing|nozzle|retail|\bpos\b|checkout|shop sale/.test(text)) {
    return detailIconMap.sales
  }
  if (/inventory|stock|warehouse|transfer|lubricant|\bdip\b/.test(text)) {
    return detailIconMap.inventory
  }
  if (/account|ledger|bank|finance|journal|receivable|payable|\bp&l\b/.test(text)) {
    return detailIconMap.accounts
  }
  if (/fuel|petrol|tank|cng|wet stock|forecourt/.test(text)) {
    return detailIconMap.tank
  }
  if (/payroll|attendance|shift|\bhr\b|staff|leave/.test(text)) {
    return detailIconMap.payroll
  }
  if (/production|bom|manufactur|factory|work order|consumption/.test(text)) {
    return detailIconMap.production
  }
  if (/implement|training|support|install|consult/.test(text)) {
    return detailIconMap.implementation
  }
  if (/crm|lead|pipeline|customer relation/.test(text)) {
    return detailIconMap.crm
  }
  if (/integrat|sms|api|connect/.test(text)) {
    return detailIconMap.integration
  }
  if (/secure|cloud/.test(text)) {
    return detailIconMap.cloud
  }

  if (iconHint && LUCIDE_NAMES.has(iconHint as (typeof detailIconMap)[DetailIconKey])) {
    return iconHint
  }
  if (iconHint && /^[A-Z][a-zA-Z0-9]+$/.test(iconHint)) {
    return iconHint
  }

  return detailIconMap.default
}
