import type {
  SoftwareDetailPageData,
  SoftwarePremiumPageConfig,
  SoftwareTabBlock,
} from './types'

function retailTab(problem: string, solution: string, transactions: string[], reports: string[]) {
  return [
    { name: 'Problem', description: problem },
    { name: 'Solution', description: solution },
    { name: 'Transactions', description: transactions.join(' • ') },
    { name: 'Reports', description: reports.join(' • ') },
  ]
}

const AUTO_PARTS_TRUST = [
  { value: '2000+', label: 'Happy Clients', icon: 'Users' },
  { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
  { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
  { value: '20+', label: 'Years of Experience', icon: 'Clock' },
] as const

function baseIndustryTrim(pl: SoftwarePremiumPageConfig): SoftwarePremiumPageConfig {
  return {
    ...pl,
    heroChips: [],
    industriesSection: {
      ...pl.industriesSection,
      heading: '',
      description: '',
      items: [],
      note: '',
    },
    implementationSectionTitle: '',
    implementationSectionLead: '',
    demoSendButtonLabel: 'Request Here',
    faqSectionHeading: pl.faqSectionHeading,
  }
}

const AUTO_PARTS_TABS: SoftwareTabBlock[] = [
  {
    id: 'ap-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Auto parts businesses often face difficulties in managing supplier coordination, tracking purchase orders, monitoring inventory levels, and handling spare parts procurement efficiently. Manual processes can lead to stock shortages, delayed purchases, and inaccurate records.',
      'Our Purchase Management Module simplifies the entire procurement workflow for auto parts businesses. Easily create purchase orders, manage supplier invoices, track pending purchases, and monitor purchase returns with complete visibility and accuracy.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Order Report',
        'Purchase Report',
        'Purchase Return Report',
      ],
    ),
  },
  {
    id: 'ap-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing sales of auto parts manually can create billing delays, incorrect pricing, poor customer handling, and inefficient sales tracking. Businesses often struggle to manage multiple spare parts categories and customer demands.',
      'Our Sales Management Module provides fast billing, customer management, dealer handling, sale returns, and accurate invoicing. The system helps improve customer service and streamline sales operations for auto parts retailers.',
      [
        'Add New Customers',
        'Sale Order Voucher',
        'Sale Order Selection Voucher',
        'Sale Voucher',
        'Multi Sale Voucher Print',
        'Sale Return Voucher',
      ],
      [
        'Customers List',
        'Salesman Definition',
        'Assign Sale Rate To Party',
        'Sale Order Report',
        'Pending Sale Order Report',
        'Sale Report',
        'Sale Return Report',
        'Dealers Report',
        'Sale Invoice Wise Report',
      ],
    ),
  },
  {
    id: 'ap-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Tracking thousands of spare parts, accessories, lubricants, filters, and vehicle components manually can create inventory confusion, stock mismatches, and delayed order fulfillment.',
      'Our Inventory Management Module enables real-time stock control, warehouse management, item tracking, stock transfer handling, and inventory movement monitoring to improve operational efficiency.',
      [
        'Chart Of Items',
        'Freight Assigning To Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN (Goods Received Note) / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'GIN (Goods Issue Note) / Outward Gate Pass Voucher',
        'Return Inward Voucher',
        'Stock Transfer Voucher',
        'Item Conversion Voucher',
      ],
      [
        'Goods Receipt Report',
        'Return Outward Report',
        'Goods Issue Note Report',
        'Return Inward Report',
        'Stock Transfer Report',
        'Item Conversion Report',
        'Item Ledger Report',
        'Stock Report',
        'Stock Value Report',
        'Freight Detail Report',
      ],
    ),
  },
  {
    id: 'ap-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Auto parts businesses require proper financial management to handle supplier payments, customer receivables, cash flow, and daily accounting activities. Manual accounting increases the risk of financial errors and reporting issues.',
      'Our Accounts Management Module provides a complete accounting solution for auto parts businesses with integrated vouchers, ledgers, receivables, payables, expense tracking, and financial reporting to maintain accurate business records.',
      [
        'Opening Balance Voucher',
        'Cash Payment Voucher',
        'Cash Receipt Voucher',
        'Bank Payment Voucher',
        'Bank Receipt Voucher',
        'Cheque Issue Voucher',
        'Cheque Receipt Voucher',
        'Debit Note',
        'Credit Note',
        'Journal Entry Voucher',
      ],
      [
        'Account Ledger',
        'Cash Payment Report',
        'Cash Receipt Report',
        'Bank Payment Report',
        'Bank Receipt Report',
        'Cheque Issue Report',
        'Cheque Receipt Report',
        'Cheque In Hand Report',
        'Day Book',
        'Cash Flow Management',
        'Expense Report',
        'Payable Report',
        'Receivable Report',
        'Invoice Aging Report',
        'Debtor Aging Sheet',
        'Creditor Aging Sheet',
        'Trial Balance 2 Column',
        'Trial Balance 6 Column',
        'Item Wise Profit & Loss',
        'Profit & Loss Sheet',
        'Balance Sheet',
      ],
    ),
  },
]

export function mergeAutoPartsBusinessIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, sales, inventory, and accounts — built for auto parts dealers, spare parts retailers, and vehicle accessory shops.',
    vouchersSectionEyebrow: 'Auto parts business',
    challengesHeading: 'Why auto parts dealers choose DigitalManager',
    challengesIntro:
      'Spare parts mix, dealer credit, and warehouse velocity need one spine—not counters reconciled against spreadsheets every night.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Smarter parts retail',
    solutionParagraphs: [
      'Efficiently manage inventory, track sales, handle suppliers, and monitor stock movement through a powerful cloud-based ERP system designed specifically for the auto parts industry in Pakistan.',
    ],
    heroAsideCaption: 'Auto parts ERP with purchase, sales, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Auto Parts Business Software | DigitalManager ERP',
    metaDescription:
      'Manage stock, track sales, serve faster — cloud ERP for auto parts dealers, spare parts retailers, and vehicle accessory shops in Pakistan.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Auto Parts Business Software for Smarter Inventory & Sales',
      subhead: 'Manage Stock. Track Sales. Serve Faster.',
      intro:
        'A specialized software solution for auto parts dealers, spare parts retailers, and vehicle accessory shops. Efficiently manage inventory, track sales, handle suppliers, and monitor stock movement through a powerful cloud-based ERP system designed specifically for the auto parts industry in Pakistan.',
      trust: [...AUTO_PARTS_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Purchase orders, supplier invoices, returns, and procurement visibility.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Fast billing, customers, dealers, sale returns, and invoicing.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Real-time stock, warehouses, transfers, and item ledgers for spare parts.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Vouchers, ledgers, receivables, payables, and financial statements.',
      },
    ],
    vouchersReports: {
      heading: 'Auto parts operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: AUTO_PARTS_TABS,
    },
    whyChoose: { ...data.whyChoose, points: [] },
    realtimeReports: { ...data.realtimeReports, bullets: [] },
    implementation: [],
    related: [],
    seoBlocks: [],
    faqs: [],
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for auto parts business software on DigitalManager.',
    },
  }
}
