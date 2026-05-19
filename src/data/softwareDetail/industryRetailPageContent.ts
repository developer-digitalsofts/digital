import type {
  SoftwareDetailPageData,
  SoftwareFaqItem,
  SoftwareImplementationStep,
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

/** Third row label Features vs Transactions for tabs that list product features instead of vouchers. */
function farmDetailTab(
  problem: string,
  solution: string,
  thirdTitle: 'Transactions' | 'Features' | 'Modules',
  thirdItems: string[],
  reports: string[],
): SoftwareNamedItem[] {
  return [
    { name: 'Problem', description: problem },
    { name: 'Solution', description: solution },
    { name: thirdTitle, description: thirdItems.join(' • ') },
    { name: 'Reports', description: reports.join(' • ') },
  ]
}

const GROCERY_TRUST = [
  { value: '2000+', label: 'Happy Clients', icon: 'Users' },
  { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
  { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
  { value: '20+', label: 'Years of Experience', icon: 'Clock' },
] as const

const GROCERY_TABS: SoftwareTabBlock[] = [
  {
    id: 'grocery-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Grocery stores face issues in purchase tracking, supplier handling, purchase invoices, returns, and stock availability.',
      'Our Grocery Store Purchase Management helps manage purchase orders, invoices, supplier records, purchase returns, and procurement tracking.',
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
    id: 'grocery-sales',
    title: 'Sales Management',
    items: retailTab(
      'Grocery sales need fast billing, accurate rates, discounts, customer handling, and real-time stock updates.',
      'Our Grocery Store Sales Management supports counter billing, customer sales, sale returns, and sales reporting.',
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
        'Salesman Sale Summary',
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
    id: 'grocery-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Inventory errors can cause overstocking, shortages, expiry losses, and poor shelf management.',
      'Our Inventory Management System helps grocery businesses manage stock, warehouses, expiry, transfers, and item conversion.',
      [
        'Chart of Items',
        'Freight Assigning to Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN / Goods Received Note / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'Purchase / Outward Gate Pass Voucher',
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
    id: 'grocery-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Grocery businesses need proper control over payments, receipts, expenses, payables, receivables, and cash flow.',
      'Our Accounts Management System keeps financial transactions organized with ledgers, vouchers, banking, and reports.',
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
        'Cheque in Hand Report',
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

const TOY_TRUST = [
  { value: '20+', label: 'Years of Experience', icon: 'Clock' },
  { value: '2000+', label: 'Happy Clients', icon: 'Users' },
  { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
  { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
] as const

const TOY_TABS: SoftwareTabBlock[] = [
  {
    id: 'toy-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Toy shop purchasing becomes difficult when supplier information, purchase orders, invoices, and inventory levels are not properly managed.',
      'Our Purchase Module helps streamline procurement and purchase processes for toy shop businesses.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Report',
        'Purchase Report',
        'Purchase Summary Report',
        'Purchase Register',
        'Purchase Comparison',
        'Purchase Return Report',
        'Purchase Return Summary',
        'Purchase Return Register',
        'Purchase Return Comparison',
      ],
    ),
  },
  {
    id: 'toy-sales',
    title: 'Sales Management',
    items: retailTab(
      'Toy shop sales require fast billing, customer handling, pricing control, and accurate sales records.',
      'Our Sales Module manages sale orders, credit sales, cash sales, returns, and sales reporting.',
      ['Customer Definition', 'Sale Order Voucher', 'Credit Sale Voucher', 'Sale Return Voucher', 'Cash Sale Voucher'],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Credit Sale Report',
        'Credit Sale Summary Report',
        'Credit Sale Register Report',
        'Salesman Wise Commission Report',
        'Salesman Commission Report',
        'Salesman Performance Report',
        'Cash Sale Report',
        'Cash Sale Summary Report',
        'Net Sale Report',
        'Sale Return Report',
        'Sale Return Register',
        'Sale Return Comparison Report',
      ],
    ),
  },
  {
    id: 'toy-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Toy shop inventory needs proper control of stock levels, warehouses, product movement, and stock adjustment.',
      'Our Inventory Module helps optimize and streamline inventory management for toy shop businesses.',
      [
        'Chart of Item Definition',
        'Warehouse Definition',
        'Opening Stock Voucher',
        'Stock Adjustment Voucher',
        'Stock Navigation / Transfer Voucher',
        'Assemble / De-Assemble Voucher',
      ],
      [
        'Minimum and Maximum Stock Level Report',
        'Product Ledger Report',
        'Inventory Summary Report',
        'Stock Report',
        'Stock Value Report',
        'Stock Navigation Report',
        'Stock Adjustment Report',
      ],
    ),
  },
  {
    id: 'toy-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Toy shop businesses need organized accounting to control payments, receipts, expenses, profit, and financial reporting.',
      'Our Accounts Module integrates accounting with business operations to maintain clear financial control.',
      [
        'General Accounts Definition',
        'Other Income Definition',
        'Cash & Bank Definition',
        'Expense Definition',
        'Opening Balance Definition',
        'Cash Payment Voucher',
        'Bank Payment Voucher',
        'Bank Receipt Voucher',
        'Cheque Payment Voucher',
        'Debit Note',
        'Credit Note',
        'Journal Entry Voucher',
      ],
      [
        'Cash Received / Payment Reports',
        'Day Book',
        'Accounts Ledger Report',
        'Trial Balance 2 & 6 Columns',
        'Profit & Loss Report',
        'Profit & Loss Sheet',
        'Balance Sheet Statement',
      ],
    ),
  },
]

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

export function mergeGroceryStoreIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead: 'Purchase, sales, inventory, and accounts management — unified for fast grocery billing and accurate stock.',
    vouchersSectionEyebrow: 'Grocery retail programme',
    challengesHeading: 'Why grocery retailers choose DigitalManager',
    challengesIntro:
      'High-volume counters, perishable stock, and tight cash control need ERP discipline—not spreadsheets reconciled after close.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'One platform for the aisle and finance',
    solutionParagraphs: [
      'Barcode billing, expiry-aware stock, supplier purchases, and accounts stay on one timeline so managers see margin and availability before the day ends.',
    ],
    heroAsideCaption: 'Cloud grocery retail with fast lanes, procurement control, and finance-grade reporting.',
  }

  return {
    ...data,
    metaTitle: 'Grocery Store Management Software | DigitalManager ERP',
    metaDescription:
      'Save items, track expiry, delight shoppers — inventory, barcode billing, purchases, sales, and accounts for grocery stores on one cloud platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Grocery Store Management Software for Fast Billing & Accurate Inventory',
      subhead: 'Save Items. Track Expiry. Delight Shoppers.',
      intro:
        'Run your grocery store with speed and accuracy using our all-in-one cloud-based management system.\n\nEasily manage inventory, barcode billing, supplier purchases, sales, stock levels, product expiry, customer records, and accounts from one platform.',
      trust: [...GROCERY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Orders, invoices, returns, and supplier visibility tied to stock and payables.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Counter billing, customers, returns, and sales reporting with real-time stock impact.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Items, warehouses, expiry, transfers, and conversions aligned to shelf reality.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Vouchers, banking, receivables, payables, and financial statements in one ledger.',
      },
    ],
    vouchersReports: {
      heading: 'Grocery store operations by area',
      subheading:
        'Review purchase, sales, inventory, and accounts depth — each tab lists the problem we address, the solution posture, and representative transactions and reports.',
      tabs: GROCERY_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for grocery store management on DigitalManager.',
    },
  }
}

export function mergeToyShopIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead: 'Purchase, sales, inventory, and accounts — automated for toy shop operations and clearer financial control.',
    vouchersSectionEyebrow: 'Toy shop programme',
    challengesHeading: 'Why toy retailers choose DigitalManager',
    challengesIntro:
      'Seasonal peaks, varied SKUs, and promotional cycles need disciplined buying, selling, and stock—without shadow ledgers.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Grow with structured retail ERP',
    solutionParagraphs: [
      'Digital Manager Toy Shop Management Software helps manage and automate daily operations—purchase, sale, inventory control, and accounting—so teams spend less time reconciling and more time serving customers.',
    ],
    heroAsideCaption: 'Toy shop ERP with purchase, sale, stock, and accounts on one governed spine.',
  }

  return {
    ...data,
    metaTitle: 'Toy Shop Management Software | DigitalManager ERP',
    metaDescription:
      'Cloud ERP for toy shops — automate purchase, sale, inventory, and accounting for efficient operations and better business growth.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based ERP Software for Toy Shop',
      subhead: 'Purchase, sale, inventory, and accounting — automated for efficient growth.',
      intro:
        'Digital Manager Toy Shop Management Software helps manage and automate daily business operations like purchase, sale, inventory control, and accounting in an efficient way for better business growth.',
      trust: [...TOY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Streamlined procurement with orders, invoices, returns, and supplier tracking.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Fast billing, pricing control, customer records, and sales reporting.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Stock levels, warehouses, movement, and adjustments under one item master.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Payments, receipts, expenses, and financial statements integrated with operations.',
      },
    ],
    vouchersReports: {
      heading: 'Toy shop operations by area',
      subheading:
        'Each tab summarises purchase, sales, inventory, or accounts — with problems, solutions, and representative transactions and reports.',
      tabs: TOY_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for toy shop management on DigitalManager.',
    },
  }
}

const HW_TRUST = [
  { value: '20+', label: 'Years of Experience', icon: 'Clock' },
  { value: '2000+', label: 'Happy Clients', icon: 'Users' },
  { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
  { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
] as const

const HARDWARE_TABS: SoftwareTabBlock[] = [
  {
    id: 'hw-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Hardware and sanitary businesses often face supplier tracking issues, delayed purchases, inventory shortages, and procurement inefficiencies.',
      'Our Purchase Management System helps streamline supplier handling, purchase invoices, returns, and procurement workflows.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Report',
        'Purchase Report',
        'Purchase Summary Report',
        'Purchase Register',
        'Purchase Comparison',
        'Purchase Return Report',
        'Purchase Return Summary',
        'Purchase Return Register',
        'Purchase Return Comparison',
      ],
    ),
  },
  {
    id: 'hw-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing sales in sanitary and hardware stores requires accurate pricing, customer handling, stock control, and invoice management.',
      'Our Sales Management System handles counter sales, customer management, sale returns, and sales analytics efficiently.',
      ['Customer Definition', 'Sale Order Voucher', 'Credit Sale Voucher', 'Sale Return Voucher', 'Cash Sale Voucher'],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Credit Sale Report',
        'Credit Sale Summary Report',
        'Credit Sale Register Report',
        'Salesman Wise Commission Report',
        'Salesman Commission Report',
        'Salesman Performance Report',
        'Cash Sale Report',
        'Cash Sale Summary Report',
        'Net Sale Report',
        'Sale Return Report',
        'Sale Return Register',
        'Sale Return Comparison Report',
      ],
    ),
  },
  {
    id: 'hw-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Inventory mismanagement causes stock shortages, inaccurate stock records, delayed deliveries, and warehouse confusion.',
      'Our Inventory Management System provides warehouse handling, stock movement tracking, item conversion, and stock adjustment features.',
      [
        'Chart of Item Definition',
        'Warehouse Definition',
        'Opening Stock Voucher',
        'Stock Adjustment Voucher',
        'Stock Navigation / Transfer Voucher',
        'Assemble / De-Assemble Voucher',
      ],
      [
        'Minimum and Maximum Stock Level Report',
        'Product Ledger Report',
        'Inventory Summary Report',
        'Stock Report',
        'Stock Value Report',
        'Stock Navigation Report',
        'Stock Adjustment Report',
      ],
    ),
  },
  {
    id: 'hw-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Manual accounting creates errors in payments, receipts, banking, and financial reporting for hardware businesses.',
      'Our Accounts Management System manages ledgers, vouchers, banking, receivables, payables, and financial reporting.',
      [
        'General Accounts Definition',
        'Other Income Definition',
        'Cash & Banks Definition',
        'Expense Definition',
        'Opening Balance Definition',
        'Cash Payment Voucher',
        'Bank Payment Voucher',
        'Bank Receipt Voucher',
        'Cheque Payment Voucher',
        'Debit Note',
        'Credit Note',
        'Journal Entry Voucher',
      ],
      [
        'Cash Received / Payment Reports',
        'Post Dated Cheque Reports',
        'Day Book',
        'Invoice Aging Report',
        'Accounts Ledger Report',
        'Trial Balance 2 & 6 Columns',
        'Profit & Loss Report',
        'Profit & Loss Sheet',
        'Balance Sheet Statement',
      ],
    ),
  },
]

const LUGGAGE_TABS: SoftwareTabBlock[] = [
  {
    id: 'lug-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Luggage and bags stores often face supplier management issues, delayed purchases, and inventory shortages.',
      'Our Purchase Management Module simplifies procurement, supplier communication, and purchase tracking.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      ['Purchase Order Report', 'Pending Purchase Order Report', 'Purchase Report', 'Purchase Return Report'],
    ),
  },
  {
    id: 'lug-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual sales handling causes slow billing, customer dissatisfaction, inaccurate records, and missed sales opportunities.',
      'Our Sales Management System supports customer billing, sale orders, returns, customer records, and sales analysis.',
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
        'Assign Sale To Party',
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
    id: 'lug-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Luggage businesses require accurate stock tracking, warehouse handling, item conversion, and inventory visibility.',
      'Our Inventory Management System helps maintain proper stock control and inventory movement.',
      [
        'Chart of Items',
        'Freight Assigning to Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN / Goods Received Note / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'Purchase / Outward Gate Pass Voucher',
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
    id: 'lug-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Luggage businesses need organized accounting for payments, receipts, banking, and financial management.',
      'Our Accounts Management System provides complete financial control with ledgers, vouchers, cash flow, and reporting.',
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

const LUGGAGE_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map your luggage and bags categories, pricing, warehouse layout, and accounts structure so DigitalManager fits trade-counter and showroom reality.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Role-based training for cashiers, warehouse staff, and finance on purchases, sales, stock moves, and reporting before peak seasons.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Tenant setup, item and price imports, voucher templates, and sandbox validation before live sales and stock traffic.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing help for configuration, integrations, and troubleshooting so new collections and branches stay smooth after go-live.',
  },
]

export function mergeHardwareSanitaryIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, sales, inventory, and accounts management and information — built for hardware, sanitary, and trade-counter retail.',
    vouchersSectionEyebrow: 'Hardware & sanitary retail',
    challengesHeading: 'Why hardware & sanitary stores choose DigitalManager',
    challengesIntro:
      'Mixed SKUs, project-style sales, and tight working capital need disciplined procurement, stock, and ledger control—not disconnected spreadsheets.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'One cloud spine for the trade counter and finance',
    solutionParagraphs: [
      'Process transactions, manage inventory, handle supplier purchases, and serve customers from one platform so branches and head office agree on margin and availability.',
    ],
    heroAsideCaption: 'Hardware and sanitary retail with purchase, sales, stock, and accounts on one DigitalManager programme.',
  }

  return {
    ...data,
    metaTitle: 'Hardware & Sanitary Store Software | DigitalManager ERP',
    metaDescription:
      'Elevate hardware and sanitary retail — transactions, inventory, supplier purchases, and customer service on one smart cloud platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based Hardware & Sanitary Store Software',
      subhead: 'Trade-counter speed with inventory and accounts your finance team can trust.',
      intro:
        'Elevate your retail experience with our Hardware & Sanitary Store Software.\n\nSeamlessly process transactions, manage inventory, handle supplier purchases, and provide exceptional customer service from one smart cloud-based platform.',
      trust: [...HW_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management and Information',
        description: 'Supplier tracking, orders, invoices, returns, and procurement aligned to stock.',
      },
      {
        icon: 'Store',
        title: 'Sales Management and Information',
        description: 'Counter sales, pricing, customers, returns, and analytics with stock discipline.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management and Information',
        description: 'Warehouses, movement, adjustments, conversions, and accurate on-hand views.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management and Information',
        description: 'Ledgers, vouchers, banking, receivables, payables, and financial reporting.',
      },
    ],
    vouchersReports: {
      heading: 'Hardware & sanitary operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises the challenge, solution, and representative transactions and reports.',
      tabs: HARDWARE_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for hardware and sanitary store management on DigitalManager.',
    },
  }
}

export function mergeLuggageBagsIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead: 'Purchase, sales, inventory, and accounts — one POS-centred programme for luggage and bags retail.',
    vouchersSectionEyebrow: 'Luggage & bags retail',
    challengesHeading: 'Why luggage & bags stores choose DigitalManager',
    challengesIntro:
      'Fashion and travel goods need fast checkout, accurate stock by style and colour, and clean handover to finance—especially across branches.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Retail growth with controlled postings',
    solutionParagraphs: [
      'Digital Manager POS Software for Luggage & Bags Stores helps manage sales, purchases, inventory, customers, and accounting from one centralized platform.',
    ],
    heroAsideCaption: 'Luggage and bags retail with purchase, sale, stock, and accounts unified on DigitalManager.',
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured for luggage and bags retail rollouts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Luggage & Bags Store Software | DigitalManager ERP',
    metaDescription:
      'Cloud POS for luggage and bags — sales, purchases, inventory, customer handling, and accounting from one centralized platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based Point Of Sale Software for Luggage & Bags Store',
      subhead: 'Sales, stock, and accounts aligned for specialty luggage retail.',
      intro:
        'Digital Manager POS Software for Luggage & Bags Stores helps manage sales, purchases, inventory control, customer handling, and accounting operations from one centralized platform.',
      trust: [...HW_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Procurement, supplier communication, and purchase tracking simplified.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Billing, orders, returns, customer records, and sales analysis.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Stock control, warehouses, movement, and visibility for seasonal ranges.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Ledgers, vouchers, cash flow, and reporting for financial control.',
      },
    ],
    vouchersReports: {
      heading: 'Luggage & bags store operations by area',
      subheading:
        'Each tab covers purchase, sales, inventory, or accounts with problems, solutions, and representative transactions and reports.',
      tabs: LUGGAGE_TABS,
    },
    whyChoose: { ...data.whyChoose, points: [] },
    realtimeReports: { ...data.realtimeReports, bullets: [] },
    implementation: LUGGAGE_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: [],
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for luggage and bags store management on DigitalManager.',
    },
  }
}

const CROCKERY_TABS: SoftwareTabBlock[] = [
  {
    id: 'crock-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Crockery businesses often struggle with supplier handling, delayed purchases, stock shortages, and purchase tracking issues.',
      'Our Purchase Management Module simplifies supplier management, purchase invoices, returns, and procurement workflows.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      ['Purchase Order Report', 'Pending Purchase Report', 'Purchase Report', 'Purchase Return Report'],
    ),
  },
  {
    id: 'crock-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual sales handling causes billing delays, customer dissatisfaction, pricing errors, and poor sales tracking.',
      'Our Sales Management System improves billing efficiency, customer management, sales tracking, sale returns, and reporting accuracy.',
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
        'Assign Sale To Party',
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
    id: 'crock-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Poor inventory handling can result in overstocking, damaged items, inaccurate stock records, and warehouse confusion.',
      'Our Inventory Management System helps manage stock levels, item movement, warehouses, inward/outward stock, and inventory tracking.',
      [
        'Chart of Items',
        'Freight Assigning to Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN / Goods Received Note / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'Purchase / Outward Gate Pass Voucher',
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
    id: 'crock-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Crockery businesses require proper financial management for payments, receipts, banking, expenses, and profitability tracking.',
      'Our Accounts Management System manages ledgers, vouchers, banking transactions, receivables, payables, and financial reports efficiently.',
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
        'Cheque in Hand Report',
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

const RETAIL_TABS: SoftwareTabBlock[] = [
  {
    id: 'ret-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Retail businesses often face difficulties in supplier handling, purchase tracking, delayed deliveries, and inventory shortages.',
      'Our Purchase Management System simplifies procurement, supplier communication, purchase invoices, and purchase returns.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Report',
        'Purchase Summary Report',
        'Purchase Register',
        'Purchase Comparison',
        'Purchase Return Report',
        'Purchase Return Summary',
        'Purchase Return Register',
        'Purchase Return Comparison',
      ],
    ),
  },
  {
    id: 'ret-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing retail sales manually creates billing delays, pricing mistakes, customer handling issues, and inaccurate sales tracking.',
      'Our Sales Management System helps retailers manage billing, customer sales, sale returns, credit sales, and sales performance.',
      ['Customer Definition', 'Sale Order Voucher', 'Credit Sale Voucher', 'Sale Return Voucher', 'Cash Sale Voucher'],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Credit Sale Report',
        'Credit Sale Summary Report',
        'Credit Sale Register Report',
        'Salesman Wise Commission Report',
        'Salesman Commission Report',
        'Salesman Performance Report',
        'Cash Sale Report',
        'Cash Sale Summary Report',
        'Net Sale Report',
        'Sale Return Report',
        'Sale Return Register',
        'Sale Return Comparison Report',
      ],
    ),
  },
  {
    id: 'ret-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Retail businesses require proper inventory control to avoid stock shortages, overstocking, and inventory mismatches.',
      'Our Inventory Management System helps maintain stock levels, warehouse management, stock adjustments, and item movement tracking.',
      [
        'Chart of Item Definition',
        'Warehouse Definition',
        'Opening Stock Voucher',
        'Stock Adjustment Voucher',
        'Stock Navigation / Transfer Voucher',
        'Assemble / De-Assemble Voucher',
      ],
      [
        'Minimum and Maximum Stock Level Report',
        'Product Ledger Report',
        'Inventory Summary Report',
        'Stock Report',
        'Stock Value Report',
        'Stock Navigation Report',
        'Stock Adjustment Report',
      ],
    ),
  },
  {
    id: 'ret-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Retail stores need organized accounting systems to manage payments, receipts, expenses, receivables, and profitability.',
      'Our Accounts Management System integrates financial operations with retail workflows for complete business control.',
      [
        'General Accounts Definition',
        'Other Income Definition',
        'Cash & Banks Definition',
        'Expense Definition',
        'Opening Balance Definition',
        'Cash Payment Voucher',
        'Bank Payment Voucher',
        'Bank Receipt Voucher',
        'Cheque Payment Voucher',
        'Debit Note',
        'Credit Note',
        'Journal Entry Voucher',
      ],
      [
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

const RETAIL_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map your retail formats, tax profile, purchase and sales cycles, and branch structure so DigitalManager POS and back office match how you trade.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Training for cashiers, supervisors, buyers, and finance on billing, stock, vouchers, and reporting before high-traffic go-live.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Provisioning, master imports, price lists, register templates, and sandbox validation across stores before production cutover.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing configuration and troubleshooting after launch so promotions, catalogue changes, and seasonal peaks stay smooth.',
  },
]

const RETAIL_FAQ: SoftwareFaqItem[] = [
  {
    q: 'How does DigitalManager combine POS and retail back office?',
    a: 'Checkout, returns, and tenders post with the same item and customer masters that purchasing and accounts use—so stock, AR, and margin stay aligned without duplicate entry.',
  },
  {
    q: 'Can we support barcode billing and weighed items?',
    a: 'Yes. Barcode-driven lines, PLU or weighted items where configured, and rounding rules can be set per store policy while finance retains the detailed breakdown.',
  },
  {
    q: 'How are credit sales and limits handled?',
    a: 'Credit checks, exposure, and ageing can be enforced before release of orders or invoices, with registers and reminders that keep collections disciplined.',
  },
  {
    q: 'Does purchase integrate with inventory and payables?',
    a: 'Purchase orders, receipts, and invoices update on-hand and supplier balances in one flow so buyers and finance see the same numbers.',
  },
  {
    q: 'Can we roll out by branch or pilot store?',
    a: 'Typical programmes start with a pilot lane or branch, validate stock and billing, then expand roles and sites without re-platforming.',
  },
  {
    q: 'What reporting is available for retail owners?',
    a: 'Sales, stock, cash, and financial packs roll up by branch and category—with drill-down to vouchers where roles allow.',
  },
  {
    q: 'How long does implementation usually take?',
    a: 'Duration depends on branch count, data cleanliness, and integrations; focused single-store pilots may complete in weeks while multi-branch rollouts may phase over longer horizons.',
  },
  {
    q: 'What support exists after go-live?',
    a: 'Named support tiers, ticketing, and remote sessions help your team absorb peak trading, policy changes, and new registers after stabilisation.',
  },
]

export function mergeCrockeryStoreIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead: 'Purchase, sales, inventory, and accounts — tailored for crockery, kitchenware, and household retail.',
    vouchersSectionEyebrow: 'Crockery & kitchenware retail',
    challengesHeading: 'Why crockery stores choose DigitalManager',
    challengesIntro:
      'Fragile goods, design-led assortments, and seasonal peaks need careful stock, gentle handling in transfers, and billing that keeps pace at the counter.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Elegant inventory with easy billing',
    solutionParagraphs: [
      'Handle inventory, barcode billing, supplier purchases, sales, stock tracking, customers, and accounts from one platform built for household and crockery retailers.',
    ],
    heroAsideCaption: 'Crockery and kitchenware retail with purchase, sales, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Crockery Store Management Software | DigitalManager ERP',
    metaDescription:
      'Track designs, simplify sales, manage stock in style — barcode billing, purchases, and accounts for crockery and kitchenware stores.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Crockery Store Management Software for Elegant Inventory & Easy Billing',
      subhead: 'Track Designs. Simplify Sales. Manage Stock in Style.',
      intro:
        'Manage your crockery and kitchenware business efficiently with our advanced cloud-based store management system.\n\nHandle inventory, barcode billing, supplier purchases, sales, stock tracking, customer records, and accounts from one centralized platform designed for crockery and household stores.',
      trust: [...GROCERY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Supplier handling, invoices, returns, and procurement workflows simplified.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Faster billing, customer care, returns, and accurate sales tracking.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Stock levels, movement, warehouses, and visibility for fragile and seasonal SKU mixes.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Payments, receipts, banking, expenses, and profitability reporting in one ledger.',
      },
    ],
    vouchersReports: {
      heading: 'Crockery store operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab lists the challenge, solution, and representative transactions and reports.',
      tabs: CROCKERY_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for crockery store management on DigitalManager.',
    },
  }
}

export function mergeRetailManagementIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, sales, inventory, and accounts management and information — unified POS and retail operations for modern stores.',
    vouchersSectionEyebrow: 'Retail & POS programme',
    challengesHeading: 'Why modern retailers choose DigitalManager',
    challengesIntro:
      'Shoppers expect speed at the till while head office needs trustworthy stock and finance—fragmented tools break both.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Smart retail on one platform',
    solutionParagraphs: [
      'Streamline purchases, sales, inventory, customers, accounts, barcode billing, and reporting from one centralized platform designed for modern retail businesses.',
    ],
    heroAsideCaption: 'Cloud POS and retail management with purchase, sale, stock, and accounts aligned.',
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured for retail and POS rollouts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'POS & Retail Management Software | DigitalManager ERP',
    metaDescription:
      'Smart retail operations with powerful POS — purchases, sales, inventory, customers, accounts, and barcode billing from one cloud platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based Point Of Sale & Retail Management Software',
      subhead: 'Smart Retail Operations with Powerful POS Management.',
      intro:
        'Streamline your retail operations with our advanced cloud-based POS and Retail Management Software.\n\nManage purchases, sales, inventory, customers, accounts, barcode billing, and reporting from one centralized platform designed for modern retail businesses.',
      trust: [...TOY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management and Information',
        description: 'Procurement, supplier communication, invoices, and returns tied to stock.',
      },
      {
        icon: 'Store',
        title: 'Sales Management and Information',
        description: 'Billing, credit and cash sales, returns, and performance views for every branch.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management and Information',
        description: 'Stock levels, warehouses, adjustments, and movement tracking end to end.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management and Information',
        description: 'Vouchers, banking, receivables, payables, and financial control linked to retail activity.',
      },
    ],
    vouchersReports: {
      heading: 'Retail operations by area',
      subheading:
        'Each tab summarises purchase, sales, inventory, or accounts for POS-led retail — with problems, solutions, and representative transactions and reports.',
      tabs: RETAIL_TABS,
    },
    whyChoose: { ...data.whyChoose, points: [] },
    realtimeReports: { ...data.realtimeReports, bullets: [] },
    implementation: RETAIL_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: RETAIL_FAQ,
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for POS and retail management on DigitalManager.',
    },
  }
}

const LOGISTICS_TABS: SoftwareTabBlock[] = [
  {
    id: 'log-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Transport businesses often face supplier tracking issues, delayed purchases, inventory shortages, and procurement inefficiencies.',
      'Our Purchase Management System streamlines supplier handling, purchase invoices, purchase returns, and procurement workflows.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Report',
        'Purchase Summary Report',
        'Purchase Register',
        'Purchase Comparison',
        'Purchase Return Report',
        'Purchase Return Summary',
        'Purchase Return Register',
      ],
    ),
  },
  {
    id: 'log-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Inventory mismanagement in logistics businesses causes stock shortages, inaccurate records, and delayed operations.',
      'Our Inventory Management System helps track warehouses, inward/outward inventory, stock transfers, and inventory reports efficiently.',
      [
        'Chart of Item Definition',
        'Warehouse Definition',
        'Opening Stock Voucher',
        'Stock Adjustment Voucher',
        'Stock Navigation / Transfer Voucher',
        'Assemble / De-Assemble Voucher',
      ],
      [
        'Minimum and Maximum Stock Level Report',
        'Product Ledger Report',
        'Inventory Summary Report',
        'Stock Report',
        'Stock Value Report',
        'Stock Navigation Report',
        'Stock Adjustment Report',
      ],
    ),
  },
  {
    id: 'log-trip',
    title: 'Trip Management',
    items: retailTab(
      'Manual trip handling causes fuel leakage, delayed reporting, poor route tracking, and operational inefficiencies.',
      'Our Trip Management Module helps transport businesses monitor vehicles, routes, trip expenses, fuel consumption, and delivery operations efficiently.',
      ['Vehicle Information', 'Vehicle Definition', 'Trip Definition', 'Loading Voucher', 'Unloading Voucher'],
      ['Trip Expense Report', 'Trip Sale Report', 'Trip Commission Report', 'Trip Collection Report'],
    ),
  },
  {
    id: 'log-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Transport businesses require accurate accounting for trip expenses, payments, receipts, fuel costs, and financial reporting.',
      'Our Accounts Management System provides complete financial control through ledgers, vouchers, banking, cash flow, and reporting.',
      [
        'General Accounts Definition',
        'Other Income Definition',
        'Cash & Banks Definition',
        'Expense Definition',
        'Opening Balance Definition',
        'Cash Payment Voucher',
        'Bank Payment Voucher',
        'Bank Receipt Voucher',
        'Cheque Payment Voucher',
        'Debit Note',
        'Credit Note',
        'Journal Entry Voucher',
      ],
      [
        'Cash Received / Payment Reports',
        'Accounts Ledger Report',
        'Trial Balance 2 & 6 Columns',
        'Profit & Loss Report',
        'Balance Sheet Statement',
      ],
    ),
  },
  {
    id: 'log-sales',
    title: 'Sales Management & Information',
    items: retailTab(
      'Manual sales handling causes delayed billing, inaccurate records, customer management issues, and poor sales visibility.',
      'Our Sales Management System helps businesses manage sales orders, customer records, invoices, returns, and sales reporting.',
      ['Customer Definition', 'Sale Order Voucher', 'Credit Sale Voucher', 'Sale Return Voucher', 'Cash Sale Voucher'],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Credit Sale Report',
        'Credit Sale Summary Report',
        'Salesman Wise Commission Report',
        'Cash Sale Report',
        'Net Sale Report',
        'Sale Return Report',
      ],
    ),
  },
  {
    id: 'log-hr',
    title: 'HR Management',
    items: retailTab(
      'Transport businesses struggle with staff attendance, salary management, overtime handling, and employee record maintenance.',
      'Our HR Management System automates attendance, payroll, overtime, incentives, and employee reporting.',
      [
        'Department Definition',
        'Salary Days Setup',
        'Departments Management',
        'Shift Management',
        'Staff Hiring',
        'Staff Attendance',
        'Staff Loan Voucher',
        'Staff Incentive Voucher',
        'Staff Penalty Voucher',
        'Overtime Approval Voucher',
      ],
      ['Attendance Reports', 'Overtime Reports', 'Staff Loan Reports', 'Salary Sheet Reports', 'Salary Slips Reports'],
    ),
  },
]

const LOGISTICS_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map fleet structure, trip flows, fuel and expense policies, warehouses, and finance so DigitalManager fits your transport and logistics reality.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Role-based training for dispatch, warehouse, finance, and HR on trips, stock, vouchers, and payroll before go-live.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Tenant setup, vehicle and route masters, integrations, and sandbox validation before production trips and billing.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing configuration and troubleshooting after launch so seasonal volume and new lanes stay stable.',
  },
]

const MOTOR_TABS: SoftwareTabBlock[] = [
  {
    id: 'motor-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Motor market businesses face difficulties in supplier handling, purchase tracking, delayed deliveries, and inventory management.',
      'Our Purchase Management Module streamlines supplier management, purchase invoices, procurement, and returns handling.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      ['Purchase Order Report', 'Pending Purchase Order Report', 'Purchase Report', 'Purchase Return Report'],
    ),
  },
  {
    id: 'motor-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual sales operations create billing delays, customer handling issues, and inaccurate sales reporting.',
      'Our Sales Management System helps manage customer sales, invoices, returns, and sales analysis efficiently.',
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
        'Assign Sale To Party',
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
    id: 'motor-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Motor market inventory management requires accurate stock tracking, warehouse handling, and item movement control.',
      'Our Inventory Management System provides stock visibility, warehouse management, stock transfers, and inventory tracking.',
      [
        'Chart of Items',
        'Freight Assigning to Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN / Goods Received Note / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'Purchase / Outward Gate Pass Voucher',
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
    id: 'motor-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Motor market businesses require proper financial management for payments, receipts, banking, and expense control.',
      'Our Accounts Management System manages vouchers, ledgers, cash flow, banking, receivables, payables, and financial reports.',
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
        'Cheque in Hand Report',
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

export function mergeLogisticsTransportationIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, inventory, trip, accounts, sales, and HR — one cloud ERP spine for transport companies and logistics businesses.',
    vouchersSectionEyebrow: 'Logistics & transportation',
    challengesHeading: 'Why transport operators choose DigitalManager',
    challengesIntro:
      'Fleet, fuel, trips, and warehouse stock rarely align with finance when they live in separate tools—DigitalManager connects them on one ledger.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Fleet to finance on one timeline',
    solutionParagraphs: [
      'Track vehicles, trips, fuel expenses, inventory, HR, accounts, sales, and warehouse activity from one centralized platform designed for logistics and transportation.',
    ],
    heroAsideCaption: 'Cloud ERP for logistics — trips, stock, sales, HR, and accounts with audit-friendly vouchers.',
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured for logistics and transportation rollouts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Logistics & Transportation ERP | DigitalManager',
    metaDescription:
      'Manage fleet, trips, and deliveries — vehicles, fuel, inventory, HR, accounts, sales, and warehouse on one cloud ERP platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud ERP Software for Logistics & Transportation Business',
      subhead: 'Manage Fleet. Control Trips. Optimize Deliveries.',
      intro:
        'Manage your logistics and transportation operations with our powerful cloud ERP software.\n\nTrack vehicles, trips, fuel expenses, inventory, HR, accounts, sales, and warehouse activities from one centralized platform designed for transport companies and logistics businesses.',
      trust: [...GROCERY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Supplier handling, invoices, returns, and procurement for parts and supplies.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Warehouses, stock moves, adjustments, and visibility across depots and vehicles.',
      },
      {
        icon: 'Truck',
        title: 'Trip Management',
        description: 'Vehicles, routes, loading/unloading, and trip economics tied to operations.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Trip expenses, banking, vouchers, and financial reporting in one books.',
      },
      {
        icon: 'Store',
        title: 'Sales Management & Information',
        description: 'Customer orders, billing, returns, and performance reporting for logistics sales.',
      },
      {
        icon: 'Users',
        title: 'HR Management',
        description: 'Attendance, shifts, payroll, overtime, incentives, and staff records.',
      },
    ],
    vouchersReports: {
      heading: 'Logistics & transportation by area',
      subheading:
        'Six programme areas — each tab lists the challenge, solution, and representative transactions and reports.',
      tabs: LOGISTICS_TABS,
    },
    whyChoose: { ...data.whyChoose, points: [] },
    realtimeReports: { ...data.realtimeReports, bullets: [] },
    implementation: LOGISTICS_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: [],
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for logistics and transportation on DigitalManager.',
    },
  }
}

export function mergeMotorMarketIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead: 'Purchase, sales, inventory, and accounts — built for motor markets, parts bazaars, and automobile retail.',
    vouchersSectionEyebrow: 'Motor market programme',
    challengesHeading: 'Why motor markets choose DigitalManager',
    challengesIntro:
      'Fast-moving SKUs, credit-heavy trade, and multi-branch stock need one ERP spine—not disconnected tills and spreadsheets.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Inventory and sales under control',
    solutionParagraphs: [
      'Digital Manager Motor Market Management Software helps automobile businesses manage inventory, sales, customer relations, workshop-style activity, and accounts from one centralized cloud-based platform.',
    ],
    heroAsideCaption: 'Motor market ERP with purchase, sale, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Motor Market Management Software | DigitalManager ERP',
    metaDescription:
      'Manage inventory, sales, customers, and accounts — cloud ERP for motor markets and automobile businesses.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud ERP Software for Motor Market Management Business',
      subhead: 'Manage Inventory. Track Sales. Control Workshop Operations.',
      intro:
        'Digital Manager Motor Market Management Software helps automobile businesses manage inventory, sales, customer relations, workshop activities, and accounts from one centralized cloud-based platform.',
      trust: [...HW_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Supplier handling, purchase tracking, invoices, procurement, and returns.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Billing, customers, invoices, returns, and sales analysis.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Stock visibility, warehouses, transfers, and movement tracking.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Vouchers, ledgers, cash flow, banking, receivables, payables, and reports.',
      },
    ],
    vouchersReports: {
      heading: 'Motor market operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab lists the challenge, solution, and representative transactions and reports.',
      tabs: MOTOR_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for motor market management on DigitalManager.',
    },
  }
}

const CHICKEN_SUPPLY_TABS: SoftwareTabBlock[] = [
  {
    id: 'broiler-purchase',
    title: 'Poultry Farm Chicks Purchase Management',
    items: retailTab(
      'Poultry businesses often face difficulties in bird purchasing, loading management, chick weight tracking, and maintaining accurate purchase records.',
      'Our Poultry Purchase Management System simplifies bird procurement, loading operations, supplier handling, and purchase reporting.',
      [
        'Broiler Farm Purchase Order Voucher',
        'Birds Chicks Loading from Poultry Farm',
        'Broiler Chicken Mortality Waste',
      ],
      [
        'Broiler Farm Chicks Loading Reports',
        'Loading Broiler Farm Purchase Order Reports',
        'Broiler Chicks Purchase Reports',
        'Broiler Mortality Waste Reports',
      ],
    ),
  },
  {
    id: 'broiler-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual poultry sales handling creates billing delays, inaccurate weight calculations, customer issues, and poor sales visibility.',
      'Our Sales Management System helps poultry businesses manage customer sales, invoices, returns, and daily sales operations efficiently.',
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
        'Assign Sale Rate to Party',
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
    id: 'broiler-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Inventory mismanagement in poultry businesses causes stock shortages, medicine tracking issues, feed wastage, and inaccurate inventory records.',
      'Our Inventory Management System helps poultry farms manage medicines, feed stock, inward/outward inventory, and warehouse control.',
      [
        'Chart of Items',
        'Freight Assigning to Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN / Goods Received Note / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'Purchase / Outward Gate Pass Voucher',
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
    id: 'broiler-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Poultry businesses require proper financial management for payments, receipts, banking, expense tracking, and profitability analysis.',
      'Our Accounts Management System provides complete accounting control with vouchers, ledgers, banking, cash flow, and financial reporting.',
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
        'Cheque in Hand Report',
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

export function mergePoultryChickenSupplyIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Bird purchase and loading, chick weight and broiler management, inventory, and accounts — built for poultry arhat and broiler sale shops in Pakistan.',
    vouchersSectionEyebrow: 'Poultry arhat & broiler',
    challengesHeading: 'Why poultry traders choose DigitalManager',
    challengesIntro:
      'Bird movements, loading slips, and daily sales need the same truth as feed, medicine, and cash—without parallel notebooks.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Trading and stock on one cloud spine',
    solutionParagraphs: [
      'Digital Manager Poultry Arhat Software helps poultry traders and chicken sale businesses manage purchases, sales, inventory, accounts, and customer records from one centralized cloud-based platform.',
    ],
    heroAsideCaption: 'Broiler farm and arhat operations with purchase, sale, stock, and accounts aligned.',
  }

  return {
    ...data,
    metaTitle: 'Poultry Arhat & Broiler Farm Software | DigitalManager ERP',
    metaDescription:
      'Manage poultry trading, sales, and inventory — bird purchase, loading, chick weight, broiler, and accounts for Pakistan poultry businesses.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Poultry Arhat Software for Broiler Farm and Chicken Sale Shops in Pakistan',
      subhead: 'Manage Poultry Trading, Sales, and Inventory Efficiently.',
      intro:
        'Digital Manager Poultry Arhat Software helps poultry traders and chicken sale businesses manage purchases, sales, inventory, accounts, and customer records from one centralized cloud-based platform.',
      trust: [...GROCERY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'Truck',
        title: 'Bird Purchase and Loading Management',
        description: 'Purchase orders, farm loading, and mortality waste tracking tied to supplier and flock context.',
      },
      {
        icon: 'Bird',
        title: 'Chicken Chick Weight and Broiler Management',
        description: 'Chick weight and broiler flows that support accurate purchase and sale postings.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Feed, medicine, and warehouse movements with inward and outward discipline.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Vouchers, banking, receivables, payables, and profitability views leadership expects.',
      },
    ],
    vouchersReports: {
      heading: 'Poultry arhat operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: CHICKEN_SUPPLY_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for poultry arhat and broiler operations on DigitalManager.',
    },
  }
}

const POULTRY_WASTE_TABS: SoftwareTabBlock[] = [
  {
    id: 'waste-collection',
    title: 'Slaughtered Chicks Waste Collection Management',
    items: retailTab(
      'Poultry waste collection businesses face challenges in route planning, waste loading, record keeping, and waste processing management.',
      'Our Poultry Waste Collection System streamlines waste collection, route management, rendering operations, and waste tracking.',
      [
        'Sale Point Chicken Waste Collection',
        'Monthly Chicken Waste Collection Bill',
        'Daily Chicken Waste Collection Voucher',
      ],
      [
        'Poultry Waste Collection Reports',
        'Waste Collection Monthly Billing Report',
        'Purchase Summary',
        'Purchase Register',
        'Purchase Return',
        'Purchase Return Summary',
        'Purchase Return Register',
      ],
    ),
  },
  {
    id: 'waste-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing poultry waste sales manually creates pricing errors, delayed billing, and inaccurate sales reporting.',
      'Our Sales Management Module helps manage waste sales orders, invoices, returns, and sales records efficiently.',
      ['Sale Orders Voucher', 'Sale Voucher', 'Sale Return Voucher', 'Supply Voucher'],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Sale Report',
        'Sale Summary Report',
        'Sale Register',
        'Sale Return Report',
        'Sale Return Summary Report',
        'Sale Return Register Report',
        'Supply Report',
      ],
    ),
  },
  {
    id: 'waste-inventory',
    title: 'Inventory Management',
    items: farmDetailTab(
      'Inventory handling in poultry waste businesses requires accurate stock control, warehouse handling, and consumption tracking.',
      'Our Inventory Management System manages stock movement, warehouse control, item consumption, and inventory reporting.',
      'Features',
      ['Chart of Items', 'Warehouse Definition', 'Inventory Warehouse to Stock Transferring'],
      ['Stock Report', 'Stock Value Report', 'Consumption Report', 'Item Inventory Ledger', 'Inventory Summaries'],
    ),
  },
  {
    id: 'waste-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Waste collection businesses require proper accounting to manage expenses, recoveries, payments, receipts, and profitability.',
      'Our Accounts Management System provides accurate financial management with ledgers, vouchers, banking, and financial reports.',
      [
        'Chart of Accounts',
        'Opening Balances',
        'Cash Payment & Cash Received',
        'Flock Wise Expenses',
        'Bank Payment & Bank Receipt',
        'Journal Entry',
      ],
      [
        'Accounts Ledger',
        'Journal Entry',
        'Cash Payment',
        'Cash Receipt',
        'Bank Payment',
        'Bank Receipts',
        'Recovery Sheet With Details',
        'Expense Detail',
        'Daybook Reports',
        'Accounts Payable',
        'Accounts Receivable',
        'Trial Balance 2 & 6 Columns',
        'Invoice Aging Report',
        'Profit & Loss Statement',
        'Balance Sheet Statement',
      ],
    ),
  },
]

export function mergePoultryWasteIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Chicken waste collection, rendering, inventory, vehicle routes, and accounts — one platform for rendering and collection businesses.',
    vouchersSectionEyebrow: 'Poultry waste collection',
    challengesHeading: 'Why waste collection operators choose DigitalManager',
    challengesIntro:
      'Routes, loads, rendering batches, and settlements need one ledger—so recoveries and costs stay explainable to finance.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Collection to cash on one timeline',
    solutionParagraphs: [
      'Digital Manager Poultry Waste Collection Management Software helps businesses manage slaughtered chicken waste collection, rendering operations, vehicle routes, inventory, accounts, and sales from one centralized cloud-based platform.',
    ],
    heroAsideCaption: 'Waste collection, rendering, routes, and accounts unified on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Poultry Waste Collection Management Software | DigitalManager ERP',
    metaDescription:
      'Manage poultry waste collection and rendering — routes, inventory, accounts, and sales from one cloud platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based Poultry Waste Collection Management Software',
      subhead: 'Manage Poultry Waste Collection and Rendering Efficiently.',
      intro:
        'Digital Manager Poultry Waste Collection Management Software helps businesses manage slaughtered chicken waste collection, rendering operations, vehicle routes, inventory, accounts, and sales from one centralized cloud-based platform.',
      trust: [...HW_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'Trash2',
        title: 'Chicken Waste Collection Management',
        description: 'Daily and monthly billing, collection vouchers, and traceable waste movements.',
      },
      {
        icon: 'Factory',
        title: 'Waste Rendering Management',
        description: 'Rendering operations aligned to purchases, sales, and inventory postings.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Warehouse stock, transfers, consumption, and valuation views.',
      },
      {
        icon: 'Route',
        title: 'Vehicle Route and Management',
        description: 'Route discipline and operational visibility for collection fleets.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Ledgers, recoveries, expenses, and financial statements for the business.',
      },
    ],
    vouchersReports: {
      heading: 'Poultry waste operations by area',
      subheading:
        'Collection, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative flows and reports.',
      tabs: POULTRY_WASTE_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for poultry waste collection on DigitalManager.',
    },
  }
}

const POULTRY_SHED_TABS: SoftwareTabBlock[] = [
  {
    id: 'shed-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Poultry farms require accurate management of purchases, medicines, feed stock, and supplier handling.',
      'Our Purchase Management Module helps manage feed purchases, medicine procurement, supplier invoices, and stock control.',
      ['Purchase Orders Voucher', 'Purchase Return Voucher', 'Flock Purchase Voucher'],
      [
        'Purchase Order',
        'Pending Purchase Order',
        'Purchase Report',
        'Purchase Summary',
        'Purchase Register',
        'Purchase Return',
        'Purchase Return Summary',
        'Purchase Return Register',
        'Bulk Purchase',
      ],
    ),
  },
  {
    id: 'shed-flock',
    title: 'Chicks Flock Management',
    items: farmDetailTab(
      'Managing poultry flock manually creates issues in mortality tracking, feed consumption, medicine usage, and daily flock monitoring.',
      'Our Flock Management System helps poultry farms monitor daily flock activities and maintain accurate flock records.',
      'Features',
      [
        'Shed Registration',
        'Flock Definition',
        'Daily Feed & Medicine Consumption',
        'Daily Chicks Receiving',
        'Daily Chicks Mortality',
        'Daily Feed Consumption',
        'Daily Layer Consumption',
        'Daily Farm Returning',
        'Daily Eggs',
        'Daily Transfer Outward',
        'Flock Stock Transferring',
      ],
      [
        'Flock Feed Record Sale Report',
        'Flock Performance Reports',
        'Flock Analysis Sheet',
        'Daily Flock Efficiency Detail Sheet',
        'Flock Efficiency Summary Sheet',
      ],
    ),
  },
  {
    id: 'shed-inventory',
    title: 'Inventory Management',
    items: farmDetailTab(
      'Inventory management in poultry farms requires proper stock handling, warehouse control, medicine tracking, and consumption management.',
      'Our Inventory Management Module helps manage warehouses, stock transfer, item consumption, and inventory reporting.',
      'Features',
      ['Chart of Items', 'Warehouse Definition', 'Inventory Warehouse to Stock Transferring'],
      ['Stock Report', 'Stock Value Report', 'Consumption Report', 'Item Inventory Ledger', 'Inventory Summaries'],
    ),
  },
  {
    id: 'shed-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual poultry sales operations cause delayed billing, inaccurate records, and poor customer management.',
      'Our Sales Management System helps poultry farms manage sales orders, invoices, supplies, and customer sales efficiently.',
      ['Chick Sale Orders Voucher', 'Weight Bridge Loading Voucher', 'Sale Voucher', 'Supply Voucher'],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Sale Summary Report',
        'Sale Register',
        'Sale Return Summary Report',
        'Sale Return Register Report',
        'Supply Report',
      ],
    ),
  },
  {
    id: 'shed-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Poultry farms require complete financial management for expenses, banking, receivables, and profitability analysis.',
      'Our Accounts Management System manages accounts, ledgers, vouchers, banking transactions, and financial reporting.',
      [
        'Chart of Accounts',
        'Opening Balances',
        'Cash Payment & Cash Received',
        'Flock Wise Expenses',
        'Bank Payments & Bank Receipt',
        'Journal Entry',
      ],
      [
        'Accounts Ledger',
        'Journal Entry',
        'Cash Payment',
        'Cash Receipt',
        'Bank Payment',
        'Bank Receipt',
        'Recovery Sheet With Details',
        'Expense Detail',
        'Daybook Reports',
        'Accounts Payable',
        'Accounts Receivable',
        'Trial Balance 2 & 6 Columns',
        'Invoice Aging Report',
        'Profit & Loss Statement',
        'Balance Sheet Statement',
      ],
    ),
  },
  {
    id: 'shed-rights',
    title: 'User Rights & Management Control System',
    items: retailTab(
      'Farms need to protect flock, payroll, and financial data while still empowering shed supervisors and buyers.',
      'User Rights & Management Control assigns role-based access to sheds, vouchers, and sensitive masters with audit-friendly change history.',
      [
        'Role-based menus and screen access',
        'Shed and flock visibility rules by user',
        'Maker–checker on sensitive vouchers',
        'Separation of duties for purchases and payments',
      ],
      ['User activity and configuration audit extracts where enabled'],
    ),
  },
]

const POULTRY_SHED_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map shed layout, flock cycles, feed and medicine rules, purchase patterns, and finance so DigitalManager matches your farm’s operating model.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Training for farm supervisors, storekeepers, and accountants on flock entry, inventory, sales, and accounts before production go-live.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Tenant setup, shed and flock master imports, voucher templates, and sandbox validation with your historical opening balances.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing configuration help and troubleshooting after launch for new flocks, policy changes, and seasonal peaks.',
  },
]

const POULTRY_SHED_FAQ: SoftwareFaqItem[] = [
  {
    q: 'How does DigitalManager track daily flock activity?',
    a: 'Daily feed, medicine, mortality, eggs, transfers, and returns can be captured against shed and flock definitions so supervisors and finance share one operational timeline.',
  },
  {
    q: 'Can we separate access between shed staff and head office?',
    a: 'Yes. User rights can limit screens and vouchers by role so sensitive payroll or banking data stays with authorised users while shed teams still record flock events.',
  },
  {
    q: 'How are feed and medicine purchases tied to flocks?',
    a: 'Purchase and flock purchase vouchers can align GRNs and issues to the correct flock or shed dimensions for cost and consumption reporting.',
  },
  {
    q: 'Does the system support bridge loading and chick sales?',
    a: 'Chick sale orders, weight bridge loading, sales, and supply vouchers are supported in the programme structure described for poultry shed operations.',
  },
  {
    q: 'What inventory reports are available for farms?',
    a: 'Stock, value, consumption, item ledger, and inventory summary views help explain feed and medicine usage alongside physical checks.',
  },
  {
    q: 'How does accounts integrate with flock-wise expenses?',
    a: 'Flock-wise expenses, cash, bank, and journal entries post to the chart of accounts so profitability and recovery sheets reflect real farm activity.',
  },
  {
    q: 'Can we start with one shed and expand?',
    a: 'Typical rollouts pilot a single shed or flock batch, validate daily entry habits, then add sheds and users without re-platforming.',
  },
  {
    q: 'What implementation support is included?',
    a: 'Consultancy, training, installation, and support are structured so your team owns day-two flock and inventory routines with DigitalManager consultants available for policy changes.',
  },
]

export function mergePoultryControlShedIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, flock, store inventory, sales, farm management, and user rights — one shed programme for modern poultry farms.',
    vouchersSectionEyebrow: 'Poultry control shed',
    challengesHeading: 'Why poultry farms choose DigitalManager',
    challengesIntro:
      'Flock performance, feed conversion, and mortality only improve when daily capture is easy—and finance still trusts the numbers.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Shed operations and finance aligned',
    solutionParagraphs: [
      'Digital Manager Poultry Control Shed Management Software helps poultry farms manage flock records, medicine usage, feed consumption, mortality tracking, inventory, accounts, and sales operations from one centralized cloud platform.',
    ],
    heroAsideCaption: 'Smart shed monitoring with flock, stock, sales, and accounts on DigitalManager.',
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured for poultry shed rollouts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Poultry Control Shed Management Software | DigitalManager ERP',
    metaDescription:
      'Smart poultry farm monitoring — flock, feed, medicine, mortality, inventory, accounts, and sales on one cloud platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based Poultry Control Shed Management Software',
      subhead: 'Smart Poultry Farm Monitoring and Shed Management Solution.',
      intro:
        'Digital Manager Poultry Control Shed Management Software helps poultry farms manage flock records, medicine usage, feed consumption, mortality tracking, inventory, accounts, and sales operations from one centralized cloud platform.',
      trust: [...HW_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management and Information',
        description: 'Feed, medicine, and supplier purchases with returns and flock purchase alignment.',
      },
      {
        icon: 'Bird',
        title: 'Flock Management and Information',
        description: 'Daily flock, feed, mortality, eggs, and transfers with performance reporting.',
      },
      {
        icon: 'Package',
        title: 'Store Inventory Control Management',
        description: 'Warehouse stock, transfers, consumption, and inventory summaries.',
      },
      {
        icon: 'Store',
        title: 'Sales Management and Information System',
        description: 'Chick sales, bridge loading, supplies, and customer-facing billing flows.',
      },
      {
        icon: 'Home',
        title: 'Farm Management and Information System',
        description: 'Shed and farm-level visibility tied to operations and finance.',
      },
      {
        icon: 'Shield',
        title: 'User Rights & Management Control System',
        description: 'Role-based access and audit-friendly control for sensitive farm data.',
      },
    ],
    vouchersReports: {
      heading: 'Poultry shed operations by area',
      subheading:
        'Purchase, flock, inventory, sales, accounts, and user rights — each tab summarises challenges, solutions, and representative flows and reports.',
      tabs: POULTRY_SHED_TABS,
    },
    whyChoose: { ...data.whyChoose, points: [] },
    realtimeReports: { ...data.realtimeReports, bullets: [] },
    implementation: POULTRY_SHED_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: POULTRY_SHED_FAQ,
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for poultry control shed management on DigitalManager.',
    },
  }
}

const FABRIC_STORE_TABS: SoftwareTabBlock[] = [
  {
    id: 'fabric-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Fabric businesses struggle with supplier handling, purchase tracking, stock availability, and invoice management.',
      'Our Purchase Management System streamlines procurement, supplier management, purchase returns, and invoice processing.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      ['Purchase Order Report', 'Pending Purchase Order Report', 'Purchase Report', 'Purchase Return Report'],
    ),
  },
  {
    id: 'fabric-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual fabric sales handling creates billing delays, pricing mistakes, and customer management issues.',
      'Our Sales Management System simplifies billing, customer handling, sale returns, and sales reporting.',
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
        'Assign Sale Rate to Party',
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
    id: 'fabric-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Fabric inventory requires accurate roll tracking, warehouse handling, stock movement control, and inventory visibility.',
      'Our Inventory Management System helps fabric businesses manage stock, inward/outward inventory, warehouse locations, and stock transfers.',
      [
        'Chart of Items',
        'Freight Assigning to Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN / Goods Received Note / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'Purchase / Outward Gate Pass Voucher',
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
    id: 'fabric-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Fabric stores need proper financial management for payments, receipts, banking, expenses, and profitability tracking.',
      'Our Accounts Management System manages ledgers, vouchers, banking, cash flow, and financial reports efficiently.',
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
        'Cheque in Hand Report',
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

const KNITTING_GATE_TAB: SoftwareTabBlock = {
  id: 'knit-gate',
  title: 'Gate Management System',
  items: retailTab(
    'Processing plants lose traceability when gate movements, weighments, and dyeing inwards are not tied to inventory and finance.',
    'Gate Management links inward passes and dyeing gate activity to warehouse and production vouchers so security, stores, and accounts see the same timeline.',
    ['Dyeing Gate Inward', 'Fabric inward / outward gate pass registration', 'Weighbridge-linked receipts where configured'],
    ['Gate pass registers · Inward / outward exception queues · Reconciliation to GRN lines — as configured for your site'],
  ),
}

const KNITTING_TABS: SoftwareTabBlock[] = [
  {
    id: 'knit-procurement',
    title: 'Procurement Management',
    items: retailTab(
      'Textile industries face procurement delays, supplier issues, purchase tracking problems, and inventory shortages.',
      'Our Procurement Management System streamlines vendor handling, purchase planning, invoicing, and procurement reporting.',
      [
        'Material Purchase Management',
        'Fabric Purchase Management',
        'Yarn Purchase Management',
        'Grey Fabric Purchase Management',
        'Purchase Return Voucher',
        'Purchase Payment Voucher',
        'Dyeing Gate Inward',
      ],
      [
        'Purchase Order Reports',
        'Purchase Return Reports',
        'Purchase Summary Reports',
        'Purchase Register',
        'Purchase Payment Reports',
        'Inventory Purchase Reports',
      ],
    ),
  },
  {
    id: 'knit-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Textile inventory management requires proper warehouse handling, batch tracking, and stock movement visibility.',
      'Our Inventory Management System controls warehouse operations, inventory transfers, and stock reporting.',
      [
        'Opening Stock Voucher',
        'Material Issuance Voucher',
        'Material Return Voucher',
        'Fabric & Grey Warehouse Voucher',
        'Chemical Voucher',
        'Fabric Transfer Voucher',
        'Finished Voucher',
      ],
      [
        'Fabric Inward / Outward Gate Pass',
        'Fabric Stock Reports',
        'Inventory Summary Reports',
        'Warehouse Reports',
        'Lot Wise Stock Reports',
        'Fabric Transfer Reports',
      ],
    ),
  },
  KNITTING_GATE_TAB,
  {
    id: 'knit-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing textile sales manually causes billing delays, inaccurate order tracking, and poor customer management.',
      'Our Sales Management System handles customer orders, invoices, delivery challans, and sales analysis.',
      ['Grey Sale Voucher', 'Fabric Sale Voucher', 'Carton Sale Voucher', 'Party Bill Voucher'],
      ['Grey Sale Reports', 'Fabric Sale Reports', 'Party Sale Reports', 'Customer Summary Reports'],
    ),
  },
  {
    id: 'knit-finance',
    title: 'Finance Management',
    items: retailTab(
      'Textile businesses require accurate accounting for banking, expenses, receivables, and profitability analysis.',
      'Our Finance Management System provides complete accounting control with vouchers, ledgers, banking, and reporting.',
      [
        'Chart of Accounts',
        'Opening Balance Voucher',
        'Bank Payment & Bank Receipt',
        'Cash Payment & Cash Received',
        'Journal Entry',
        'Lot Wise Payment',
      ],
      [
        'Accounts Ledger',
        'Journal Entry Reports',
        'Cash Payment Reports',
        'Bank Payment Reports',
        'Accounts Receivable Reports',
        'Trial Balance Reports',
        'Profit & Loss Statements',
        'Balance Sheet Statements',
      ],
    ),
  },
  {
    id: 'knit-hr',
    title: 'HR Management System',
    items: farmDetailTab(
      'Textile industries need proper employee attendance, payroll, overtime, and HR record management.',
      'Our HR Management System automates staff attendance, payroll, overtime, incentives, and employee reporting.',
      'Modules',
      [
        'Staff Hiring',
        'Attendance Management',
        'Salary Management',
        'Leave Management',
        'Employee Loan & Advance',
        'Overtime Management',
      ],
      ['Attendance Reports · Payroll registers · Loan and advance statements · Overtime summaries — as configured for your policy pack'],
    ),
  },
  {
    id: 'knit-production',
    title: 'Production Management',
    items: retailTab(
      'Manual textile production handling creates production delays, material wastage, and poor workflow visibility.',
      'Our Production Management System helps industries monitor dyeing, knitting, processing, and production planning efficiently.',
      [
        'Inward Gate Pass',
        'Batch Transfer Voucher',
        'Dyeing Consumption Voucher',
        'Production Voucher',
        'Outward Gate Pass / Delivery Chalan',
      ],
      ['Inventory Consumption Reports', 'Production Reports', 'Delivery Chalan Reports'],
    ),
  },
]

const TEXTILE_TABS: SoftwareTabBlock[] = [
  {
    id: 'tex-procurement',
    title: 'Procurement Management',
    items: retailTab(
      'Textile industries face supplier coordination issues, procurement delays, and purchase tracking problems.',
      'Our Procurement Management System simplifies purchasing workflows and supplier management.',
      [
        'Material Purchase Management',
        'Fabric Purchase Management',
        'Yarn Purchase Management',
        'Grey Fabric Management',
        'Purchase Return Voucher',
        'Payment Voucher',
      ],
      [
        'Purchase Order Reports',
        'Purchase Return Reports',
        'Purchase Register',
        'Purchase Payment Reports',
        'Inventory Purchase Reports',
      ],
    ),
  },
  {
    id: 'tex-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Textile inventory management requires accurate stock control, warehouse handling, and batch management.',
      'Our Inventory Management System helps industries manage warehouses, transfers, stock levels, and inventory reporting.',
      [
        'Opening Stock Voucher',
        'Material Issuance Voucher',
        'Material Return Voucher',
        'Fabric & Grey Warehouse Voucher',
        'Chemical Voucher',
        'Fabric Transfer Voucher',
        'Finished Products',
      ],
      [
        'Fabric Inward / Outward Gate Pass',
        'Inventory Summary Reports',
        'Warehouse Reports',
        'Lot Wise Stock Reports',
        'Fabric Transfer Reports',
      ],
    ),
  },
  {
    id: 'tex-gate',
    title: 'Gate Management and Information System',
    items: retailTab(
      'Mills lose time when gate activity, weighments, and warehouse receipts disagree with purchase and production.',
      'Gate Management and Information ties inward and outward passes to inventory and finance postings with exception queues supervisors can clear.',
      ['Fabric inward / outward gate pass', 'Vehicle and security checkpoint logs', 'Weighbridge-linked receipts where enabled'],
      ['Gate pass registers · Inward/outward variance lists · GRN linkage diagnostics — as configured'],
    ),
  },
  {
    id: 'tex-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual textile sales processes create billing delays, customer management issues, and inaccurate reporting.',
      'Our Sales Management System manages customer orders, invoices, returns, and sales reporting.',
      ['Grey Sale Voucher', 'Fabric Sale Voucher', 'Carton Sale Voucher', 'Party Bill Voucher'],
      ['Grey Sale Reports', 'Fabric Sale Reports', 'Party Sale Reports', 'Customer Summary Reports'],
    ),
  },
  {
    id: 'tex-finance',
    title: 'Finance Management',
    items: retailTab(
      'Textile businesses require proper accounting control for expenses, banking, receivables, and financial reporting.',
      'Our Finance Management System handles ledgers, vouchers, banking, and financial analysis.',
      [
        'Chart of Accounts',
        'Opening Balance Voucher',
        'Bank Payment & Bank Receipt',
        'Cash Payment & Cash Received',
        'Journal Entry',
      ],
      [
        'Accounts Ledger',
        'Cash Payment Reports',
        'Accounts Receivable Reports',
        'Trial Balance Reports',
        'Profit & Loss Statements',
        'Balance Sheet Statements',
      ],
    ),
  },
  {
    id: 'tex-production',
    title: 'Production Management',
    items: retailTab(
      'Production delays, poor planning, and material wastage reduce textile manufacturing efficiency.',
      'Our Production Management System helps textile industries monitor production workflows and processing activities.',
      [
        'Batch Management',
        'Packing Material Management',
        'Material Issuance Voucher',
        'Production Voucher',
        'Packing Voucher',
      ],
      ['Batch Reports', 'Production Reports', 'Packing Reports'],
    ),
  },
  {
    id: 'tex-hr',
    title: 'HR Management System',
    items: farmDetailTab(
      'Managing textile staff manually creates attendance, payroll, overtime, and HR reporting challenges.',
      'Our HR Management System automates employee management, payroll, attendance, and reporting.',
      'Modules',
      [
        'Staff Hiring',
        'Attendance Management',
        'Salary Management',
        'Employee Loan & Advance',
        'Leave Management',
        'Overtime Management',
      ],
      ['Attendance and payroll packs · Loan and advance statements · Leave balances — as configured'],
    ),
  },
  {
    id: 'tex-automation',
    title: 'Automation Management & Formula Management System',
    items: retailTab(
      'Dyeing and finishing lines need repeatable recipes, batch parameters, and controlled changes without breaking costing.',
      'Automation and formula management standardizes recipes, batch parameters, and production triggers while preserving audit trails.',
      [
        'Recipe / formula maintenance by product and machine',
        'Batch parameter capture linked to production vouchers',
        'Controlled changes with versioning and approvals',
      ],
      ['Formula usage reports · Batch yield comparisons · Exception alerts for out-of-spec runs — as configured'],
    ),
  },
]

const TEXTILE_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map yarn, grey, weaving, dyeing, and finishing flows plus procurement, gates, and finance so DigitalManager fits your mill.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Role-based training for procurement, stores, production, HR, and finance on vouchers and reports before go-live.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Tenant setup, master imports, formula templates, and sandbox validation across plants before production traffic.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing configuration and troubleshooting for seasonal loads, new articles, and regulatory reporting after launch.',
  },
]

export function mergeFabricStoreIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, sales, inventory, and accounts — built for fabric stores, cloth merchants, and tailoring material sellers.',
    vouchersSectionEyebrow: 'Fabric retail',
    challengesHeading: 'Why fabric retailers choose DigitalManager',
    challengesIntro:
      'Colour and design variants, roll-based stock, and fast counters need one spine—without reconciling spreadsheets every night.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Stock and sales in one view',
    solutionParagraphs: [
      'Track fabric inventory, manage colour and design variations, barcode billing, customer sales, supplier purchases, and accounts from one centralized cloud-based system.',
    ],
    heroAsideCaption: 'Fabric and cloth retail with purchase, sale, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Fabric Store Management Software | DigitalManager ERP',
    metaDescription:
      'Manage stock, handle sales, improve customer experience — fabric inventory, barcode billing, purchases, and accounts for cloth merchants.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Fabric Store Management Software for Seamless Stock & Sales Control',
      subhead: 'Manage Stock. Handle Sales. Improve Customer Experience.',
      intro:
        'A powerful retail solution built for fabric stores, cloth merchants, and tailoring material sellers.\n\nTrack fabric inventory, manage color and design variations, barcode billing, customer sales, supplier purchases, and accounts from one centralized cloud-based system.',
      trust: [...GROCERY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Supplier handling, purchase tracking, returns, and invoice processing.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Billing, customers, sale returns, and reporting with pricing discipline.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Rolls, warehouses, transfers, and visibility for pattern and colour variants.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Ledgers, banking, cash flow, and financial reports aligned to retail.',
      },
    ],
    vouchersReports: {
      heading: 'Fabric store operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: FABRIC_STORE_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for fabric store management on DigitalManager.',
    },
  }
}

export function mergeKnittingDyeingIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Procurement, inventory, gate, finance, HR, and production — one ERP for knitting, dyeing, and textile processing.',
    vouchersSectionEyebrow: 'Knitting & dyeing',
    challengesHeading: 'Why textile processors choose DigitalManager',
    challengesIntro:
      'Yarn to finished fabric needs disciplined gates, batches, and costing—without disconnected plant spreadsheets.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Processing under control',
    solutionParagraphs: [
      'Manage knitting, dyeing, inventory, procurement, production, HR, finance, and sales operations from one centralized ERP platform built specifically for textile and dyeing industries.',
    ],
    heroAsideCaption: 'Textile processing with procurement, gates, stock, sales, finance, HR, and production aligned.',
  }

  return {
    ...data,
    metaTitle: 'Knitting & Dyeing Industry ERP | DigitalManager',
    metaDescription:
      'Complete textile processing management — procurement, inventory, gates, sales, finance, HR, and production on one cloud ERP.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based ERP Software for Knitting & Dyeing Industry',
      subhead: 'Complete Textile Processing and Production Management Solution.',
      intro:
        'Manage knitting, dyeing, inventory, procurement, production, HR, finance, and sales operations from one centralized ERP platform built specifically for textile and dyeing industries.',
      trust: [...HW_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Procurement Management System',
        description: 'Material, fabric, yarn, and grey fabric purchasing with payments and gate inward.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management System',
        description: 'Warehouses, issuance, chemicals, transfers, and finished goods visibility.',
      },
      {
        icon: 'DoorOpen',
        title: 'Gate Management System',
        description: 'Inward and outward discipline tied to dyeing and fabric movement.',
      },
      {
        icon: 'Landmark',
        title: 'Finance Management System',
        description: 'Ledgers, banking, lot-wise payments, and statutory-ready reporting.',
      },
      {
        icon: 'Users',
        title: 'HR Management System',
        description: 'Hiring, attendance, salary, leave, loans, and overtime in one HR spine.',
      },
      {
        icon: 'Factory',
        title: 'Production Management System',
        description: 'Batch transfers, consumption, production vouchers, and delivery chalans.',
      },
    ],
    vouchersReports: {
      heading: 'Knitting & dyeing operations by area',
      subheading:
        'Seven programme areas — procurement through production — with challenges, solutions, and representative flows and reports.',
      tabs: KNITTING_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for knitting and dyeing on DigitalManager.',
    },
  }
}

export function mergeTextileIndustryErpPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Procurement, inventory, gate, finance, HR, production, and automation — integrated ERP for textile mills and manufacturing.',
    vouchersSectionEyebrow: 'Textile industry ERP',
    challengesHeading: 'Why textile mills choose DigitalManager',
    challengesIntro:
      'Weaving through dyeing to shipment needs one governed dataset—so margin and WIP stay explainable to banks and buyers.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Mill-wide visibility',
    solutionParagraphs: [
      'Powerful ERP software designed for textile mills and textile manufacturing businesses to manage procurement, inventory, production, HR, finance, dyeing, weaving, and sales operations from one integrated cloud-based platform.',
    ],
    heroAsideCaption: 'Textile manufacturing with procurement, gates, stock, sales, finance, HR, production, and formulas.',
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured for textile mill rollouts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Textile Industry ERP Software | DigitalManager',
    metaDescription:
      'Smart ERP for textile manufacturing — procurement, inventory, gates, finance, HR, production, automation, weaving, and dyeing on one platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based ERP Software for Textile Industry',
      subhead: 'Smart ERP Solution for Textile Manufacturing and Processing.',
      intro:
        'Powerful ERP software designed for textile mills and textile manufacturing businesses to manage procurement, inventory, production, HR, finance, dyeing, weaving, and sales operations from one integrated cloud-based platform.',
      trust: [...HW_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Procurement Management and Information System',
        description: 'Purchasing workflows and supplier coordination for yarn, grey, and fabric.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management and Information System',
        description: 'Warehouses, lots, transfers, chemicals, and finished goods reporting.',
      },
      {
        icon: 'DoorOpen',
        title: 'Gate Management and Information System',
        description: 'Gate passes and inward/outward control tied to inventory and production.',
      },
      {
        icon: 'Landmark',
        title: 'Finance Management and Information System',
        description: 'Ledgers, banking, receivables, and financial statements for the mill.',
      },
      {
        icon: 'Users',
        title: 'HR Management and Information System',
        description: 'Staff lifecycle, attendance, payroll, loans, leave, and overtime.',
      },
      {
        icon: 'Sparkles',
        title: 'Automation Management & Formula Management System',
        description: 'Recipes, batch parameters, and controlled automation linked to production.',
      },
    ],
    vouchersReports: {
      heading: 'Textile mill operations by area',
      subheading:
        'Eight programme areas — including gate and automation — with challenges, solutions, and representative flows and reports.',
      tabs: TEXTILE_TABS,
    },
    whyChoose: { ...data.whyChoose, points: [] },
    realtimeReports: { ...data.realtimeReports, bullets: [] },
    implementation: TEXTILE_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: [],
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for textile industry ERP on DigitalManager.',
    },
  }
}
