import type {
  SoftwareDetailPageData,
  SoftwareFaqItem,
  SoftwareImplementationStep,
  SoftwarePremiumPageConfig,
  SoftwareSeoBlock,
  SoftwareTabBlock,
} from './types'

function retailTab(problem: string, solution: string, transactions: string[], reports: string[]): SoftwareTabBlock['items'] {
  return [
    { name: 'Problem', description: problem },
    { name: 'Solution', description: solution },
    { name: 'Transactions', description: transactions.join(' • ') },
    { name: 'Reports', description: reports.join(' • ') },
  ]
}

function txReportsTab(transactions: string[], reports: string[]): SoftwareTabBlock['items'] {
  return [
    {
      name: 'Problem',
      description: 'LPG operators need disciplined vouchers and registers for this area without duplicate entry.',
    },
    {
      name: 'Solution',
      description: 'DigitalManager models the workflows below with audit-friendly postings and drill-down reporting.',
    },
    { name: 'Transactions', description: transactions.join(' • ') },
    { name: 'Reports', description: reports.join(' • ') },
  ]
}

const ENERGY_TRUST = [
  { value: '2000+', label: 'Happy Clients', icon: 'Users' },
  { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
  { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
  { value: '20+', label: 'Years of Experience', icon: 'Clock' },
] as const

const PETROL_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description: 'We map forecourt layout, wet stock, shifts, lubricant retail, and finance so DigitalManager fits your fuel station.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description: 'Cashier, forecourt supervisor, and accounts teams learn nozzle sales, dips, credit sales, and shift close on live scenarios.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description: 'Tenant setup, tank and nozzle masters, opening dips, and sandbox validation before go-live traffic.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description: 'Ongoing configuration and troubleshooting for rate changes, new products, and regulatory reporting after launch.',
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

const FUEL_TANK_LORRY_TABS: SoftwareTabBlock[] = [
  {
    id: 'ftl-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Fuel transportation businesses face challenges in supplier handling, purchase tracking, fuel loading coordination, and invoice management.',
      'Our Purchase Management System simplifies procurement workflows, supplier coordination, purchase invoicing, and reporting.',
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
    id: 'ftl-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing fuel deliveries manually causes dispatch delays, inaccurate invoicing, and route tracking issues.',
      'Our Sales Management Module automates fuel sale operations, customer billing, dispatch tracking, and delivery reporting.',
      [
        'Nozzle Sale',
        'Bulk Sale',
        'Lubricant & Additives Sale Order',
        'Additives & Additives Sale Invoice',
        'Additives & Additives Sale Return Invoice',
      ],
      [
        'Nozzle Sale Report',
        'Bulk Sale Report',
        'Credit Sale Report',
        'Pending Sale Order Report',
        'Sale Register',
        'Sale Summary Report',
        'Sale Return Report',
      ],
    ),
  },
  {
    id: 'ftl-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Fuel inventory requires accurate stock movement tracking, warehouse handling, and inventory visibility.',
      'Our Inventory Management System helps businesses monitor fuel stock, warehouse transfers, inward/outward inventory, and stock adjustments.',
      [
        'Chart of Items',
        'Warehouse Definition',
        'Opening Stock Voucher',
        'Stock Adjustment Voucher',
        'Stock Navigation / Transfer Voucher',
        'Assemble / De-Assemble Voucher',
      ],
      [
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
    id: 'ftl-route',
    title: 'Route Management',
    items: retailTab(
      'Manual tanker route management leads to delayed deliveries, route confusion, and inefficient fleet utilization.',
      'Our Route Management System helps fuel businesses manage tanker trips, route schedules, dispatch operations, and delivery planning efficiently.',
      [
        'Vehicle Registration',
        'Vehicle Definition',
        'Trip Start Form',
        'Trip End Voucher',
        'Trip Expense Definition',
      ],
      [
        'Trip Expense Report',
        'Tour Summary Report',
        'Tour Completion Report',
        'Tour Comparison Report',
      ],
    ),
  },
  {
    id: 'ftl-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Fuel logistics businesses require proper accounting for payments, receipts, banking, and financial analysis.',
      'Our Accounts Management System provides complete financial control with ledgers, vouchers, banking, and reporting.',
      [
        'General Accounts Definition',
        'Cash & Banks Definition',
        'Expense Definition',
        'Opening Balance Definition',
        'Cash Payment Voucher',
        'Bank Receipt Voucher',
        'Journal Entry Voucher',
      ],
      [
        'Cash Received / Payment Reports',
        'Day Book',
        'Accounts Ledger',
        'Trial Balance',
        'Profit & Loss Statement',
        'Balance Sheet',
      ],
    ),
  },
]

const PETROL_DEPOT_TABS: SoftwareTabBlock[] = [
  {
    id: 'depot-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Petrol depots require accurate procurement handling, fuel purchase tracking, supplier coordination, and invoice management.',
      'Our Purchase Management System streamlines supplier handling, purchase invoicing, and procurement reporting.',
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
    id: 'depot-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual fuel dispatch and sales handling create delays, billing mistakes, and poor tracking.',
      'Our Sales Management System automates fuel dispatch, customer sales, invoicing, and sales reporting.',
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
        'Sale Order Report',
        'Pending Sale Order Report',
        'Sale Report',
        'Dealers Report',
        'Sale Invoice Wise Report',
      ],
    ),
  },
  {
    id: 'depot-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Fuel depot inventory requires proper warehouse handling, stock visibility, inward/outward tracking, and stock reconciliation.',
      'Our Inventory Management Module controls warehouse operations, stock movement, inventory transfers, and stock reporting.',
      [
        'Chart of Items',
        'Warehouse Definition',
        'GRN Voucher',
        'Return Inward Voucher',
        'Stock Transfer Voucher',
        'Item Conversion Voucher',
      ],
      [
        'Goods Receipt Report',
        'Goods Issue Note Report',
        'Return Inward Report',
        'Item Ledger Report',
        'Stock Report',
        'Stock Value Report',
      ],
    ),
  },
  {
    id: 'depot-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Petrol depots require accurate accounting systems for financial transparency and business control.',
      'Our Accounts Management System provides complete financial management including ledgers, vouchers, banking, receivables, and profitability analysis.',
      [
        'Opening Balance Voucher',
        'Cash Payment Voucher',
        'Cash Receipt Voucher',
        'Bank Payment Voucher',
        'Bank Receipt Voucher',
        'Cheque Issue Voucher',
        'Journal Entry Voucher',
      ],
      [
        'Account Ledger',
        'Cash Flow Management',
        'Expense Report',
        'Receivable Report',
        'Trial Balance',
        'Profit & Loss Sheet',
        'Balance Sheet',
      ],
    ),
  },
]

const FLEET_FUEL_TABS: SoftwareTabBlock[] = [
  {
    id: 'fleet-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Fleet businesses struggle with fuel procurement tracking, supplier coordination, and inventory control.',
      'Our Purchase Management System manages fuel purchases, lubricant purchases, rate changes, and supplier transactions.',
      ['Fuel Purchase', 'Lubricant & Additives Purchase', 'Purchase Return', 'Rate Change Form'],
      [
        'Purchase Order Report',
        'Purchase Return Report',
        'Purchase Summary',
        'Rate Change Detail Report',
      ],
    ),
  },
  {
    id: 'fleet-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual fleet fuel sale operations create invoicing delays and inaccurate reporting.',
      'Our Sales Management Module simplifies fuel issuance, billing, and vehicle fuel tracking.',
      [
        'Nozzle Sale',
        'Bulk Sale',
        'Lubricant & Additives Sale Order',
        'Sale Return',
        'Additives Sale Invoice',
      ],
      [
        'Nozzle Sale Report',
        'Bulk Sale Report',
        'Credit Sale Report',
        'Sale Register',
        'Sale Summary Report',
      ],
    ),
  },
  {
    id: 'fleet-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Fleet fuel inventory requires accurate monitoring of stock movement and warehouse handling.',
      'Our Inventory Management System controls fuel inventory, warehouse stock, stock levels, and inward/outward movement.',
      [
        'Chart of Items',
        'Warehouse Definition',
        'Fuel Navigation Voucher',
        'Lubricant & Additives Navigation',
      ],
      ['Stock Navigation Report', 'Goods Issue Report', 'Stock Value Report', 'Inventory Summary Report'],
    ),
  },
  {
    id: 'fleet-finance',
    title: 'Finance Management',
    items: retailTab(
      'Fleet businesses require proper accounting to track fuel expenses, receivables, banking, and profitability.',
      'Our Finance Management Module provides accurate accounting and financial analysis tools.',
      [
        'Chart of Accounts',
        'Vehicle Registration',
        'Opening Balance Voucher',
        'Cash Payment & Cash Received',
        'Bank Payment & Bank Receipt',
        'Journal Entry Voucher',
      ],
      [
        'Accounts Ledger',
        'Journal Entry Reports',
        'Expense Reports',
        'Receivable Reports',
        'Profit & Loss Statement',
        'Balance Sheet',
      ],
    ),
  },
  {
    id: 'fleet-hr',
    title: 'Human Resource Management',
    items: retailTab(
      'Managing drivers, helpers, and operational staff manually creates attendance and payroll challenges.',
      'Our HR Management System automates attendance, payroll, overtime, and staff management.',
      [
        'Driver Registration',
        'Salary Definition',
        'Attendance Voucher',
        'Staff Loan Voucher',
        'Staff Penalty Voucher',
      ],
      [
        'Attendance Reports',
        'Salary Reports',
        'Overtime Reports',
        'Staff Loan Reports',
        'Salary Slip Reports',
      ],
    ),
  },
]

const LPG_BOWSER_TABS: SoftwareTabBlock[] = [
  {
    id: 'bowser-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'LPG supply chains require accurate purchase tracking, supplier handling, and inventory coordination.',
      'Our Purchase Management System simplifies LPG procurement workflows and purchase reporting.',
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
    id: 'bowser-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing LPG deliveries manually causes dispatch delays and customer management issues.',
      'Our Sales Management Module automates LPG order handling, dispatch operations, invoicing, and delivery tracking.',
      [
        'Add New Customers',
        'Sale Order Voucher',
        'Sale Voucher',
        'Multi Sale Voucher Print',
        'Sale Return Voucher',
      ],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Sale Register',
        'Sale Summary Report',
        'Dealers Report',
      ],
    ),
  },
  {
    id: 'bowser-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'LPG businesses require accurate cylinder tracking, stock movement handling, and warehouse control.',
      'Our Inventory Management System helps businesses monitor cylinders, warehouse stock, inward/outward movement, and stock reconciliation.',
      [
        'Warehouse Definition',
        'GRN Voucher',
        'Return Inward Voucher',
        'Stock Transfer Voucher',
        'Item Conversion Voucher',
      ],
      [
        'Goods Receipt Report',
        'Goods Issue Note Report',
        'Return Inward Report',
        'Stock Report',
        'Stock Value Report',
      ],
    ),
  },
  {
    id: 'bowser-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'LPG transport businesses need accurate accounting for expenses, banking, customer receivables, and profitability.',
      'Our Accounts Management Module provides complete accounting control with vouchers, ledgers, banking, and reporting.',
      [
        'Opening Balance Voucher',
        'Cash Payment Voucher',
        'Bank Receipt Voucher',
        'Debit Note',
        'Journal Entry Voucher',
      ],
      [
        'Account Ledger',
        'Cash Flow Management',
        'Expense Report',
        'Receivable Report',
        'Trial Balance',
        'Profit & Loss Sheet',
        'Balance Sheet',
      ],
    ),
  },
]

const LPG_ERP_TABS: SoftwareTabBlock[] = [
  {
    id: 'lpg-purchase',
    title: 'Purchase Management',
    items: txReportsTab(
      ['LPG Local Purchase & Import', 'Empty Cylinder Purchase', 'Purchase Return', 'Rate Change Form'],
      [
        'Purchase Order Reports',
        'Purchase Register',
        'Purchase Summary',
        'Purchase Return Reports',
      ],
    ),
  },
  {
    id: 'lpg-sales',
    title: 'Sales Management',
    items: txReportsTab(
      ['LPG Local Cylinder Sale', 'LPG Bulk Sale', 'Empty Cylinder Exchange', 'Plant Cylinder Delivery'],
      ['LPG Sale Reports', 'Bulk LPG Reports', 'Customer Sale Reports', 'Pending Sale Reports'],
    ),
  },
  {
    id: 'lpg-inventory',
    title: 'Inventory Management',
    items: txReportsTab(
      ['Chart of Items', 'Warehouse Definition', 'Stock Adjustment', 'Cylinder Stock Transfer'],
      [
        'Stock Analysis Reports',
        'Cylinder Ledger',
        'Inventory Summary Reports',
        'Product Movement Reports',
      ],
    ),
  },
  {
    id: 'lpg-plant',
    title: 'Plant Filling Management',
    items: txReportsTab(
      ['Cylinder Capacity Setup', 'Cylinder Filling', 'Delivery Voucher', 'Empty Cylinder Receiving'],
      ['Cylinder Filling Reports', 'Daily Plant Reports', 'Damage & Fault Cylinder Reports'],
    ),
  },
  {
    id: 'lpg-finance',
    title: 'Finance Management',
    items: txReportsTab(
      ['Chart of Accounts', 'Dealer Registration', 'Cash Payment & Cash Receipt', 'Journal Entry Voucher'],
      [
        'Accounts Ledger',
        'Journal Entry Reports',
        'Expense Reports',
        'Trial Balance',
        'Profit & Loss Statement',
        'Balance Sheet',
      ],
    ),
  },
  {
    id: 'lpg-hr',
    title: 'Human Resource Management',
    items: txReportsTab(
      [
        'Driver Registration',
        'Salary Management',
        'Attendance Management',
        'Staff Loan Voucher',
        'Staff Penalty Voucher',
      ],
      [
        'Attendance Reports',
        'Overtime Reports',
        'Staff Salary Reports',
        'Salary Slip Reports',
      ],
    ),
  },
]

const PETROL_PUMP_TABS: SoftwareTabBlock[] = [
  {
    id: 'pump-purchase',
    title: 'Purchase Management System',
    items: txReportsTab(
      ['Fuel Purchase', 'Lubricant Purchase', 'Purchase Return', 'Supplier Payments'],
      ['Purchase Reports', 'Supplier Ledger', 'Purchase Summary', 'Purchase Return Reports'],
    ),
  },
  {
    id: 'pump-inventory',
    title: 'Inventory Control System',
    items: txReportsTab(
      ['Tank Definition', 'Nozzle Definition', 'Dip Reading Entry', 'Stock Adjustment', 'Product Transfer'],
      [
        'Tank Stock Reports',
        'Dip Gain / Loss Reports',
        'Inventory Summary Reports',
        'Product Movement Reports',
      ],
    ),
  },
  {
    id: 'pump-sales',
    title: 'Sales Management System',
    items: txReportsTab(
      ['Nozzle Sale', 'Bulk Sale', 'Credit Sale', 'Lubricant Sale', 'Sale Return'],
      ['Nozzle Sale Reports', 'Bulk Sale Reports', 'Credit Sale Reports', 'Sale Summary Reports'],
    ),
  },
  {
    id: 'pump-accounts',
    title: 'Accounts Management System',
    items: txReportsTab(
      ['Cash Payment', 'Cash Receipt', 'Bank Payment', 'Bank Receipt', 'Journal Entry'],
      ['Accounts Ledger', 'Expense Reports', 'Profit & Loss', 'Balance Sheet'],
    ),
  },
]

const PETROL_PUMP_FAQS: SoftwareFaqItem[] = [
  {
    q: 'What is DigitalManager Petrol Station Software?',
    a: 'DigitalManager Petrol Station Software is a complete ERP solution designed to automate petrol station operations including fuel sales, tank stock management, nozzle tracking, inventory control, customer accounts, and financial reporting.',
  },
  {
    q: 'Is this software suitable for petrol stations in Pakistan?',
    a: 'Yes, the software is specially designed according to the operational needs of petrol pumps and fuel stations in Pakistan.',
  },
  {
    q: 'Does the software support multiple fuel products?',
    a: 'Yes, you can manage multiple fuel products including Petrol, Diesel, HOBC, Lubricants, and CNG.',
  },
  {
    q: 'Can I manage multiple stations with one account?',
    a: 'Yes, the software supports multi-branch fuel station management from a centralized dashboard.',
  },
  {
    q: 'Can I track credit sales and customer balances?',
    a: 'Yes, the system provides complete customer ledger management with credit sale tracking and outstanding balance monitoring.',
  },
  {
    q: 'Is training and support provided?',
    a: 'Yes, we provide implementation, staff training, and ongoing technical support.',
  },
  {
    q: 'How can I get started or request a demo?',
    a: 'Simply submit your contact details in the demo form and our team will contact you shortly.',
  },
]

const PETROL_PUMP_SEO: SoftwareSeoBlock[] = [
  {
    heading: 'What is Our Petrol Station Management Software?',
    level: 2,
    paragraphs: [
      'DigitalManager Petrol Station Software is an advanced cloud-based solution developed for petrol pumps, fuel stations, and oil marketing businesses. The system simplifies fuel operations by automating fuel sales, inventory monitoring, customer management, and financial reporting. It helps station owners improve efficiency, reduce manual work, and maintain accurate business records in real time.',
    ],
    lists: [
      {
        items: [
          'Real-Time Fuel Monitoring',
          'Inventory Control',
          'Automated Billing',
          'Cloud-Based Access',
        ],
      },
    ],
  },
  {
    heading: 'What Our Customers Say',
    level: 2,
    paragraphs: [],
    lists: [
      {
        items: [
          'DigitalManager Petrol Station Software completely transformed our daily operations. Fuel tracking and reporting are now much easier and more accurate.',
          'The software helped us reduce manual errors and improve sales management. Excellent support team and easy-to-use system.',
          'Now we can monitor sales, stock, and customer balances from anywhere. Highly recommended for petrol pumps.',
        ],
      },
    ],
  },
  {
    heading: 'Trusted by Leading Oil Marketing Companies',
    level: 2,
    paragraphs: [
      'Our petrol station software is trusted by fuel stations, lubricant distributors, and oil marketing businesses across Pakistan for reliable operations, accurate reporting, and business automation.',
    ],
  },
  {
    heading: 'Petrol station software keywords',
    level: 3,
    paragraphs: [],
    lists: [
      {
        items: [
          'petrol station management software',
          'petrol pump software Pakistan',
          'fuel station ERP software',
          'petrol pump inventory system',
          'tank stock management software',
          'nozzle sale tracking software',
          'fuel station billing software',
          'petrol station accounts software',
          'lubricant inventory software',
          'cloud petrol pump software',
          'fuel station POS system',
          'oil marketing ERP software',
        ],
      },
    ],
  },
]

export function mergeFuelTankLorryIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, sales, stock, accounts, route, and inventory — unified for fuel tanker dispatch and delivery accuracy.',
    vouchersSectionEyebrow: 'Fuel tank lorry',
    challengesHeading: 'Why fuel distributors choose DigitalManager',
    challengesIntro:
      'Tanker dispatch, route planning, and wet-stock movement need one spine—without reconciling spreadsheets every night.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Transport and finance aligned',
    solutionParagraphs: [
      'Manage fuel dispatch, route planning, tanker tracking, inventory movement, and delivery operations through one centralized cloud-based system.',
    ],
    heroAsideCaption: 'Fuel tank lorry management with purchase, sales, stock, routes, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Fuel Tank Lorry Management Software | DigitalManager ERP',
    metaDescription:
      'Track tankers, monitor fuel loads, ensure delivery accuracy — dispatch, routes, inventory, and accounts for oil marketing companies.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline:
        'Cloud-Based Fuel Tank Lorry Management Software for Efficient Fuel Transport & Dispatch',
      subhead: 'Track Tankers. Monitor Fuel Loads. Ensure Delivery Accuracy.',
      intro:
        'Advanced fuel transportation software designed for oil marketing companies and fuel distributors.\n\nManage fuel dispatch, route planning, tanker tracking, inventory movement, and delivery operations through one centralized cloud-based system.',
      trust: [...ENERGY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Supplier coordination, purchase invoicing, and procurement reporting.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Nozzle and bulk sales, lubricant orders, and delivery billing.',
      },
      {
        icon: 'Package',
        title: 'Stock Management',
        description: 'Fuel stock levels, warehouse visibility, and movement control.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Ledgers, banking, vouchers, and financial statements.',
      },
      {
        icon: 'Map',
        title: 'Route Management',
        description: 'Tanker trips, route schedules, dispatch, and trip expenses.',
      },
      {
        icon: 'Layers',
        title: 'Inventory Management',
        description: 'Warehouse transfers, adjustments, and stock navigation.',
      },
    ],
    vouchersReports: {
      heading: 'Fuel tank lorry operations by area',
      subheading:
        'Purchase, sales, inventory, routes, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: FUEL_TANK_LORRY_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for fuel tank lorry management on DigitalManager.',
    },
  }
}

export function mergePetrolDepotIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, sales, inventory, and accounts — built for oil depots and fuel storage facilities.',
    vouchersSectionEyebrow: 'Petrol depot',
    challengesHeading: 'Why depot operators choose DigitalManager',
    challengesIntro:
      'Bulk fuel storage, dispatch, and finance rarely align when stock and billing live in separate tools.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Depot stock and dispatch in one view',
    solutionParagraphs: [
      'Manage inventory, fuel dispatch, tanker movement, purchase operations, and financial accounting from one integrated ERP platform.',
    ],
    heroAsideCaption: 'Petrol depot management with purchase, sales, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Petrol Depot Management Software | DigitalManager ERP',
    metaDescription:
      'Track tankers, monitor stock, automate billing — inventory, dispatch, purchases, and accounts for oil depots.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Petrol Depot Management Software for Seamless Fuel Stock & Dispatch Control',
      subhead: 'Track Tankers. Monitor Stock. Automate Billing.',
      intro:
        'Powerful depot management software designed for oil depots and fuel storage facilities.\n\nManage inventory, fuel dispatch, tanker movement, purchase operations, and financial accounting from one integrated ERP platform.',
      trust: [...ENERGY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Supplier handling, purchase invoicing, and procurement reporting.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Fuel dispatch, customer sales, invoicing, and dealer reporting.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Warehouses, GRN, transfers, and stock reconciliation.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Ledgers, banking, receivables, and profitability analysis.',
      },
    ],
    vouchersReports: {
      heading: 'Petrol depot operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: PETROL_DEPOT_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for petrol depot management on DigitalManager.',
    },
  }
}

export function mergePetrolFillingStationIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Filling Station Software Modules',
    featuresLead:
      'Nozzle sales, tank stock, lubricants, credit customers, and accounts — built for petrol and CNG forecourts.',
    vouchersSectionEyebrow: 'Petrol & CNG station',
    challengesHeading: 'Why filling station owners choose DigitalManager',
    challengesIntro:
      'Wet-stock dips, nozzle readings, and shift closing need one governed system—not parallel registers and spreadsheets.',
    challengesListLead: '',
    challengeBullets: [
      'Real-time tank and nozzle monitoring',
      'CNG and petrol sales on one platform',
      'Credit customer ledger and outstanding balances',
      'Lubricant and retail shop inventory',
      'Shift-wise sales and dip reconciliation',
      'Accounts and tax-ready reporting',
    ],
    solutionHeading: 'Forecourt operations under control',
    solutionParagraphs: [
      'Manage nozzle sales, tank dips, lubricant inventory, credit customers, shift closing, and financial reporting from one cloud ERP built for petrol and CNG filling stations.',
    ],
    heroAsideCaption: 'Petrol and CNG filling station ERP with wet stock, nozzle sales, and accounts.',
  }

  return {
    ...data,
    metaTitle: 'Petrol & CNG Filling Station Software | DigitalManager ERP',
    metaDescription:
      'Nozzle sales, tank stock, dips, lubricants, credit sales, and accounts for petrol and CNG filling stations in Pakistan.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Petrol & CNG Filling Station Management Software',
      subhead: 'Nozzle Sales. Tank Stock. Shift Closing. One Platform.',
      intro:
        'Cloud ERP for petrol and CNG filling stations — manage nozzle sales, tank dips, lubricant inventory, credit customers, shift closing, and accounts without parallel registers.',
      trust: [...ENERGY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'Fuel',
        title: 'Nozzle & CNG Sales',
        description: 'Forecourt sales, bulk dispensing, and shift-wise nozzle readings.',
      },
      {
        icon: 'Gauge',
        title: 'Tank Stock & Dip Reading',
        description: 'Wet-stock reconciliation, gain/loss, and multi-tank monitoring.',
      },
      {
        icon: 'Store',
        title: 'Lubricant & Shop Sales',
        description: 'Lubricant inventory, retail shop billing, and returns.',
      },
      {
        icon: 'Users',
        title: 'Credit Customer Ledger',
        description: 'Fleet and dealer credit sales with outstanding balance tracking.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts & Reporting',
        description: 'Vouchers, banking, P&L, and shift closing reports.',
      },
      {
        icon: 'BarChart3',
        title: 'Management Dashboard',
        description: 'Branch-wise KPIs for sales, stock, and receivables.',
      },
    ],
    vouchersReports: {
      heading: 'Filling station operations by area',
      subheading: 'Purchase, sales, inventory, and accounts — representative transactions and reports.',
      tabs: PETROL_PUMP_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough for your petrol or CNG filling station.',
    },
  }
}

export function mergeFleetFuelIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, sales, tank stock, store inventory, accounts, and HR — one platform for fleet fuel control.',
    vouchersSectionEyebrow: 'Fleet fuel',
    challengesHeading: 'Why fleet operators choose DigitalManager',
    challengesIntro:
      'Fuel consumption, vehicle mileage, and operational costs need disciplined tracking—not manual logs reconciled after month-end.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Fleet fuel under control',
    solutionParagraphs: [
      'Track fuel consumption, vehicle mileage, fuel issuance, and operational costs through one smart cloud platform.',
    ],
    heroAsideCaption: 'Fleet fuel management with purchase, sales, stock, finance, and HR on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Fleet Fuel Management Software | DigitalManager ERP',
    metaDescription:
      'Monitor fuel, track vehicles, control expenses — purchases, sales, tank stock, store inventory, accounts, and HR for fleets.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Fleet Fuel Management Software to Maximize Efficiency & Minimize Costs',
      subhead: 'Monitor Fuel. Track Vehicles. Control Expenses.',
      intro:
        'A complete fleet fuel management solution for logistics companies, transport businesses, and delivery fleets.\n\nTrack fuel consumption, vehicle mileage, fuel issuance, and operational costs through one smart cloud platform.',
      trust: [...ENERGY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management & Information System',
        description: 'Fuel and lubricant purchases, returns, and rate changes.',
      },
      {
        icon: 'Store',
        title: 'Sales Management & Information System',
        description: 'Nozzle and bulk sales, lubricant orders, and fuel issuance.',
      },
      {
        icon: 'Fuel',
        title: 'Tank Stock Management & Information System',
        description: 'Tank stock levels, navigation, and fuel movement.',
      },
      {
        icon: 'Package',
        title: 'Store Inventory Control Management',
        description: 'Warehouse stock, lubricants, and store inventory control.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management & Information System',
        description: 'Ledgers, banking, expenses, and financial reporting.',
      },
      {
        icon: 'Users',
        title: 'HR Management & Information System',
        description: 'Drivers, attendance, payroll, loans, and penalties.',
      },
    ],
    vouchersReports: {
      heading: 'Fleet fuel operations by area',
      subheading:
        'Five programme areas — purchase through HR — with challenges, solutions, and representative transactions and reports.',
      tabs: FLEET_FUEL_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for fleet fuel management on DigitalManager.',
    },
  }
}

export function mergeLpgBowserIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, trip management, invoicing, and accounts — built for LPG bowser transport and dispatch.',
    vouchersSectionEyebrow: 'LPG bowser transport',
    challengesHeading: 'Why LPG distributors choose DigitalManager',
    challengesIntro:
      'Bowser dispatch, route tracking, and cylinder movement need one governed dataset—without shadow ledgers.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Bowser operations under control',
    solutionParagraphs: [
      'Manage bowser dispatch, route tracking, inventory handling, and financial operations through one centralized ERP solution.',
    ],
    heroAsideCaption: 'LPG bowser transport with purchase, sales, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'LPG Bowser Transport Management ERP | DigitalManager',
    metaDescription:
      'Track deliveries, manage bowser operations — purchase, sales, inventory, and accounts for LPG transport on one cloud ERP.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud ERP Software for LPG Bowser Transport Management',
      subhead: 'Track Deliveries. Manage Bowser Operations Efficiently.',
      intro:
        'Advanced LPG transport management software for LPG distributors and logistics companies.\n\nManage bowser dispatch, route tracking, inventory handling, and financial operations through one centralized ERP solution.',
      trust: [...ENERGY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'LPG procurement workflows, supplier handling, and purchase reporting.',
      },
      {
        icon: 'Truck',
        title: 'Trip Management',
        description: 'Bowser dispatch, route tracking, and delivery operations.',
      },
      {
        icon: 'FileText',
        title: 'Invoicing & Payments Management',
        description: 'Customer billing, collections, and receivables aligned to deliveries.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Ledgers, banking, expenses, and financial reporting.',
      },
    ],
    vouchersReports: {
      heading: 'LPG bowser operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: LPG_BOWSER_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for LPG bowser transport on DigitalManager.',
    },
  }
}

export function mergeLpgErpIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, filling and sales, accounts, plant and cylinder inventory, tank stock, and HR — integrated LPG ERP.',
    vouchersSectionEyebrow: 'LPG business ERP',
    challengesHeading: 'Why LPG marketers choose DigitalManager',
    challengesIntro:
      'Plant filling, cylinder tracking, and distribution finance need one timeline—not disconnected depot spreadsheets.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Plant to customer on one ledger',
    solutionParagraphs: [
      'Manage procurement, cylinder inventory, plant filling, sales, finance, HR, and logistics operations from one centralized cloud-based platform.',
    ],
    heroAsideCaption: 'LPG ERP with purchase, plant filling, cylinder stock, finance, and HR on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'LPG ERP Software | DigitalManager',
    metaDescription:
      'Complete LPG plant, cylinder, and distribution management — purchase, filling, sales, finance, tank stock, and HR on one cloud ERP.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud ERP Software for LPG Business',
      subhead: 'Complete LPG Plant, Cylinder & Distribution Management Solution.',
      intro:
        'Comprehensive ERP software designed for LPG marketing companies and gas distribution businesses.\n\nManage procurement, cylinder inventory, plant filling, sales, finance, HR, and logistics operations from one centralized cloud-based platform.',
      trust: [...ENERGY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'LPG Purchase Management & Information System',
        description: 'Local and import purchases, empty cylinders, returns, and rate changes.',
      },
      {
        icon: 'Store',
        title: 'Filling, Sales & Supply Management System',
        description: 'Cylinder sales, bulk LPG, exchanges, and plant deliveries.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management & Information System',
        description: 'Dealers, banking, journals, and financial statements.',
      },
      {
        icon: 'Package',
        title: 'Plant & Cylinder Inventory Control Management',
        description: 'Cylinder stock, transfers, adjustments, and movement reports.',
      },
      {
        icon: 'Fuel',
        title: 'Tank Stock Management & Information System',
        description: 'Bulk LPG tank stock visibility and valuation.',
      },
      {
        icon: 'Users',
        title: 'HR Management & Information System',
        description: 'Drivers, attendance, payroll, loans, and penalties.',
      },
    ],
    vouchersReports: {
      heading: 'LPG business operations by area',
      subheading:
        'Six programme areas — purchase through HR — with representative transactions and reports for each module.',
      tabs: LPG_ERP_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for LPG business ERP on DigitalManager.',
    },
  }
}

export function mergePetrolPumpIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...pl,
    heroChips: [],
    featuresHeading: 'Petrol Pump Software Modules',
    featuresLead:
      'Purchase, inventory, sales, accounts, tank stock, and HR — unified for modern fuel station operations.',
    vouchersSectionEyebrow: 'Petrol pump ERP',
    challengesHeading: 'Why fuel station owners across Pakistan trust DigitalManager',
    challengesIntro:
      'Are you struggling with managing daily operations at your petrol station? DigitalManager Petrol Station Management Software is a complete cloud-based ERP solution specially designed for fuel stations across Pakistan.',
    challengesListLead: '',
    challengeBullets: [
      'Specially designed for petrol stations in Pakistan',
      'Real-time tank and nozzle monitoring',
      'Reduce fuel theft and manual errors',
      'Improve business efficiency with automation',
      'Access reports anytime from mobile or desktop',
      '24/7 support and implementation assistance',
      'Replace manual registers with digital records',
    ],
    solutionHeading: 'Complete petrol pump ERP solution',
    solutionParagraphs: [
      'Monitor nozzle sales, tank stock, dip readings, lubricant inventory, customer balances, staff attendance, and financial reports from one centralized dashboard.',
      'Advanced petrol pump software designed for fuel stations and oil marketing businesses — manage nozzle sales, tank stock, dip readings, credit sales, lubricant inventory, accounts, and shift operations from one centralized ERP platform.',
    ],
    industriesSection: {
      heading: 'Perfect for All Types of Fuel Businesses',
      description: 'DigitalManager petrol station software scales from single forecourts to multi-branch chains.',
      items: [
        { label: 'Independent Petrol Stations', to: '/software/industry/petrol-pump-software' },
        { label: 'Multi-Branch Fuel Station Chains', to: '/software/industry/petrol-pump-software' },
        { label: 'Oil & Lubricant Distributors', to: '/software/industry/petrol-pump-software' },
        { label: 'CNG Filling Stations', to: '/software/industry/petrol-gas-filling-station-software' },
        { label: 'Fuel Stations with Retail Shops', to: '/software/industry/petrol-pump-software' },
      ],
      note: 'Request a FREE demo today — our team will tailor a walkthrough to your forecourt layout and wet-stock policies.',
    },
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured for petrol pump rollouts on DigitalManager.',
    demoSendButtonLabel: 'Submit',
    faqSectionHeading: 'Frequently asked questions',
    heroAsideCaption: 'Petrol pump ERP with wet stock, nozzle sales, lubricants, shifts, and accounts.',
  }

  return {
    ...data,
    metaTitle: 'Petrol Station Management Software in Pakistan | DigitalManager',
    metaDescription:
      'Best petrol pump software for fuel stations in Pakistan — nozzle sales, tank stock, dips, credit sales, lubricants, accounts, and shift reporting.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Petrol Station Management Software in Pakistan',
      subhead: 'Complete Petrol Pump ERP Solution for Modern Fuel Stations.',
      intro:
        'Are you struggling with managing daily operations at your petrol station? DigitalManager Petrol Station Management Software is a complete cloud-based ERP solution specially designed for fuel stations across Pakistan. Monitor nozzle sales, tank stock, dip readings, lubricant inventory, customer balances, staff attendance, and financial reports from one centralized dashboard.',
      trust: [...ENERGY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Fuel and lubricant purchases, returns, and supplier payments.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Nozzle, bulk, credit, and lubricant sales with returns.',
      },
      {
        icon: 'Fuel',
        title: 'Tank Stock Management',
        description: 'Tanks, dips, gain/loss, and wet-stock reconciliation.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Cash, bank, journals, and financial statements.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Lubricants, shop SKUs, transfers, and stock reports.',
      },
      {
        icon: 'Users',
        title: 'HR & Staff Management',
        description: 'Shifts, attendance, payroll, and staff accountability.',
      },
    ],
    vouchersReports: {
      heading: 'Petrol pump operations by area',
      subheading:
        'Purchase, inventory, sales, and accounts — representative transactions and reports for fuel station ERP.',
      tabs: PETROL_PUMP_TABS,
    },
    whyChoose: {
      heading: 'Why Choose DigitalManager Petrol Pump Software?',
      intro:
        'Built for forecourt speed and finance-grade discipline — the combination operators cite during evaluations.',
      points: [
        {
          title: 'Real-Time Fuel Monitoring',
          body: 'Track fuel, lubricants, and tank stock in real time with automated inventory management.',
        },
        {
          title: 'Sales & Billing System',
          body: 'Fast POS billing system for fuel and lubricant sales with accurate invoice generation.',
        },
        {
          title: 'Staff Shift & Attendance Management',
          body: 'Manage staff shifts, attendance, overtime, and daily operational activities efficiently.',
        },
        {
          title: 'Advanced Reporting Dashboard',
          body: 'Generate daily, weekly, and monthly reports for sales, stock, expenses, and profitability.',
        },
        {
          title: 'Lubricant & Shop Inventory Management',
          body: 'Manage store items, lubricants, and shop sales within the same ERP system.',
        },
        {
          title: 'Secure Cloud-Based Access',
          body: 'Access your petrol station software securely from anywhere using mobile, tablet, or desktop.',
        },
        {
          title: 'No More Manual Ledger Books',
          body: 'Digitize customer accounts, supplier ledgers, expenses, and payment records.',
        },
      ],
    },
    realtimeReports: { ...data.realtimeReports, bullets: [] },
    implementation: PETROL_IMPLEMENTATION,
    related: [],
    seoBlocks: PETROL_PUMP_SEO,
    faqs: PETROL_PUMP_FAQS,
    demoCta: {
      ...data.demoCta,
      heading: 'Request a FREE Demo Today!',
      sub: 'Share your email and contact number — our consultants respond with a tailored walkthrough for your petrol station.',
    },
  }
}
