import type { GccCountryCode } from '../../config/gccCountries'
import { normalizeCountryCode } from '../../config/gccCountries'
import { getCountryProfile } from '../../locale/countryProfiles'

export type IndustryVisualVariant = 'hero' | 'reports' | 'dashboard' | 'workflow' | 'documents'

/** Illustrative demo amounts per country — not exchange-converted prices. */
const DEMO_AMOUNTS: Record<string, Record<string, string>> = {
  'AED 1.8M': { PK: 'PKR 36M' },
  'AED 240K': { PK: 'PKR 4.8M' },
  'AED 6.1M': { PK: 'PKR 122M' },
  'AED 2.4M': { PK: 'PKR 48M' },
  'AED 3.2M': { PK: 'PKR 64M' },
  'AED 1.1M': { PK: 'PKR 22M' },
  'AED 890K': { PK: 'PKR 17.8M' },
  'AED 4.8M': { PK: 'PKR 96M' },
  'AED 2.1M': { PK: 'PKR 42M' },
  'AED 1.4M': { PK: 'PKR 28M' },
  'AED 620K': { PK: 'PKR 12.4M' },
  'AED 1.2M': { PK: 'PKR 24M' },
  'AED 42K': { PK: 'PKR 840K' },
  'AED 3.4M': { PK: 'PKR 68M' },
  'AED 2.8M': { PK: 'PKR 56M' },
  'AED 640K': { PK: 'PKR 12.8M' },
  'AED 840K': { PK: 'PKR 16.8M' },
  'AED 120K': { PK: 'PKR 2.4M' },
  'AED 1.6M': { PK: 'PKR 32M' },
}

function regionalizeThemeString(text: string, countryCode: GccCountryCode): string {
  // PK is the default market — still rewrite AED demo amounts to PKR.
  let out = text
  for (const [aed, map] of Object.entries(DEMO_AMOUNTS)) {
    if (out.includes(aed)) out = out.split(aed).join(map[countryCode] ?? map.PK ?? aed)
  }
  const profile = getCountryProfile(countryCode)
  return out.split('AED').join(profile.currency)
}

function regionalizeTheme(theme: IndustryErpTheme, countryCode: GccCountryCode): IndustryErpTheme {
  const clone = structuredClone(theme)
  const walk = (node: unknown): unknown => {
    if (typeof node === 'string') return regionalizeThemeString(node, countryCode)
    if (Array.isArray(node)) return node.map(walk)
    if (node && typeof node === 'object') {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(node)) out[k] = walk(v)
      return out
    }
    return node
  }
  return walk(clone) as IndustryErpTheme
}

export type IndustryErpTheme = {
  categoryId: string
  moduleLabel: string
  primaryIcon: string
  heroKpis: { label: string; value: string; chip: string }[]
  chartTitle: string
  chartBars: number[]
  workflowTitle: string
  workflowSteps: string[]
  reportTitle: string
  reportRows: { name: string; value: string; status: string }[]
  documentTitle: string
  documentRows: { id: string; detail: string; status: string }[]
}

const THEMES: Record<string, IndustryErpTheme> = {
  textile: {
    categoryId: 'textile',
    moduleLabel: 'Textile ERP',
    primaryIcon: 'Shirt',
    heroKpis: [
      { label: 'Fabric rolls', value: '2,840 m', chip: 'In stock' },
      { label: 'Dye batches', value: '18', chip: 'Active' },
      { label: 'Production', value: '94%', chip: 'On plan' },
    ],
    chartTitle: 'Weaving & dyeing output',
    chartBars: [42, 58, 65, 72, 68, 80, 76, 88, 82, 90, 85, 92],
    workflowTitle: 'Production planning workflow',
    workflowSteps: ['Fabric GRN', 'Dyeing batch', 'Quality check', 'Cut & pack', 'Dispatch'],
    reportTitle: 'Textile operations reports',
    reportRows: [
      { name: 'Fabric stock by shade', value: 'Live', status: 'Ready' },
      { name: 'Dyeing WIP', value: '12 batches', status: 'Active' },
      { name: 'Loom efficiency', value: '91%', status: 'Posted' },
    ],
    documentTitle: 'Production vouchers',
    documentRows: [
      { id: 'GRN-4421', detail: 'Cotton roll inward', status: 'Posted' },
      { id: 'DYE-118', detail: 'Reactive dye batch', status: 'Approved' },
      { id: 'ISS-902', detail: 'Cutting floor issue', status: 'Sent' },
    ],
  },
  'oil-gas': {
    categoryId: 'oil-gas',
    moduleLabel: 'Fuel Station ERP',
    primaryIcon: 'Fuel',
    heroKpis: [
      { label: 'Nozzle sales', value: 'AED 1.8M', chip: 'Today' },
      { label: 'Tank stock', value: '42,500 L', chip: 'Diesel' },
      { label: 'Dip variance', value: '0.3%', chip: 'OK' },
    ],
    chartTitle: 'Forecourt sales vs target',
    chartBars: [55, 62, 70, 68, 75, 82, 78, 85, 80, 88, 92, 86],
    workflowTitle: 'Forecourt operations',
    workflowSteps: ['Tank dip reading', 'Nozzle sale', 'Shift closing', 'Wet-stock reconcile', 'Accounts post'],
    reportTitle: 'Station analytics',
    reportRows: [
      { name: 'Nozzle sale summary', value: 'Shift A', status: 'Live' },
      { name: 'Tank gain / loss', value: '0.3%', status: 'OK' },
      { name: 'Credit customer dues', value: 'AED 240K', status: 'Open' },
    ],
    documentTitle: 'Fuel & lubricant vouchers',
    documentRows: [
      { id: 'NS-8842', detail: 'Nozzle sale — Petrol', status: 'Posted' },
      { id: 'DIP-221', detail: 'Tank dip — Diesel', status: 'Approved' },
      { id: 'LUB-044', detail: 'Lubricant outward', status: 'Sent' },
    ],
  },
  poultry: {
    categoryId: 'poultry',
    moduleLabel: 'Poultry ERP',
    primaryIcon: 'Bird',
    heroKpis: [
      { label: 'Flock count', value: '24,500', chip: 'Live' },
      { label: 'Feed consumed', value: '8.2 t', chip: 'Week' },
      { label: 'Mortality', value: '1.1%', chip: 'Low' },
    ],
    chartTitle: 'Flock weight & feed analytics',
    chartBars: [48, 52, 58, 62, 66, 70, 74, 78, 76, 80, 84, 88],
    workflowTitle: 'Shed & supply workflow',
    workflowSteps: ['Bird purchase', 'Shed placement', 'Feed issue', 'Weight check', 'Sale dispatch'],
    reportTitle: 'Poultry analytics',
    reportRows: [
      { name: 'Shed mortality', value: '1.1%', status: 'OK' },
      { name: 'Feed per bird', value: '3.2 kg', status: 'Live' },
      { name: 'Egg production', value: '92%', status: 'Posted' },
    ],
    documentTitle: 'Poultry vouchers',
    documentRows: [
      { id: 'BRD-331', detail: 'Bird loading slip', status: 'Posted' },
      { id: 'FED-882', detail: 'Feed issue — Shed 4', status: 'Approved' },
      { id: 'SAL-119', detail: 'Broiler sale invoice', status: 'Sent' },
    ],
  },
  medical: {
    categoryId: 'medical',
    moduleLabel: 'Pharmacy ERP',
    primaryIcon: 'HeartPulse',
    heroKpis: [
      { label: 'Prescriptions', value: '186', chip: 'Today' },
      { label: 'Stock alerts', value: '7', chip: 'Low qty' },
      { label: 'Expiry watch', value: '12 SKUs', chip: '30 days' },
    ],
    chartTitle: 'Sales & inventory health',
    chartBars: [40, 48, 52, 58, 55, 62, 68, 72, 70, 75, 78, 82],
    workflowTitle: 'Pharmacy workflow',
    workflowSteps: ['Purchase GRN', 'Batch & expiry', 'Counter sale', 'Insurance claim', 'Accounts'],
    reportTitle: 'Healthcare retail reports',
    reportRows: [
      { name: 'Fast-moving medicines', value: 'Top 20', status: 'Live' },
      { name: 'Near-expiry stock', value: '12 items', status: 'Alert' },
      { name: 'Margin by category', value: '18.4%', status: 'Posted' },
    ],
    documentTitle: 'Pharmacy documents',
    documentRows: [
      { id: 'RX-2041', detail: 'Counter sale', status: 'Posted' },
      { id: 'GRN-771', detail: 'Supplier inward', status: 'Approved' },
      { id: 'RET-088', detail: 'Sale return', status: 'Sent' },
    ],
  },
  'real-estate': {
    categoryId: 'real-estate',
    moduleLabel: 'Property ERP',
    primaryIcon: 'Building2',
    heroKpis: [
      { label: 'Active listings', value: '84', chip: 'Live' },
      { label: 'Site visits', value: '23', chip: 'This week' },
      { label: 'Collections', value: 'AED 6.1M', chip: 'MTD' },
    ],
    chartTitle: 'Leads & collections pipeline',
    chartBars: [35, 42, 48, 52, 58, 55, 62, 68, 72, 78, 82, 88],
    workflowTitle: 'Property CRM workflow',
    workflowSteps: ['Lead capture', 'Site visit', 'Booking token', 'Installment plan', 'Handover'],
    reportTitle: 'Real estate dashboards',
    reportRows: [
      { name: 'Unit availability', value: '84 units', status: 'Live' },
      { name: 'Agent pipeline', value: '41 leads', status: 'Active' },
      { name: 'Receivable aging', value: 'AED 2.4M', status: 'Open' },
    ],
    documentTitle: 'Property documents',
    documentRows: [
      { id: 'BK-4420', detail: 'Unit booking', status: 'Posted' },
      { id: 'INS-118', detail: 'Installment receipt', status: 'Approved' },
      { id: 'COM-033', detail: 'Commission voucher', status: 'Sent' },
    ],
  },
  construction: {
    categoryId: 'construction',
    moduleLabel: 'Construction ERP',
    primaryIcon: 'HardHat',
    heroKpis: [
      { label: 'Active sites', value: '6', chip: 'Live' },
      { label: 'Material issued', value: 'AED 3.2M', chip: 'MTD' },
      { label: 'BOQ progress', value: '67%', chip: 'On track' },
    ],
    chartTitle: 'Project cost vs budget',
    chartBars: [30, 38, 45, 50, 55, 58, 62, 65, 68, 72, 75, 78],
    workflowTitle: 'Site management workflow',
    workflowSteps: ['BOQ estimate', 'Material requisition', 'Site issue', 'Sub-contractor bill', 'Progress billing'],
    reportTitle: 'Construction reports',
    reportRows: [
      { name: 'Material at site', value: 'AED 1.1M', status: 'Live' },
      { name: 'BOQ consumption', value: '67%', status: 'Active' },
      { name: 'Sub-contractor dues', value: 'AED 890K', status: 'Open' },
    ],
    documentTitle: 'Site vouchers',
    documentRows: [
      { id: 'MR-2201', detail: 'Cement issue — Site B', status: 'Posted' },
      { id: 'GRN-554', detail: 'Steel inward', status: 'Approved' },
      { id: 'PB-091', detail: 'Progress bill #4', status: 'Sent' },
    ],
  },
  manufacturing: {
    categoryId: 'manufacturing',
    moduleLabel: 'Manufacturing ERP',
    primaryIcon: 'Factory',
    heroKpis: [
      { label: 'Production orders', value: '34', chip: 'Active' },
      { label: 'BOM accuracy', value: '98%', chip: 'OK' },
      { label: 'WIP value', value: 'AED 4.8M', chip: 'Live' },
    ],
    chartTitle: 'Production line output',
    chartBars: [50, 55, 60, 58, 65, 70, 72, 78, 75, 82, 88, 90],
    workflowTitle: 'Manufacturing workflow',
    workflowSteps: ['BOM planning', 'Material issue', 'Production run', 'QC check', 'Finished goods'],
    reportTitle: 'Production analytics',
    reportRows: [
      { name: 'Line efficiency', value: '91%', status: 'Live' },
      { name: 'BOM variance', value: '2.1%', status: 'OK' },
      { name: 'WIP ageing', value: '5 days', status: 'Posted' },
    ],
    documentTitle: 'Production documents',
    documentRows: [
      { id: 'WO-881', detail: 'Work order — Line 2', status: 'Posted' },
      { id: 'ISS-442', detail: 'Raw material issue', status: 'Approved' },
      { id: 'FG-119', detail: 'Finished goods GRN', status: 'Sent' },
    ],
  },
  retail: {
    categoryId: 'retail',
    moduleLabel: 'Retail POS ERP',
    primaryIcon: 'ShoppingCart',
    heroKpis: [
      { label: 'POS sales', value: 'AED 2.1M', chip: 'Today' },
      { label: 'Transactions', value: '842', chip: 'Live' },
      { label: 'Stock alerts', value: '14', chip: 'Reorder' },
    ],
    chartTitle: 'Retail sales analytics',
    chartBars: [45, 52, 58, 62, 68, 72, 70, 78, 82, 85, 88, 92],
    workflowTitle: 'Retail workflow',
    workflowSteps: ['Barcode scan', 'POS billing', 'Stock deduction', 'Shift close', 'Accounts sync'],
    reportTitle: 'Retail dashboards',
    reportRows: [
      { name: 'Category-wise sales', value: 'Live', status: 'Ready' },
      { name: 'Fast movers', value: 'Top 50', status: 'Posted' },
      { name: 'Shrinkage', value: '0.4%', status: 'OK' },
    ],
    documentTitle: 'Retail vouchers',
    documentRows: [
      { id: 'POS-9921', detail: 'Counter sale', status: 'Posted' },
      { id: 'RET-044', detail: 'Sale return', status: 'Approved' },
      { id: 'STK-331', detail: 'Stock transfer', status: 'Sent' },
    ],
  },
  hospitality: {
    categoryId: 'hospitality',
    moduleLabel: 'Hotel ERP',
    primaryIcon: 'Hotel',
    heroKpis: [
      { label: 'Occupancy', value: '78%', chip: 'Tonight' },
      { label: 'F&B covers', value: '142', chip: 'Today' },
      { label: 'Banquet events', value: '3', chip: 'Week' },
    ],
    chartTitle: 'Bookings & F&B revenue',
    chartBars: [38, 45, 52, 58, 62, 68, 72, 75, 78, 82, 85, 88],
    workflowTitle: 'Hospitality workflow',
    workflowSteps: ['Room booking', 'Check-in', 'F&B order', 'Banquet billing', 'Night audit'],
    reportTitle: 'Hotel analytics',
    reportRows: [
      { name: 'Room revenue', value: 'AED 1.4M', status: 'Live' },
      { name: 'Restaurant sales', value: 'AED 620K', status: 'Posted' },
      { name: 'Housekeeping status', value: '24 rooms', status: 'Active' },
    ],
    documentTitle: 'Hospitality documents',
    documentRows: [
      { id: 'BK-2208', detail: 'Room reservation', status: 'Posted' },
      { id: 'FB-441', detail: 'Restaurant KOT', status: 'Approved' },
      { id: 'BNQ-012', detail: 'Banquet invoice', status: 'Sent' },
    ],
  },
  agriculture: {
    categoryId: 'agriculture',
    moduleLabel: 'Farm ERP',
    primaryIcon: 'Wheat',
    heroKpis: [
      { label: 'Crop area', value: '420 ac', chip: 'Season' },
      { label: 'Input cost', value: 'AED 1.2M', chip: 'MTD' },
      { label: 'Yield forecast', value: '94%', chip: 'On plan' },
    ],
    chartTitle: 'Crop & dairy operations',
    chartBars: [32, 38, 42, 48, 52, 55, 58, 62, 65, 68, 72, 75],
    workflowTitle: 'Farm workflow',
    workflowSteps: ['Land record', 'Input issue', 'Irrigation log', 'Harvest intake', 'Sale dispatch'],
    reportTitle: 'Agriculture analytics',
    reportRows: [
      { name: 'Crop cost per acre', value: 'AED 42K', status: 'Live' },
      { name: 'Milk collection', value: '2,400 L', status: 'Posted' },
      { name: 'Feed inventory', value: '18 t', status: 'OK' },
    ],
    documentTitle: 'Farm documents',
    documentRows: [
      { id: 'INP-331', detail: 'Fertilizer issue', status: 'Posted' },
      { id: 'MILK-882', detail: 'Dairy collection', status: 'Approved' },
      { id: 'HAR-044', detail: 'Harvest GRN', status: 'Sent' },
    ],
  },
  logistics: {
    categoryId: 'logistics',
    moduleLabel: 'Logistics ERP',
    primaryIcon: 'Truck',
    heroKpis: [
      { label: 'Active trips', value: '28', chip: 'Live' },
      { label: 'Fleet utilisation', value: '86%', chip: 'Week' },
      { label: 'Freight billed', value: 'AED 3.4M', chip: 'MTD' },
    ],
    chartTitle: 'Fleet & freight analytics',
    chartBars: [40, 48, 52, 58, 55, 62, 68, 72, 70, 76, 80, 84],
    workflowTitle: 'Transport workflow',
    workflowSteps: ['Trip plan', 'Loading', 'POD capture', 'Freight invoice', 'Accounts'],
    reportTitle: 'Logistics reports',
    reportRows: [
      { name: 'Trip profitability', value: 'Live', status: 'Ready' },
      { name: 'Vehicle mileage', value: '12.4 km/L', status: 'Posted' },
      { name: 'Pending PODs', value: '6', status: 'Open' },
    ],
    documentTitle: 'Transport vouchers',
    documentRows: [
      { id: 'TRP-881', detail: 'Trip sheet', status: 'Posted' },
      { id: 'POD-442', detail: 'Proof of delivery', status: 'Approved' },
      { id: 'FRT-119', detail: 'Freight invoice', status: 'Sent' },
    ],
  },
  smb: {
    categoryId: 'smb',
    moduleLabel: 'SMB Cloud ERP',
    primaryIcon: 'Briefcase',
    heroKpis: [
      { label: 'Revenue', value: 'AED 2.8M', chip: 'MTD' },
      { label: 'Receivables', value: 'AED 640K', chip: 'Open' },
      { label: 'Cash position', value: 'AED 1.1M', chip: 'Live' },
    ],
    chartTitle: 'Business performance',
    chartBars: [42, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78, 82],
    workflowTitle: 'Core ERP workflow',
    workflowSteps: ['Sales order', 'Invoice', 'Receipt', 'Expense', 'Management report'],
    reportTitle: 'Executive reports',
    reportRows: [
      { name: 'P&L summary', value: 'MTD', status: 'Ready' },
      { name: 'Cash flow', value: 'Live', status: 'Posted' },
      { name: 'Receivable aging', value: '30+ days', status: 'Open' },
    ],
    documentTitle: 'Business vouchers',
    documentRows: [
      { id: 'INV-4421', detail: 'Sales invoice', status: 'Posted' },
      { id: 'RCP-118', detail: 'Cash receipt', status: 'Approved' },
      { id: 'EXP-033', detail: 'Expense voucher', status: 'Sent' },
    ],
  },
  visa: {
    categoryId: 'visa',
    moduleLabel: 'Visa Consultancy ERP',
    primaryIcon: 'Plane',
    heroKpis: [
      { label: 'Active cases', value: '64', chip: 'Open' },
      { label: 'Submissions', value: '12', chip: 'Week' },
      { label: 'Fee collected', value: 'AED 840K', chip: 'MTD' },
    ],
    chartTitle: 'Case pipeline analytics',
    chartBars: [35, 40, 45, 50, 48, 55, 58, 62, 65, 70, 72, 78],
    workflowTitle: 'Immigration workflow',
    workflowSteps: ['Client intake', 'Document check', 'Embassy submit', 'Status track', 'Invoice'],
    reportTitle: 'Consultancy reports',
    reportRows: [
      { name: 'Case status board', value: '64 cases', status: 'Live' },
      { name: 'Document pending', value: '18', status: 'Alert' },
      { name: 'Agent commission', value: 'AED 120K', status: 'Posted' },
    ],
    documentTitle: 'Case documents',
    documentRows: [
      { id: 'CASE-881', detail: 'Visa application', status: 'Posted' },
      { id: 'DOC-442', detail: 'Passport scan', status: 'Approved' },
      { id: 'FEE-119', detail: 'Consultancy invoice', status: 'Sent' },
    ],
  },
  electronics: {
    categoryId: 'electronics',
    moduleLabel: 'Electronics Retail ERP',
    primaryIcon: 'Laptop',
    heroKpis: [
      { label: 'POS sales', value: 'AED 1.6M', chip: 'Today' },
      { label: 'SKU count', value: '1,240', chip: 'Active' },
      { label: 'Warranty claims', value: '8', chip: 'Open' },
    ],
    chartTitle: 'Electronics retail analytics',
    chartBars: [44, 50, 55, 60, 58, 65, 70, 74, 72, 78, 82, 86],
    workflowTitle: 'Electronics retail workflow',
    workflowSteps: ['Serial scan', 'POS billing', 'Warranty register', 'Stock transfer', 'Accounts'],
    reportTitle: 'Electronics dashboards',
    reportRows: [
      { name: 'Category margin', value: '16.2%', status: 'Live' },
      { name: 'Serial-tracked stock', value: '842 units', status: 'Posted' },
      { name: 'EV session revenue', value: 'AED 42K', status: 'Active' },
    ],
    documentTitle: 'Electronics vouchers',
    documentRows: [
      { id: 'POS-7721', detail: 'Laptop sale', status: 'Posted' },
      { id: 'SER-044', detail: 'Serial inward', status: 'Approved' },
      { id: 'WAR-012', detail: 'Warranty claim', status: 'Open' },
    ],
  },
}

/** Slug-level overrides when mega-menu category does not match page intent. */
const SLUG_THEME_OVERRIDE: Record<string, string> = {
  'erp-software-for-construction-business': 'construction',
  'hardware-sanitary-store-software': 'construction',
  'marble-and-granite-factory-software': 'construction',
  'plastic-pipes-fitting-industry-software': 'construction',
  'ceiling-and-wall-paneling-store-software': 'construction',
  'tiles-and-ceramics-store-software': 'construction',
  'lpg-transport-management-software': 'logistics',
  'motor-market-management-software': 'retail',
  'fabric-store-management-software': 'retail',
  'tuc-shop-management-software': 'hospitality',
  'homeopathic-business-management-software': 'medical',
  'dairy-farm-management-software': 'agriculture',
  'ev-charging-station-management-software': 'electronics',
}

export function getIndustryErpTheme(categoryId: string, slug?: string, countryCode?: string): IndustryErpTheme {
  const resolved = (slug && SLUG_THEME_OVERRIDE[slug]) || categoryId
  const base = THEMES[resolved] ?? THEMES.smb
  return regionalizeTheme(base, normalizeCountryCode(countryCode))
}
