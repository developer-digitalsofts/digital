import type { MegaMenuFeaturedColumn } from './megaMenuFeaturedTypes'

const img = (slug: string, file = 'hero') => `/software-images/${slug}/${file}.jpg`

/** Curated module links for the desktop mega menu — 3 columns × 3 items. */
export const megaMenuModuleColumns: MegaMenuFeaturedColumn[] = [
  {
    id: 'financeCompliance',
    items: [
      {
        id: 'accountsFinance',
        slug: 'accounts-management-software',
        to: '/software/accounts-management-software',
        image: img('accounts-management-software', 'dashboard'),
        imageAlt: 'Accounts and finance management dashboard',
      },
      {
        id: 'vatCompliance',
        slug: 'fbr-pos-integration-software',
        to: '/software/fbr-pos-integration-software',
        image: img('fbr-pos-integration-software', 'dashboard'),
        imageAlt: 'UAE VAT POS integration software',
      },
      {
        id: 'reportsAnalytics',
        slug: 'accounts-management-software',
        to: '/software/accounts-management-software',
        image: img('accounts-management-software', 'reports'),
        imageAlt: 'Business reports and analytics',
      },
    ],
  },
  {
    id: 'operations',
    items: [
      {
        id: 'inventoryManagement',
        slug: 'inventory-management-software',
        to: '/software/inventory-management-software',
        image: img('inventory-management-software', 'hero'),
        imageAlt: 'Inventory management software',
      },
      {
        id: 'productionManagement',
        slug: 'production-management-software',
        to: '/software/production-management-software',
        image: img('production-management-software', 'dashboard'),
        imageAlt: 'Production management software',
      },
      {
        id: 'purchaseManagement',
        slug: 'purchase-management-software',
        to: '/software/purchase-management-software',
        image: img('inventory-management-software', 'ledger'),
        imageAlt: 'Purchase management and procurement',
      },
    ],
  },
  {
    id: 'salesWorkforce',
    items: [
      {
        id: 'pointOfSale',
        slug: 'point-of-sale-management-software',
        to: '/software/point-of-sale-software',
        image: img('point-of-sale-management-software', 'hero'),
        imageAlt: 'Point of sale management software',
      },
      {
        id: 'crmSoftware',
        slug: 'crm-software',
        to: '/software/crm-software',
        image: img('crm-software', 'dashboard'),
        imageAlt: 'CRM software',
      },
      {
        id: 'payrollManagement',
        slug: 'payroll-management-software',
        to: '/software/payroll-management-software',
        image: img('payroll-management-software', 'hero'),
        imageAlt: 'Payroll management software',
      },
    ],
  },
]
