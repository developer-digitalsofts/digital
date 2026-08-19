import type { DonutSegment, KpiItem, TableColumn, TableRow, ProductRow, BranchRow } from './types'

export const inventoryPosProducts: ProductRow[] = [
  { name: 'Wireless Headphones', qty: '142', icon: 'headphones' },
  { name: 'Smart Watch', qty: '118', icon: 'watch' },
  { name: 'Bluetooth Speaker', qty: '96', icon: 'bag' },
  { name: 'Power Bank', qty: '84', icon: 'phone' },
  { name: 'USB-C Cable', qty: '72', icon: 'bag' },
]

export const inventoryBranchStock: BranchRow[] = [
  { branch: 'Dubai', inStock: '1,240', low: '18', out: '3' },
  { branch: 'Riyadh', inStock: '980', low: '12', out: '2' },
  { branch: 'Doha', inStock: '760', low: '9', out: '1' },
  { branch: 'Manama', inStock: '540', low: '6', out: '0' },
]

export const inventorySalesTrend = [22, 28, 26, 34, 32, 38, 36, 40]

export const erpKpis: KpiItem[] = [
  { label: 'Revenue', value: 'AED 2.4M', hint: '+8.2%', tone: 'positive' },
  { label: 'Gross Profit', value: 'AED 612K', hint: '+11.3%', tone: 'positive' },
  { label: 'Receivables', value: 'AED 318K', hint: 'Due 30d', tone: 'warning' },
  { label: 'Active Branches', value: '12', hint: 'All Active', tone: 'info' },
]

export const erpRevenueTarget = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  actual: [68, 72, 65, 78, 74, 82],
  target: [64, 70, 68, 72, 76, 80],
}

export const erpBusinessHealth = [
  { label: 'Finance', value: 92, color: '#f47c4d' },
  { label: 'Inventory', value: 97, color: '#14b8a6' },
  { label: 'Sales', value: 88, color: '#6366f1' },
  { label: 'Operations', value: 94, color: '#141d38' },
]

export const erpBranchPerformance = [
  { name: 'Dubai', value: 92, amount: 'AED 980K' },
  { name: 'Riyadh', value: 78, amount: 'AED 640K' },
  { name: 'Doha', value: 65, amount: 'AED 420K' },
  { name: 'Manama', value: 58, amount: 'AED 360K' },
]

export const financeCashFlow = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  values: [72, 84, 78, 96, 102, 126],
}

export const hrPayrollSummary = [
  { label: 'Processed', value: 'AED 404K', tone: 'positive' as const },
  { label: 'Pending', value: 'AED 24K', tone: 'warning' as const },
  { label: 'Next Run', value: '28 May', tone: 'info' as const },
]

export const erpDocuments: { columns: TableColumn[]; rows: TableRow[] } = {
  columns: [
    { key: 'doc', label: 'Document' },
    { key: 'branch', label: 'Branch' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status' },
  ],
  rows: [
    { doc: 'SO-20481', branch: 'Dubai', amount: 'AED 42,900', status: { text: 'Posted', tone: 'info' } },
    { doc: 'GRN-8832', branch: 'Riyadh', amount: 'AED 18,200', status: { text: 'Approved', tone: 'positive' } },
    { doc: 'INV-9910', branch: 'Doha', amount: 'AED 9,450', status: { text: 'Sent', tone: 'neutral' } },
    { doc: 'PO-4421', branch: 'Manama', amount: 'AED 6,780', status: { text: 'Cleared', tone: 'purple' } },
  ],
}

export const financeKpis: KpiItem[] = [
  { label: 'Cash in Hand', value: 'AED 842K', hint: '+4.1%', tone: 'positive' },
  {
    label: 'Net Cash Flow',
    value: 'AED 126K',
    hint: 'This month',
    tone: 'info',
    sparkline: [22, 28, 24, 36, 32, 42, 38, 48],
  },
  { label: 'Receivables', value: 'AED 318K', hint: 'Due 30d', tone: 'warning' },
  { label: 'Net Profit Margin', value: '18.4%', hint: 'Stable', tone: 'positive' },
]

export const financeGroupedBars = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  revenue: [58, 62, 55, 70, 66, 74],
  expenses: [42, 45, 40, 48, 44, 50],
}

export const financeAgingDonut: DonutSegment[] = [
  { label: '0–30 days', value: 42, color: '#14b8a6' },
  { label: '31–60 days', value: 28, color: '#FF714A' },
  { label: '61–90 days', value: 17, color: '#6366f1' },
  { label: '90+ days', value: 13, color: '#ef4444' },
]

export const financeTransactions: { columns: TableColumn[]; rows: TableRow[] } = {
  columns: [
    { key: 'ref', label: 'Reference' },
    { key: 'account', label: 'Account' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status' },
  ],
  rows: [
    { ref: 'PAY-8841', account: 'Al Noor Trading', amount: 'AED 12,400', status: { text: 'Paid', tone: 'positive' } },
    { ref: 'RCT-9912', account: 'Gulf Retail LLC', amount: 'AED 28,900', status: { text: 'Paid', tone: 'positive' } },
    { ref: 'INV-7720', account: 'Dubai Holdings', amount: 'AED 64,200', status: { text: 'Pending', tone: 'warning' } },
    { ref: 'PAY-8813', account: 'Emirates Supplies', amount: 'AED 9,850', status: { text: 'Overdue', tone: 'critical' } },
  ],
}

export const inventoryKpis: KpiItem[] = [
  { label: 'Stock Accuracy', value: '97%', hint: 'On target', tone: 'positive' },
  { label: 'Inventory Value', value: 'AED 1.25M', hint: '+5.4%', tone: 'info' },
  { label: 'Low Stock Items', value: '24', hint: 'Alert', tone: 'warning' },
  { label: 'Fast-Moving Items', value: '32', hint: 'This week', tone: 'purple' },
]

export const inventoryStockMovement = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  inbound: [52, 48, 60, 55, 62, 44],
  outbound: [44, 50, 58, 64, 70, 52],
}

export const inventoryCategoryDonut: DonutSegment[] = [
  { label: 'Electronics', value: 42, color: '#f47c4d' },
  { label: 'Groceries', value: 28, color: '#14b8a6' },
  { label: 'Fashion', value: 18, color: '#6366f1' },
  { label: 'Others', value: 12, color: '#94a3b8' },
]

export const inventoryWarehouses = [
  { name: 'Dubai', value: 92 },
  { name: 'Riyadh', value: 88 },
  { name: 'Doha', value: 85 },
  { name: 'Manama', value: 90 },
]

export const inventoryItems: { columns: TableColumn[]; rows: TableRow[] } = {
  columns: [
    { key: 'item', label: 'Item' },
    { key: 'sku', label: 'SKU' },
    { key: 'available', label: 'Available', align: 'right' },
    { key: 'status', label: 'Status' },
    { key: 'velocity', label: 'Velocity', align: 'right' },
  ],
  rows: [
    { item: '🎧 Wireless Headphones', sku: 'WH-204', available: '142', status: { text: 'In Stock', tone: 'positive' }, velocity: 'High' },
    { item: '⌚ Smart Watch', sku: 'SW-118', available: '98', status: { text: 'In Stock', tone: 'positive' }, velocity: 'High' },
    { item: '🔌 USB-C Hub', sku: 'UH-076', available: '18', status: { text: 'Low Stock', tone: 'warning' }, velocity: 'Med' },
    { item: '💻 Laptop Stand', sku: 'LS-054', available: '6', status: { text: 'Reorder', tone: 'critical' }, velocity: 'High' },
  ],
}

export const posKpis: KpiItem[] = [
  { label: "Today's Sales", value: 'AED 132,760', hint: '+12%', tone: 'positive' },
  { label: 'Transactions', value: '486', hint: 'Live', tone: 'info' },
  { label: 'Average Basket', value: 'AED 273', hint: '+6.2%', tone: 'positive' },
  { label: 'Active Tills', value: '12/15', hint: 'Open', tone: 'info' },
]

export const posHourlySales = {
  labels: ['8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'],
  values: [18, 32, 48, 56, 62, 78, 84, 52],
}

export const posPaymentDonut: DonutSegment[] = [
  { label: 'Card', value: 48, color: '#f47c4d' },
  { label: 'Cash', value: 32, color: '#141d38' },
  { label: 'Digital Wallet', value: 20, color: '#6366f1' },
]

export const posTills = [
  { label: 'Open', count: 12, tone: 'positive' as const },
  { label: 'Closing', count: 2, tone: 'warning' as const },
  { label: 'Offline', count: 1, tone: 'critical' as const },
]

export const posReceipts: { columns: TableColumn[]; rows: TableRow[] } = {
  columns: [
    { key: 'receipt', label: 'Receipt' },
    { key: 'till', label: 'Till' },
    { key: 'payment', label: 'Payment' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'status', label: 'Status' },
  ],
  rows: [
    { receipt: 'RCP-4481', till: 'T-03', payment: 'Card', amount: 'AED 428', status: { text: 'Completed', tone: 'positive' } },
    { receipt: 'RCP-4482', till: 'T-07', payment: 'Cash', amount: 'AED 156', status: { text: 'Completed', tone: 'positive' } },
    { receipt: 'RCP-4483', till: 'T-01', payment: 'Wallet', amount: 'AED 892', status: { text: 'Completed', tone: 'info' } },
    { receipt: 'RCP-4484', till: 'T-05', payment: 'Card', amount: 'AED 312', status: { text: 'Refunded', tone: 'warning' } },
  ],
}

export const posTopProducts = [
  { name: 'Premium Coffee', qty: 86 },
  { name: 'Organic Dates', qty: 64 },
  { name: 'Mineral Water', qty: 52 },
  { name: 'Fresh Juice', qty: 41 },
  { name: 'Energy Bar', qty: 36 },
]

export const hrKpis: KpiItem[] = [
  { label: 'Active Employees', value: '128', hint: 'All branches', tone: 'info' },
  { label: 'Present Today', value: '116', hint: '90.6%', tone: 'positive' },
  { label: 'On Leave', value: '7', hint: 'Pending', tone: 'warning' },
  { label: 'Monthly Payroll', value: 'AED 428K', hint: 'This cycle', tone: 'purple' },
]

export const hrAttendanceTrend = {
  labels: ['W1', 'W2', 'W3', 'W4'],
  present: [92, 94, 91, 96],
  absent: [4, 3, 5, 2],
  late: [4, 3, 4, 2],
}

export const hrDepartmentDonut: DonutSegment[] = [
  { label: 'Sales', value: 32, color: '#f47c4d' },
  { label: 'Finance', value: 18, color: '#6366f1' },
  { label: 'Operations', value: 34, color: '#141d38' },
  { label: 'Support', value: 16, color: '#14b8a6' },
]

export const hrAttendance: { columns: TableColumn[]; rows: TableRow[] } = {
  columns: [
    { key: 'employee', label: 'Employee' },
    { key: 'department', label: 'Department' },
    { key: 'checkIn', label: 'Check In' },
    { key: 'status', label: 'Status' },
  ],
  rows: [
    { employee: 'SA Sara Ali', department: 'Finance', checkIn: '08:52', status: { text: 'Present', tone: 'positive' } },
    { employee: 'OK Omar Khan', department: 'Sales', checkIn: '09:18', status: { text: 'Late', tone: 'warning' } },
    { employee: 'LM Layla Mansour', department: 'Operations', checkIn: '—', status: { text: 'On Leave', tone: 'info' } },
    { employee: 'FH Fatima Hassan', department: 'Support', checkIn: '08:05', status: { text: 'Remote', tone: 'purple' } },
  ],
}

export const hrLeaveRequests = [
  { name: 'Sara Ali', type: 'Annual', status: 'Pending' },
  { name: 'Omar Khan', type: 'Sick', status: 'Approved' },
  { name: 'Layla Mansour', type: 'Annual', status: 'Pending' },
  { name: 'Fatima Hassan', type: 'Remote', status: 'Approved' },
  { name: 'Ahmed Saleh', type: 'Annual', status: 'Pending' },
]
