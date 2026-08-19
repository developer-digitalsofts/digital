import type { DetailMockupVariant } from '../../types/detailPageSections'
import { industryCategoryForSlug } from './industryHeroImages'

const WORKFLOW_OVERRIDES: Record<string, { label: string }[]> = {
  'petrol-gas-filling-station-software': [
    { label: 'Blueprint & Setup' },
    { label: 'Purchase & Receive' },
    { label: 'Tank & CNG Stock' },
    { label: 'Nozzle Sales' },
    { label: 'Shift Close' },
    { label: 'Accounts & Reports' },
  ],
  'petrol-pump-software': [
    { label: 'Blueprint & Setup' },
    { label: 'Purchase & Receive' },
    { label: 'Tank Stock' },
    { label: 'Nozzle Sales' },
    { label: 'Shift Close' },
    { label: 'Accounts & Reports' },
  ],
  'garments-manufacturing-software': [
    { label: 'Planning' },
    { label: 'Material Purchase' },
    { label: 'Production' },
    { label: 'Quality Check' },
    { label: 'Finished Goods' },
    { label: 'Reporting' },
  ],
  'cloud-erp-software-for-textile-industries': [
    { label: 'Raw Material' },
    { label: 'Dyeing / Processing' },
    { label: 'Production' },
    { label: 'Quality' },
    { label: 'Packing' },
    { label: 'Dispatch' },
  ],
  'retail-management-software': [
    { label: 'Purchase' },
    { label: 'Receive' },
    { label: 'Stock' },
    { label: 'POS Sale' },
    { label: 'Reconciliation' },
    { label: 'Reporting' },
  ],
  'logistics-and-transportation-management-software': [
    { label: 'Booking' },
    { label: 'Vehicle Assignment' },
    { label: 'Dispatch' },
    { label: 'Tracking' },
    { label: 'Delivery' },
    { label: 'Billing' },
  ],
}

export function industryWorkflowOverride(slug: string): { label: string }[] | undefined {
  return WORKFLOW_OVERRIDES[slug]
}

export function industryWorkflowHeading(slug: string, productLabel: string): string {
  if (/petrol|fuel|cng|gas-filling|depot|lpg|bowser|tank-lorry|fleet-fuel|oil-and-gas/.test(slug)) {
    return 'Filling Station Operations by Area'
  }
  if (/manufactur|garment|textile|knitting|dyeing|candy|plastic-pipes/.test(slug)) {
    return `${productLabel} Operations Workflow`
  }
  if (/retail|grocery|store|shop|pos/.test(slug)) {
    return 'Retail Operations Workflow'
  }
  if (/logistic|transport|fleet/.test(slug)) {
    return 'Logistics Operations Workflow'
  }
  return `Connected ${productLabel} Workflow`
}

export function industryAnalyticsHeading(slug: string, productLabel: string): string {
  if (/petrol|fuel|cng|gas-filling|pump|depot/.test(slug)) return 'See Every Station Clearly'
  if (/manufactur|garment|textile/.test(slug)) return 'See Every Production Stage Clearly'
  if (/retail|store|shop/.test(slug)) return 'See Every Sale Clearly'
  if (/logistic|transport/.test(slug)) return 'See Every Trip Clearly'
  if (/hotel|restaurant|hospitality/.test(slug)) return 'See Every Booking Clearly'
  if (/pharmacy|medical|homeopathic/.test(slug)) return 'See Every Dispensing Clearly'
  return `See ${productLabel} Operations Clearly`
}

export function mockupVariantForIndustrySlug(slug: string): DetailMockupVariant {
  const map: Record<string, DetailMockupVariant> = {
    'petrol-pump-software': 'petrol',
    'petrol-gas-filling-station-software': 'petrol',
    'petrol-depot-management-software': 'petrol',
    'fuel-tank-lorry-management-software': 'petrol',
    'fleet-fuel-management-software': 'petrol',
    'oil-and-gas-business-management-software': 'petrol',
    'lpg-business-software': 'petrol',
    'lpg-bowser-supply-chain-software': 'petrol',
    'garments-manufacturing-software': 'textile',
    'cloud-erp-software-for-textile-industries': 'textile',
    'knitting-dyeing-industry-software': 'textile',
    'fabric-store-management-software': 'textile',
    'poultry-control-shed-management-software': 'poultry',
    'poultry-arhat-software': 'poultry',
    'cloud-erp-software-for-agriculture-business': 'agriculture',
    'dairy-farm-management-software': 'agriculture',
    'logistics-transportation-software': 'inventory',
    'motor-market-management-software': 'inventory',
    'retail-management-software': 'pos',
    'grocery-store-management-software': 'pos',
    'candy-and-confectionery-manufacturing-software': 'production',
    'plastic-pipes-fitting-industry-software': 'production',
    'marble-and-granite-factory-software': 'production',
    'hotel-management-software': 'generic-industry',
    'pharmacy-business-management-software': 'generic-industry',
    'erp-software-for-construction-business': 'generic-industry',
    'erp-software-for-real-estate-business': 'generic-industry',
  }
  if (map[slug]) return map[slug]

  const byCategory: Record<string, DetailMockupVariant> = {
    'oil-gas': 'petrol',
    textile: 'textile',
    manufacturing: 'production',
    retail: 'pos',
    logistics: 'inventory',
    poultry: 'poultry',
    agriculture: 'agriculture',
    medical: 'generic-industry',
    hospitality: 'generic-industry',
    construction: 'generic-industry',
    'real-estate': 'generic-industry',
    electronics: 'pos',
    smb: 'generic-industry',
    visa: 'generic-industry',
  }
  return byCategory[industryCategoryForSlug(slug)] ?? 'generic-industry'
}

export const DEFAULT_INDUSTRY_ROLES = [
  { title: 'Owner', description: 'Executive visibility into sales, stock, cash and profitability across branches.', icon: 'Briefcase' },
  { title: 'Operations Manager', description: 'Day-to-day control of workflows, approvals, and operational exceptions.', icon: 'Settings' },
  { title: 'Accountant', description: 'Reliable vouchers, reconciliations, and reports tied to source transactions.', icon: 'Landmark' },
  { title: 'Operational Staff', description: 'Fast, validated daily transactions with audit-ready history.', icon: 'UserCheck' },
]
