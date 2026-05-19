import type {
  SoftwareDetailPageData,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
  SoftwareTabBlock,
} from './types'

function retailTab(problem: string, solution: string, transactions: string[], reports: string[]): SoftwareNamedItem[] {
  return [
    { name: 'Problem', description: problem },
    { name: 'Solution', description: solution },
    { name: 'Transactions', description: transactions.join(' • ') },
    { name: 'Reports', description: reports.join(' • ') },
  ]
}

function featuresTab(problem: string, solution: string, features: string[], reports: string): SoftwareNamedItem[] {
  return [
    { name: 'Problem', description: problem },
    { name: 'Solution', description: solution },
    { name: 'Features', description: features.join(' • ') },
    { name: 'Reports', description: reports },
  ]
}

const ELECTRONICS_TRUST = [
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

const COMPUTER_LAPTOP_TABS: SoftwareTabBlock[] = [
  {
    id: 'cl-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Computer and laptop retailers often struggle with supplier coordination, purchase tracking, warranty management, and inventory balancing.',
      'Our Purchase Management Module simplifies procurement operations with supplier tracking, purchase invoices, returns, and purchase reporting.',
      ['Supplier Registration', 'Purchase Order', 'Purchase Invoice', 'Purchase Return'],
      [
        'Purchase Order Report',
        'Pending Purchase Order Report',
        'Purchase Report',
        'Purchase Summary Report',
        'Purchase Return Report',
        'Purchase Return Summary Report',
      ],
    ),
  },
  {
    id: 'cl-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing computer and laptop sales manually can create invoicing delays, customer tracking issues, and pricing inconsistencies.',
      'Our Sales Management System enables quick billing, barcode sales, quotation handling, customer history tracking, and sale return management.',
      [
        'Customer Registration',
        'Salesman Registration',
        'Sale Order',
        'Sale Invoice',
        'Cash Sale Invoice',
        'Sale Return',
        'Multi Invoice Printing',
        'Update Item Rate List',
      ],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Sale Report',
        'Sale Summary Report',
        'Sale Return Report',
        'Cash Sale Report',
        'Monthly Sale Comparison',
        'Sale Return Summary Report',
      ],
    ),
  },
  {
    id: 'cl-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Computer retailers need proper inventory tracking for accessories, laptops, desktops, printers, and spare parts.',
      'Our Inventory Management Module tracks stock movement, item availability, warehouse management, stock adjustment, and serial/item monitoring.',
      [
        'Chart of Items',
        'Warehouse Registration',
        'Transporter Registration',
        'Opening Stock',
        'Transfer Stock',
        'Assemble And Disassemble',
        'Stock Adjustment',
      ],
      [
        'Opening Stock Report',
        'Chart Of Item List',
        'Item Ledger Report',
        'Transfer Stock Report',
        'Inventory Summary Report',
        'Stock Report',
        'Stock Value Report',
        'Low Stock Report',
      ],
    ),
  },
  {
    id: 'cl-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Managing accounts manually for computer retail businesses can create payment tracking and reporting difficulties.',
      'Our Accounts Management Module provides complete accounting control with vouchers, ledgers, bank/cash management, receivables, payables, and financial reports.',
      [
        'Cash And Bank Registration',
        'Expense Registration',
        'Income Registration',
        'General Accounts Registration',
        'Account Level Registration',
        'Opening Balance',
        'Cash Payment',
        'Cash Receipt',
        'Bank Payment',
        'Bank Receipt',
        'Expense Voucher',
        'Journal Voucher',
      ],
      [
        'Opening Balance',
        'Account Ledger',
        'Bank Receipt Report',
        'Bank Payment Report',
        'Cash Payment Report',
        'Cash Receipt Report',
        'Expense Report',
        'Journal Voucher Report',
        'Day Book Report',
        'Cash Flow Report',
        'Bank Balance Report',
        'Payable Report',
        'Receivable Report',
        'Invoice Aging Report',
        'Debtor Aging Sheet',
        'Creditor Aging Sheet',
        'Trial Balance Report',
        'Item Wise Profit & Loss',
        'Profit & Loss Sheet',
        'Balance Sheet',
        'Chart Of Accounts',
      ],
    ),
  },
]

const ELECTRONICS_STORE_TABS: SoftwareTabBlock[] = [
  {
    id: 'elec-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Electronics businesses require accurate supplier coordination, product purchasing, and stock tracking to avoid overstocking and shortages.',
      'Our Electronics Purchase Management System streamlines vendor handling, purchase invoices, returns, and procurement reporting.',
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
    id: 'elec-sales',
    title: 'Sales Management',
    items: retailTab(
      'Handling electronics sales manually can lead to billing errors, warranty confusion, and customer dissatisfaction.',
      'Our Sales Management System enables barcode billing, sale returns, invoice printing, customer handling, and dealer management.',
      [
        'Add New Customers',
        'Sale Order Voucher',
        'Sale Order Selection Voucher',
        'Sale Voucher',
        'Multi Sale Voucher Print',
        'Sale Return Voucher',
      ],
      [
        'Customer List',
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
    id: 'elec-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Electronics stores require detailed inventory control for gadgets, appliances, accessories, and spare parts.',
      'Our Inventory Module tracks item movement, warehouse stock, goods receipt, stock transfer, and inventory valuation.',
      [
        'Chart Of Items',
        'Freight Assigning To Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN Goods Received Note',
        'Return Outward Voucher',
        'GRN Goods Issue Note',
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
    id: 'elec-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Electronics businesses require strong financial monitoring for sales, supplier payments, and installment tracking.',
      'Our Accounts Module manages cash flow, bank accounts, vouchers, receivables, payables, and complete financial reporting.',
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

const ELECTRIC_STORE_TABS: SoftwareTabBlock[] = [
  {
    id: 'electric-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Electric stores struggle with multiple suppliers for wiring, switches, lighting, and hardware — manual purchase tracking causes stock gaps and billing mismatches.',
      'Our Purchase Management System helps electric retailers manage supplier purchases, invoices, returns, and procurement reports for wiring, switchgear, and electrical inventory.',
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
    id: 'electric-sales',
    title: 'Sales Management',
    items: retailTab(
      'Counter sales for cables, switches, and fittings need fast billing, contractor rates, and accurate customer ledgers — manual invoicing slows the shop floor.',
      'Digitize electric store sales with barcode billing, contractor and retail pricing, sale orders, returns, and customer history for wiring and electrical hardware businesses.',
      [
        'Add New Customers',
        'Sale Order Voucher',
        'Sale Order Selection Voucher',
        'Sale Voucher',
        'Multi Sale Voucher Print',
        'Sale Return Voucher',
      ],
      [
        'Customer List',
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
    id: 'electric-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Wiring, conduits, switches, breakers, and lighting SKUs need length-wise or unit-wise stock control — spreadsheets rarely match the shop floor.',
      'Track electrical inventory with warehouses, goods receipt, transfers, item conversion for cut-length cable, and valuation reports for electric and hardware outlets.',
      [
        'Chart Of Items',
        'Freight Assigning To Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN Goods Received Note',
        'Return Outward Voucher',
        'GRN Goods Issue Note',
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
    id: 'electric-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Electric retailers juggle contractor credit, cash counter sales, and supplier payables — manual books make month-end reconciliation painful.',
      'Complete accounts control for electric stores with vouchers, ledgers, banking, receivables, payables, and financial statements aligned to trade-counter reality.',
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

const MOBILE_ACCESSORIES_TABS: SoftwareTabBlock[] = [
  {
    id: 'mobile-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Mobile accessory shops handle high-SKU mixes from many suppliers — manual purchase tracking leads to dead stock and missed reorders.',
      'Streamline procurement for chargers, covers, earbuds, and gadgets with supplier management, purchase invoices, returns, and purchase analytics.',
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
    id: 'mobile-sales',
    title: 'Sales Management',
    items: retailTab(
      'Fast-moving accessory counters need quick barcode billing and consistent pricing — manual sales slow queues and lose margin on bundles.',
      'Barcode billing, sale orders, multi-invoice printing, returns, and customer history built for mobile retail and gadget stores.',
      [
        'Add New Customers',
        'Sale Order Voucher',
        'Sale Order Selection Voucher',
        'Sale Voucher',
        'Multi Sale Voucher Print',
        'Sale Return Voucher',
      ],
      [
        'Customer List',
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
    id: 'mobile-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Thousands of SKUs — cases, cables, protectors, power banks — need warehouse discipline and fast stock lookups at the counter.',
      'Track accessory inventory with GRN, transfers, item conversion, stock reports, and low-stock signals for mobile shops and retailers.',
      [
        'Chart Of Items',
        'Freight Assigning To Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN Goods Received Note',
        'Return Outward Voucher',
        'GRN Goods Issue Note',
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
    id: 'mobile-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Mobile retailers need tight cash control, supplier payments, and customer credit on accessories sold on account.',
      'Financial control with vouchers, ledgers, cash flow, receivables, payables, and profit analysis for accessory and mobile retail businesses.',
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
        'Day Book',
        'Cash Flow Management',
        'Expense Report',
        'Payable Report',
        'Receivable Report',
        'Trial Balance 2 Column',
        'Trial Balance 6 Column',
        'Profit & Loss Sheet',
        'Balance Sheet',
      ],
    ),
  },
]

const EV_CHARGING_TABS: SoftwareTabBlock[] = [
  {
    id: 'ev-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Managing charging equipment procurement, spare parts inventory, and vendor coordination manually can create operational inefficiencies.',
      'Our EV Charging Purchase Management Module simplifies vendor management, purchase tracking, equipment handling, and inventory replenishment.',
      [
        'Purchase Order Voucher',
        'Purchase Invoice Voucher',
        'Charger & Spare Parts Receipt',
        'Purchase Return Voucher',
      ],
      [
        'Purchase Order Report',
        'Purchase Report',
        'Spare Parts Purchase Report',
        'Purchase Return Report',
      ],
    ),
  },
  {
    id: 'ev-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing subscriptions, charging sessions, invoices, and customer plans manually becomes difficult as operations scale.',
      'Our Sales Management System handles customer billing, subscriptions, charging invoices, usage tracking, and automated reporting.',
      [
        'Customer Subscription Plan',
        'Charging Session Invoice',
        'Prepaid Top-Up Voucher',
        'Corporate Billing Voucher',
        'Usage-Based Sale Invoice',
      ],
      [
        'Charging Revenue Report',
        'Subscription Report',
        'Session Summary Report',
        'Prepaid Balance Report',
        'Corporate Account Report',
      ],
    ),
  },
  {
    id: 'ev-station',
    title: 'Station & Billing Management',
    items: featuresTab(
      'Operators need live visibility into chargers, sessions, and tariffs across sites — disconnected tools hide revenue leakage and downtime.',
      'Monitor charging sessions, manage customer accounts, track payments, monitor station performance, and optimize energy operations through a secure cloud-based platform.',
      [
        'Charging Session Monitoring',
        'Station Performance Dashboard',
        'Tariff & Rate Management',
        'Multi-Station Billing',
        'Energy Usage Tracking',
        'Payment Collection & Settlement',
      ],
      'Station uptime, session throughput, and revenue-by-site reports — as configured for your network.',
    ),
  },
  {
    id: 'ev-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Charging station operators require inventory control for chargers, cables, electrical components, and maintenance items.',
      'Our Inventory Module enables stock tracking, warehouse handling, item movement, and maintenance inventory control.',
      [
        'Chart of Items',
        'Warehouse Definition',
        'Cable & Connector Stock',
        'Maintenance Spares Issue',
        'Stock Transfer Voucher',
        'Stock Adjustment Voucher',
      ],
      ['Stock Report', 'Maintenance Inventory Report', 'Stock Value Report', 'Item Ledger Report'],
    ),
  },
  {
    id: 'ev-crm',
    title: 'Customer Relationship Management',
    items: featuresTab(
      'Managing EV customers, loyalty plans, subscriptions, and charging history manually reduces service quality.',
      'Our CRM Module helps manage customer profiles, charging records, subscriptions, notifications, loyalty programs, and service interactions.',
      [
        'Customer Profiles',
        'Charging History',
        'Subscription & Loyalty Plans',
        'Automated Notifications',
        'Service Ticket Tracking',
        'Fleet & Corporate Account Management',
      ],
      'Customer activity, subscription ageing, and loyalty redemption summaries — as configured.',
    ),
  },
  {
    id: 'ev-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Financial management across charging stations, energy usage, invoices, and expenses requires proper accounting integration.',
      'Our Accounts Management Module provides complete financial control including vouchers, ledgers, receivables, payables, and profitability reports.',
      [
        'Opening Balance Voucher',
        'Cash Payment Voucher',
        'Cash Receipt Voucher',
        'Bank Payment Voucher',
        'Bank Receipt Voucher',
        'Journal Entry Voucher',
      ],
      [
        'Account Ledger',
        'Cash Flow Management',
        'Expense Report',
        'Receivable Report',
        'Payable Report',
        'Trial Balance',
        'Profit & Loss Statement',
        'Balance Sheet',
      ],
    ),
  },
]

function mergeElectronicsBase(
  data: SoftwareDetailPageData,
  config: {
    metaTitle: string
    metaDescription: string
    featuresHeading: string
    featuresLead: string
    vouchersSectionEyebrow: string
    challengesHeading: string
    challengesIntro: string
    solutionParagraphs: string[]
    heroAsideCaption: string
    headline: string
    subhead: string
    intro: string
    features: SoftwareDetailPageData['features']
    tabs: SoftwareTabBlock[]
    vouchersHeading: string
    vouchersSubheading: string
    demoSub: string
  },
): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: config.featuresHeading,
    featuresLead: config.featuresLead,
    vouchersSectionEyebrow: config.vouchersSectionEyebrow,
    challengesHeading: config.challengesHeading,
    challengesIntro: config.challengesIntro,
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Operations on one platform',
    solutionParagraphs: config.solutionParagraphs,
    heroAsideCaption: config.heroAsideCaption,
  }

  return {
    ...data,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    premiumLayout,
    hero: {
      ...data.hero,
      headline: config.headline,
      subhead: config.subhead,
      intro: config.intro,
      trust: [...ELECTRONICS_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: config.features,
    vouchersReports: {
      heading: config.vouchersHeading,
      subheading: config.vouchersSubheading,
      tabs: config.tabs,
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
      sub: config.demoSub,
    },
  }
}

const FOUR_FEATURE_CARDS = [
  { icon: 'ShoppingCart', title: 'Purchase Management', description: 'Suppliers, purchase orders, invoices, returns, and procurement reporting.' },
  { icon: 'Store', title: 'Sales Management', description: 'Billing, customers, sale orders, returns, and sales analytics.' },
  { icon: 'Package', title: 'Inventory Management', description: 'Stock movement, warehouses, transfers, and inventory valuation.' },
  { icon: 'Landmark', title: 'Accounts Management', description: 'Ledgers, vouchers, banking, receivables, payables, and financial statements.' },
] as const

export function mergeComputersLaptopIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  return mergeElectronicsBase(data, {
    metaTitle: 'Computer & Laptop Retailer Software | DigitalManager ERP',
    metaDescription:
      'Manage sales, track inventory, grow your tech business — ERP for computer shops, laptop retailers, and electronics dealers in Pakistan.',
    featuresHeading: 'Software Features',
    featuresLead: 'Purchase, sales, inventory, and accounts — built for computer and laptop retailers with serial and warranty discipline.',
    vouchersSectionEyebrow: 'Computer & laptop retail',
    challengesHeading: 'Why computer retailers choose DigitalManager',
    challengesIntro:
      'Warranties, serials, and fast SKU turnover need one spine—not counters reconciled against spreadsheets every night.',
    solutionParagraphs: [
      'An all-in-one business solution built for computer shops, laptop retailers, and electronics dealers — inventory, invoicing, warranty tracking, and customer history in one cloud-powered system.',
    ],
    heroAsideCaption: 'Computer and laptop retail with purchase, sales, stock, and accounts on DigitalManager.',
    headline: 'Cloud-Based Business Management Software for Computer & Laptop Retailers',
    subhead: 'Manage Sales. Track Inventory. Grow Your Tech Business.',
    intro:
      'An all-in-one business solution built for computer shops, laptop retailers, and electronics dealers. From inventory and invoicing to warranty tracking and customer history — everything you need to run your tech business efficiently in one cloud-powered system.',
    features: FOUR_FEATURE_CARDS.map((f) => ({ ...f })),
    tabs: COMPUTER_LAPTOP_TABS,
    vouchersHeading: 'Computer & laptop operations by area',
    vouchersSubheading:
      'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
    demoSub:
      'Share your email and contact number — we will respond with a tailored walkthrough or quotation for computer and laptop retail on DigitalManager.',
  })
}

export function mergeElectronicsManagementIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  return mergeElectronicsBase(data, {
    metaTitle: 'Electronics Store Management Software | DigitalManager ERP',
    metaDescription:
      'Manage inventory, track sales, deliver better service — cloud ERP for electronics shops, gadget retailers, and appliance dealers.',
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, sales, inventory, and accounts — integrated cloud retail for electronics and appliance dealers.',
    vouchersSectionEyebrow: 'Electronics store',
    challengesHeading: 'Why electronics retailers choose DigitalManager',
    challengesIntro:
      'Gadget mix, warranties, and supplier terms need disciplined stock and billing—without duplicate entry between counter and finance.',
    solutionParagraphs: [
      'A specialized solution for electronics shops, gadget retailers, and appliance dealers — product categorization, barcode billing, warranty handling, and supplier management in one integrated cloud-based platform.',
    ],
    heroAsideCaption: 'Electronics retail with purchase, sales, stock, and accounts on DigitalManager.',
    headline: 'Cloud-Based Electronics Store Management Software That Powers Smart Retailing',
    subhead: 'Manage Inventory. Track Sales. Deliver Better Service.',
    intro:
      'A specialized solution for electronics shops, gadget retailers, and appliance dealers. From product categorization and barcode billing to customer warranty handling and supplier management — everything in one integrated cloud-based platform.',
    features: FOUR_FEATURE_CARDS.map((f) => ({ ...f })),
    tabs: ELECTRONICS_STORE_TABS,
    vouchersHeading: 'Electronics store operations by area',
    vouchersSubheading:
      'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
    demoSub:
      'Share your email and contact number — we will respond with a tailored walkthrough or quotation for electronics store management on DigitalManager.',
  })
}

export function mergeElectricStoreIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  return mergeElectronicsBase(data, {
    metaTitle: 'Electric Store Management Software | DigitalManager ERP',
    metaDescription:
      'Simplify sales, track inventory, manage suppliers — cloud ERP for electric stores, wiring suppliers, switch dealers, and electrical hardware.',
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, sales, inventory, and accounts — built for electric stores, wiring suppliers, switchgear, and lighting retailers.',
    vouchersSectionEyebrow: 'Electric store',
    challengesHeading: 'Why electric retailers choose DigitalManager',
    challengesIntro:
      'Cables, switches, and contractor credit need fast counters and accurate stock—without manual registers at month-end.',
    solutionParagraphs: [
      'An all-in-one business solution designed for electric stores, wiring and lighting suppliers, switch dealers, and hardware shops — stock, supplier purchases, and customer orders through one smart cloud-based platform.',
    ],
    heroAsideCaption: 'Electric store ERP with purchase, sales, stock, and accounts on DigitalManager.',
    headline: 'Cloud-Based Electric Store Management Software Built for Efficiency & Control',
    subhead: 'Simplify Sales. Track Inventory. Manage Suppliers.',
    intro:
      'An all-in-one business solution designed for electric stores, wiring and lighting suppliers, switch dealers, and hardware shops. Manage stock levels, record supplier purchases, and handle customer orders — all through one smart cloud-based platform.',
    features: FOUR_FEATURE_CARDS.map((f) => ({ ...f })),
    tabs: ELECTRIC_STORE_TABS,
    vouchersHeading: 'Electric store operations by area',
    vouchersSubheading:
      'Purchase, sales, inventory, and accounts — tailored for wiring, switchgear, and electrical hardware businesses.',
    demoSub:
      'Share your email and contact number — we will respond with a tailored walkthrough or quotation for electric store management on DigitalManager.',
  })
}

export function mergeMobileAccessoriesIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  return mergeElectronicsBase(data, {
    metaTitle: 'Mobile Accessories Business Software | DigitalManager ERP',
    metaDescription:
      'Track stock, simplify billing, maximize profits — ERP for mobile accessories shops, gadget stores, and fast-moving SKU retail.',
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, sales, inventory, accounts, and CRM — built for mobile accessories and gadget retailers.',
    vouchersSectionEyebrow: 'Mobile accessories',
    challengesHeading: 'Why mobile retailers choose DigitalManager',
    challengesIntro:
      'High SKU counts and bundle pricing need barcode speed and stock truth—without reconciling accessories in spreadsheets.',
    solutionParagraphs: [
      'A powerful solution for mobile accessories shops, mobile retailers, and gadget stores — manage thousands of SKUs, barcode sales, chargers, covers, earbuds, and accessories with complete inventory and sales control.',
    ],
    heroAsideCaption: 'Mobile accessories retail with stock, billing, CRM, and accounts on DigitalManager.',
    headline: 'Cloud-Based Mobile Accessories Business Software for Fast-Moving Retail',
    subhead: 'Track Stock. Simplify Billing. Maximize Profits.',
    intro:
      'A powerful solution for mobile accessories shops, mobile retailers, and gadget stores. Manage thousands of SKUs, barcode sales, chargers, covers, earbuds, and accessories with complete inventory and sales control.',
    features: [
      ...FOUR_FEATURE_CARDS.map((f) => ({ ...f })),
      {
        icon: 'Users',
        title: 'Customer Relationship Management (CRM)',
        description: 'Customer history, follow-ups, and loyalty aligned to fast-moving accessory sales.',
      },
    ],
    tabs: MOBILE_ACCESSORIES_TABS,
    vouchersHeading: 'Mobile accessories operations by area',
    vouchersSubheading:
      'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
    demoSub:
      'Share your email and contact number — we will respond with a tailored walkthrough or quotation for mobile accessories business on DigitalManager.',
  })
}

export function mergeEvChargingIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  return mergeElectronicsBase(data, {
    metaTitle: 'EV Charging Station Management Software | DigitalManager ERP',
    metaDescription:
      'Monitor usage, manage stations, increase revenue — cloud ERP for EV charging operators with billing, CRM, inventory, and accounts.',
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, sales, station billing, inventory, CRM, and accounts — smart energy management for EV charging networks.',
    vouchersSectionEyebrow: 'EV charging',
    challengesHeading: 'Why EV operators choose DigitalManager',
    challengesIntro:
      'Sessions, subscriptions, and site performance need one governed dataset—not billing disconnected from maintenance stock and finance.',
    solutionParagraphs: [
      'A modern ERP solution for EV charging station operators — monitor charging sessions, manage customer accounts, track payments, monitor station performance, and optimize energy operations through a secure cloud-based platform.',
    ],
    heroAsideCaption: 'EV charging ERP with stations, billing, CRM, stock, and accounts on DigitalManager.',
    headline: 'Cloud-Based Electric Vehicle Charging Station Software That Powers Smart Energy Management',
    subhead: 'Monitor Usage. Manage Stations. Increase Revenue.',
    intro:
      'A modern ERP solution for EV charging station operators. Monitor charging sessions, manage customer accounts, track payments, monitor station performance, and optimize energy operations through a secure cloud-based platform.',
    features: [
      { icon: 'ShoppingCart', title: 'Purchase Management', description: 'Equipment and spare parts procurement with vendor tracking.' },
      { icon: 'Store', title: 'Sales Management', description: 'Subscriptions, session billing, prepaid plans, and usage invoices.' },
      { icon: 'Zap', title: 'Station & Billing Management', description: 'Sessions, tariffs, multi-site billing, and performance monitoring.' },
      { icon: 'Package', title: 'Inventory Management', description: 'Chargers, cables, components, and maintenance spares.' },
      { icon: 'Users', title: 'Customer Relationship Management', description: 'Profiles, charging history, loyalty, and notifications.' },
      { icon: 'Landmark', title: 'Accounts Management', description: 'Ledgers, receivables, payables, and profitability reporting.' },
    ],
    tabs: EV_CHARGING_TABS,
    vouchersHeading: 'EV charging operations by area',
    vouchersSubheading:
      'Six programme areas — purchase through accounts — with challenges, solutions, and representative flows, features, and reports.',
    demoSub:
      'Share your email and contact number — we will respond with a tailored walkthrough or quotation for EV charging station management on DigitalManager.',
  })
}
