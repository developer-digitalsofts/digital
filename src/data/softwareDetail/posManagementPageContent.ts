import type {
  SoftwareDetailPageData,
  SoftwareFaqItem,
  SoftwareImplementationStep,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
  SoftwareTabBlock,
} from './types'

function moduleTab(problem: string, solution: string, transactions: string[], reports: string[]): SoftwareNamedItem[] {
  return [
    { name: 'Problem', description: problem },
    { name: 'Solution', description: solution },
    { name: 'Transactions', description: transactions.join(' • ') },
    { name: 'Reports', description: reports.join(' • ') },
  ]
}

const PURCHASE_TX = [
  'Purchase Order Voucher',
  'Purchase Invoice Voucher',
  'Purchase Return Voucher',
]

const PURCHASE_REP = [
  'Purchase Order Report',
  'Pending Purchase Report',
  'Purchase Report',
  'Purchase Summary Report',
  'Purchase Register',
  'Purchase Comparison',
  'Purchase Return Report',
  'Purchase Return Register',
]

const SALES_TX = [
  'Customer Definition',
  'Sale Order Voucher',
  'Credit Sale Voucher',
  'Sale Return Voucher',
  'Cash Sale Voucher',
]

const SALES_REP = [
  'Sale Order Report',
  'Pending Sale Order Report',
  'Credit Sale Report',
  'Credit Sale Summary Report',
  'Salesman Wise Commission Report',
  'Salesman Commission Report',
  'Salesman Performance Report',
  'Cash Sale Report',
  'Cash Sale Summary Report',
  'Net Sale Report',
  'Sale Return Report',
  'Sale Return Register',
  'Sale Return Comparison Report',
]

const INV_TX = [
  'Chart of Item Definition',
  'Warehouse Definition',
  'Opening Stock Voucher',
  'Stock Adjustment Voucher',
  'Stock Navigation / Transfer Voucher',
  'Assemble / De-Assemble Voucher',
]

const INV_REP = [
  'Minimum and Maximum Stock Level Report',
  'Product Ledger Report',
  'Inventory Summary Report',
  'Stock Report',
  'Stock Value Report',
  'Stock Navigation Report',
  'Stock Adjustment Report',
]

const ACC_TX = [
  'General Accounts Definition',
  'Other Income Definition',
  'Cash & Bank Definition',
  'Expense Definition',
  'Opening Balance Definition',
  'Cash Payment Voucher',
  'Bank Payment Voucher',
  'Bank Receipt Voucher',
  'Cheque Payment Voucher',
  'Debit Notes',
  'Credit Notes',
  'Journal Entry Voucher',
]

const ACC_REP = [
  'Cash Received / Payment Reports',
  'Day Book',
  'Accounts Ledger Report',
  'Trial Balance',
  'Profit & Loss Report',
  'Balance Sheet Statement',
]

const POS_TABS: SoftwareTabBlock[] = [
  {
    id: 'purchase',
    title: 'Purchase Management',
    items: moduleTab(
      'Poor purchase management causes delayed stock handling, supplier issues, uncontrolled expenses, and inventory shortages.',
      'Our Purchase Management System streamlines vendor handling, purchase orders, invoices, and return processing for complete purchasing control.',
      PURCHASE_TX,
      PURCHASE_REP,
    ),
  },
  {
    id: 'sales',
    title: 'Sales Management',
    items: moduleTab(
      'Manual sales operations create billing delays, customer handling issues, and poor sales tracking.',
      'Our Sales Management System improves billing speed, customer handling, credit sales tracking, and reporting efficiency.',
      SALES_TX,
      SALES_REP,
    ),
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    items: moduleTab(
      'Inventory mismanagement causes stock shortages, wastage, and operational inefficiencies.',
      'Our Inventory Management System provides stock visibility, warehouse management, stock adjustment, and inventory tracking.',
      INV_TX,
      INV_REP,
    ),
  },
  {
    id: 'accounts',
    title: 'Accounts Management',
    items: moduleTab(
      'Manual accounting creates calculation mistakes, delayed reporting, and poor financial visibility.',
      'Our Accounts Management System handles vouchers, ledgers, cash flow, banking, receivables, payables, and financial reporting efficiently.',
      ACC_TX,
      ACC_REP,
    ),
  },
]

const POS_FAQS: SoftwareFaqItem[] = [
  {
    q: 'How does DigitalManager POS connect purchase, sales, inventory, and accounts?',
    a: 'The retail suite shares one item, customer, and ledger backbone so POS checkouts, purchase invoices, stock movements, and financial vouchers stay aligned without duplicate entry between systems.',
  },
  {
    q: 'Is FBR digital invoicing supported for retail?',
    a: 'Where you enable regulator integration, sale and return payloads can follow schema-aware rules with submission queues and reconciliation views—keeping tax lines consistent with what was posted at the register.',
  },
  {
    q: 'Does POS work when connectivity drops?',
    a: 'Where policy allows, lanes can operate in a degraded or offline-tolerant mode and synchronise vouchers when connectivity returns, with conflict rules designed to avoid duplicate revenue recognition.',
  },
  {
    q: 'Can promotions stack with customer-specific price lists?',
    a: 'Promotions, bundles, and contract pricing can be layered with precedence rules so cashiers see a single net price while finance retains the full breakdown for margin and audit.',
  },
  {
    q: 'How are barcodes and multiple identifiers handled?',
    a: 'Items can carry EAN, internal codes, and weighted PLU identifiers where used, with validation at scan time to reduce mis-postings at busy counters.',
  },
  {
    q: 'Can we roll out modules gradually (for example sales before full purchasing)?',
    a: 'Yes. Teams often go live with sales and inventory first, then widen purchase and accounts depth as masters and approvals mature—without changing platform.',
  },
  {
    q: 'What does implementation include?',
    a: 'Consultancy, training, software installation, and support are structured so store supervisors, buyers, and finance share one rollout playbook for POS and back office on DigitalManager.',
  },
  {
    q: 'How do tender and shift closes reconcile to finance?',
    a: 'Cashier shifts, tender breakdowns, and Z/X style reads feed controlled summaries so branch cash and card totals can be compared to gateway settlements and bank deposits with clear variance notes.',
  },
]

const POS_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map your store formats, tax profile, purchase and sales cycles, stock locations, and FBR expectations so DigitalManager POS mirrors how your retail and finance teams actually work.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Role-based training for cashiers, supervisors, buyers, and accountants—covering lanes, vouchers, returns, and reporting before peak trading.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Tenant setup, item and price imports, register templates, and sandbox validation before production traffic hits the new POS programme.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing configuration help, troubleshooting, and optimisation after go-live so seasonal peaks and catalogue changes do not slow the floor.',
  },
]

const INTRO =
  'All-in-one retail management solution for grocery stores, fashion boutiques, electronics shops, salons, cafes, restaurants, and pharmacies.\n\nSeamlessly FBR-integrated and designed for businesses of all sizes.'

/**
 * Post-template content for the Point of Sale Management module page only.
 */
export function mergePosManagementPremiumPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...pl,
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, sales, inventory, and accounts management and information — unified with POS so stores run faster and head office sees one version of performance.',
    vouchersSectionEyebrow: 'POS retail suite',
    challengesHeading: 'Why integrated POS on DigitalManager',
    challengesIntro:
      'Retail growth depends on fast checkout, trustworthy stock, disciplined purchasing, and finance-grade reporting. When those areas live in different tools, teams lose time reconciling tickets to inventory and the ledger.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'One platform for the counter and the books',
    solutionParagraphs: [
      'DigitalManager POS connects lane activity with purchase, sales, inventory, and accounts modules — including FBR-aligned invoicing where you enable it — so promotions, stock, and settlements stay coherent from first scan to month-end.',
    ],
    heroChips: [],
    heroAsideCaption: 'Cloud POS with retail modules, FBR-ready flows, and reporting leadership can act on the same week.',
    industriesSection: {
      ...pl.industriesSection,
      heading: '',
      description: '',
      items: [],
      note: '',
    },
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured so stores and finance share one rollout path for POS on DigitalManager.',
    demoSendButtonLabel: 'Request Here',
    faqSectionHeading: pl.faqSectionHeading,
  }

  return {
    ...data,
    metaTitle: 'Cloud-Based Point Of Sale Software (POS) | DigitalManager ERP',
    metaDescription:
      'Simplify sales, track inventory, and delight customers with cloud POS — FBR-integrated retail management for grocery, fashion, electronics, salons, cafes, restaurants, and pharmacies.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Point Of Sale Software (POS) That Powers Your Retail Growth',
      subhead: 'Simplify Sales. Track Inventory. Delight Customers.',
      intro: INTRO,
      trust: [
        { value: '2000+', label: 'Happy Clients', icon: 'Users' },
        { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
        { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
        { value: '20+', label: 'Years of Experience', icon: 'Clock' },
      ],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management and Information',
        description: 'Vendor handling, purchase orders, invoices, and returns tied to stock and payables.',
      },
      {
        icon: 'Store',
        title: 'Sales Management and Information',
        description: 'Orders, credit and cash sales, returns, and customer context with faster billing and tracking.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management and Information',
        description: 'Items, warehouses, adjustments, transfers, and assembly with visibility the floor and finance agree on.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management and Information',
        description: 'Vouchers, banking, receivables, payables, and financial statements aligned to retail operations.',
      },
    ],
    vouchersReports: {
      heading: 'Module depth: purchase, sales, inventory & accounts',
      subheading:
        'Each tab summarises the problem DigitalManager addresses, the solution posture, and the transactions and reports your teams can expect in that module.',
      tabs: POS_TABS,
    },
    whyChoose: {
      ...data.whyChoose,
      points: [],
    },
    realtimeReports: {
      ...data.realtimeReports,
      bullets: [],
    },
    implementation: POS_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: POS_FAQS,
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for POS and retail management on DigitalManager.',
    },
  }
}
