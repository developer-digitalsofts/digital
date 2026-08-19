import type { DetailMockupVariant } from '../../types/detailPageSections'
import type { ModuleIntegrationNodeModel, ModuleNavItem } from '../../types/moduleDetailPage'

export const MODULE_NAV_ITEMS: ModuleNavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'reports', label: 'Reports' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'faqs', label: 'FAQs' },
]

const INTEGRATIONS: Record<string, ModuleIntegrationNodeModel[]> = {
  'inventory-management-software': [
    { label: 'Purchase', icon: 'ShoppingCart' },
    { label: 'Sales', icon: 'Receipt' },
    { label: 'Production', icon: 'Factory' },
    { label: 'POS', icon: 'Store' },
    { label: 'Accounts', icon: 'Landmark' },
    { label: 'Reporting', icon: 'BarChart3' },
  ],
  'accounts-management-software': [
    { label: 'Inventory', icon: 'Package' },
    { label: 'Sales', icon: 'Receipt' },
    { label: 'Purchase', icon: 'ShoppingCart' },
    { label: 'Payroll', icon: 'Users' },
    { label: 'POS', icon: 'Store' },
    { label: 'Reporting', icon: 'BarChart3' },
  ],
  'production-management-software': [
    { label: 'Inventory', icon: 'Package' },
    { label: 'Purchase', icon: 'ShoppingCart' },
    { label: 'Sales', icon: 'Receipt' },
    { label: 'Accounts', icon: 'Landmark' },
    { label: 'Quality', icon: 'ShieldCheck' },
    { label: 'Reporting', icon: 'BarChart3' },
  ],
  'point-of-sale-management-software': [
    { label: 'Inventory', icon: 'Package' },
    { label: 'Accounts', icon: 'Landmark' },
    { label: 'CRM', icon: 'Users' },
    { label: 'VAT', icon: 'FileCheck' },
    { label: 'Sales', icon: 'Receipt' },
    { label: 'Reporting', icon: 'BarChart3' },
  ],
  'fbr-pos-integration-software': [
    { label: 'POS', icon: 'Store' },
    { label: 'Accounts', icon: 'Landmark' },
    { label: 'Inventory', icon: 'Package' },
    { label: 'Sales', icon: 'Receipt' },
    { label: 'Tax', icon: 'FileCheck' },
    { label: 'Reporting', icon: 'BarChart3' },
  ],
  'payroll-management-software': [
    { label: 'Accounts', icon: 'Landmark' },
    { label: 'HR', icon: 'Users' },
    { label: 'Attendance', icon: 'Clock' },
    { label: 'Production', icon: 'Factory' },
    { label: 'Leave', icon: 'Calendar' },
    { label: 'Reporting', icon: 'BarChart3' },
  ],
  'crm-software': [
    { label: 'Sales', icon: 'Receipt' },
    { label: 'Accounts', icon: 'Landmark' },
    { label: 'POS', icon: 'Store' },
    { label: 'SMS', icon: 'MessageSquare' },
    { label: 'Support', icon: 'Headphones' },
    { label: 'Reporting', icon: 'BarChart3' },
  ],
  'integration-system': [
    { label: 'ERP', icon: 'Layers' },
    { label: 'Sales', icon: 'Receipt' },
    { label: 'Accounts', icon: 'Landmark' },
    { label: 'Inventory', icon: 'Package' },
    { label: 'CRM', icon: 'Users' },
    { label: 'Reporting', icon: 'BarChart3' },
  ],
}

const WORKFLOW_OVERRIDES: Record<string, { label: string; description?: string }[]> = {
  'inventory-management-software': [
    { label: 'Chart & Locations' },
    { label: 'Requisition' },
    { label: 'Receive' },
    { label: 'Transfer' },
    { label: 'Assemble / Disassemble' },
    { label: 'Issue' },
    { label: 'Report' },
  ],
  'accounts-management-software': [
    { label: 'Account Setup' },
    { label: 'Voucher Entry' },
    { label: 'Approval' },
    { label: 'Posting' },
    { label: 'Reconciliation' },
    { label: 'Reporting' },
  ],
  'production-management-software': [
    { label: 'BOM' },
    { label: 'Material Requisition' },
    { label: 'Material Issue' },
    { label: 'Production' },
    { label: 'Quality Check' },
    { label: 'Finished Goods' },
  ],
  'payroll-management-software': [
    { label: 'Employee Setup' },
    { label: 'Attendance' },
    { label: 'Payroll Calculation' },
    { label: 'Approval' },
    { label: 'Payment' },
    { label: 'Reporting' },
  ],
}

const ROLE_DEFAULTS: Record<string, { title: string; description: string; icon: string }[]> = {
  default: [
    { title: 'Business Owner', description: 'Executive visibility into KPIs, approvals, and profitability without chasing spreadsheets.', icon: 'Briefcase' },
    { title: 'Module Manager', description: 'Configure workflows, monitor exceptions, and keep branch teams aligned on standards.', icon: 'Settings' },
    { title: 'Operational User', description: 'Fast daily transactions with clear validation, fewer re-entries, and audit-ready history.', icon: 'UserCheck' },
    { title: 'Finance / Approver', description: 'Controlled approvals, reconciliations, and reports finance can trust at month-end.', icon: 'Landmark' },
  ],
}

export function integrationsForSlug(slug: string): ModuleIntegrationNodeModel[] {
  return INTEGRATIONS[slug] ?? INTEGRATIONS['inventory-management-software']
}

export function workflowStepsForSlug(slug: string): { label: string; description?: string }[] | undefined {
  return WORKFLOW_OVERRIDES[slug]
}

export function defaultRolesForSlug(_slug: string) {
  return ROLE_DEFAULTS.default
}

export const POS_MODULE_SLUG = 'point-of-sale-management-software'

export function isPosModuleSlug(slug: string): boolean {
  return slug === POS_MODULE_SLUG || slug === 'point-of-sale-software'
}

export function heroModuleTypeForSlug(slug: string): 'finance' | 'inventory' | 'pos' | 'hr' | 'erp' {
  const map: Record<string, 'finance' | 'inventory' | 'pos' | 'hr' | 'erp'> = {
    'accounts-management-software': 'finance',
    'inventory-management-software': 'inventory',
    'point-of-sale-management-software': 'pos',
    'fbr-pos-integration-software': 'pos',
    'payroll-management-software': 'hr',
    'production-management-software': 'erp',
    'crm-software': 'erp',
    'integration-system': 'erp',
  }
  return map[slug] ?? 'erp'
}

export function mockupVariantForModuleSlug(slug: string): DetailMockupVariant {
  const map: Record<string, DetailMockupVariant> = {
    'accounts-management-software': 'accounts',
    'inventory-management-software': 'inventory',
    'production-management-software': 'production',
    'point-of-sale-management-software': 'pos',
    'fbr-pos-integration-software': 'pos',
    'payroll-management-software': 'payroll',
    'crm-software': 'crm',
    'integration-system': 'generic-module',
  }
  return map[slug] ?? 'generic-module'
}

export function visibilityHeadingForSlug(slug: string, productLabel: string): string {
  const map: Record<string, string> = {
    'inventory-management-software': 'See Every Stock Movement Clearly',
    'accounts-management-software': 'See Every Financial Decision Clearly',
    'point-of-sale-management-software': 'See Every Sale Clearly',
    'fbr-pos-integration-software': 'See Every Invoice Clearly',
    'production-management-software': 'See Every Production Stage Clearly',
    'payroll-management-software': 'See Every Payroll Cycle Clearly',
    'crm-software': 'See Every Customer Interaction Clearly',
    'integration-system': 'See Every Connected Process Clearly',
  }
  return map[slug] ?? `See Every ${productLabel} Decision Clearly`
}
