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

function modulesTab(problem: string, solution: string, modules: string[], reports: string[]): SoftwareNamedItem[] {
  return [
    { name: 'Problem', description: problem },
    { name: 'Solution', description: solution },
    { name: 'Modules', description: modules.join(' • ') },
    { name: 'Reports', description: reports.join(' • ') },
  ]
}

const MFG_TRUST = [
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

const GARMENTS_TABS: SoftwareTabBlock[] = [
  {
    id: 'gar-procurement',
    title: 'Procurement Management',
    items: retailTab(
      'Garment factories often face delays in raw material purchasing, supplier coordination, and procurement tracking which impacts production schedules.',
      'Our Procurement Module automates supplier management, purchase workflows, invoice handling, and material tracking for efficient procurement operations.',
      [
        'Material Purchase Management',
        'Purchase Order Voucher',
        'Purchase Invoice Voucher',
        'Purchase Return Voucher',
        'Fabric Purchase Management',
        'Grey Purchase Management',
      ],
      [
        'Purchase Order Report',
        'Purchase Invoice Report',
        'Purchase Summary',
        'Purchase Register',
        'Purchase Return Report',
        'Cost Report',
      ],
    ),
  },
  {
    id: 'gar-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Managing fabrics, accessories, finished goods, and warehouse inventory manually often causes stock inaccuracies and wastage.',
      'Track inventory movement, warehouse stock, fabric rolls, accessories, and finished goods with complete visibility and reporting.',
      [
        'Opening Stock Voucher',
        'Material Issue Voucher',
        'Fabric & Grey Conversion',
        'Stock Adjustment Voucher',
        'Stock Transfer Voucher',
        'Finished Vouchers',
      ],
      [
        'Fabric Inventory Report',
        'Item Ledger Report',
        'Stock Navigation Report',
        'Inventory Summary Report',
        'Material Stock Report',
      ],
    ),
  },
  {
    id: 'gar-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing garment sales orders, invoices, and customer records manually creates delays and errors.',
      'Digitize garment sales management with customer invoicing, order tracking, and sales reporting.',
      ['Grey Sale Voucher', 'Fabric Sale Voucher', 'Cut Piece Sale Voucher', 'Factory Bill Voucher'],
      ['Sales Report', 'Sale Comparison Report', 'Factory Sale Report', 'Customer Sales Summary'],
    ),
  },
  {
    id: 'gar-finance',
    title: 'Finance Management',
    items: retailTab(
      'Manual accounting creates financial reporting delays and reduces operational transparency.',
      'Manage complete financial operations digitally with accounting automation, ledgers, vouchers, and financial reporting.',
      [
        'Chart Of Accounts',
        'Opening Balance Voucher',
        'Cash Payment & Receipt',
        'Debit/Credit Note',
        'Journal Entry Voucher',
      ],
      [
        'Accounts Ledger Report',
        'Cash Payment Report',
        'Bank Payment Report',
        'Expense Reports',
        'Trial Balance',
        'Profit & Loss Statement',
        'Balance Sheet',
      ],
    ),
  },
  {
    id: 'gar-production',
    title: 'Production Management',
    items: retailTab(
      'Production planning and stitching processes become difficult to manage manually in garment factories.',
      'Monitor production workflows from cutting to stitching, packing, and finished product management.',
      ['Batch Management', 'Packing Material Management', 'Production Batch Wise', 'Production Voucher'],
      ['Batch Detail Report', 'Production Report', 'Packing Report', 'Material Consumption Report'],
    ),
  },
  {
    id: 'gar-hr',
    title: 'HR Management System',
    items: modulesTab(
      'Managing workers, attendance, salaries, and labor records manually becomes time-consuming.',
      'Automate employee attendance, payroll processing, HR records, and staff management operations.',
      ['Staff Hiring', 'Time Attendance', 'Accounts & Wages', 'Compliance Policies'],
      ['Attendance Reports', 'Salary Reports', 'Overtime Reports', 'HR Employee Reports'],
    ),
  },
]

const CANDY_TABS: SoftwareTabBlock[] = [
  {
    id: 'candy-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Candy manufacturers face challenges managing raw material purchases, supplier coordination, and procurement workflows.',
      'Automate ingredient purchasing, supplier management, invoice tracking, and procurement reporting.',
      ['Add New Supplier', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      ['Supplier List', 'Purchase Order Report', 'Pending Purchase Report', 'Purchase Report'],
    ),
  },
  {
    id: 'candy-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing candy sales, distributors, invoices, and dealer operations manually reduces efficiency.',
      'Track candy sales operations digitally with customer management and automated invoicing.',
      [
        'Add New Customers',
        'Sale Order Voucher',
        'Sale Voucher',
        'Multi Sale Voucher Print',
        'Sale Return Voucher',
      ],
      ['Customer List', 'Sale Report', 'Dealer Report', 'Sale Return Report'],
    ),
  },
  {
    id: 'candy-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Inventory management for ingredients, flavors, packaging materials, and finished candy products becomes difficult manually.',
      'Maintain accurate inventory tracking for raw materials and finished products with warehouse control.',
      [
        'Chart Of Items',
        'Warehouse Definition',
        'GRN Goods Received',
        'Return Inward Voucher',
        'Stock Transfer Voucher',
      ],
      [
        'Goods Receipt Report',
        'Stock Report',
        'Stock Value Report',
        'Item Ledger Report',
        'Freight Detail Report',
      ],
    ),
  },
  {
    id: 'candy-production',
    title: 'Production Management',
    items: retailTab(
      'Production scheduling and batch tracking in candy manufacturing is difficult without automation.',
      'Monitor batch processing, material consumption, production flow, and packing activities digitally.',
      ['Batch Management', 'Recipe Management', 'Packing Material Management', 'Production Batch Wise'],
      ['Batch Detail Report', 'Material Issue Report', 'Production Report', 'Packing Report'],
    ),
  },
  {
    id: 'candy-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Manual accounting processes create errors in financial records and expense management.',
      'Digitize accounting workflows with complete voucher handling and financial reporting.',
      [
        'Opening Balance Voucher',
        'Cash Payment Voucher',
        'Cash Receipt Voucher',
        'Bank Payment Voucher',
        'Journal Entry Voucher',
      ],
      [
        'Account Ledger',
        'Cash Flow Management',
        'Expense Report',
        'Trial Balance',
        'Profit & Loss',
        'Balance Sheet',
      ],
    ),
  },
  {
    id: 'candy-hr',
    title: 'HR Management System',
    items: modulesTab(
      'Managing factory labor attendance, payroll, and HR operations manually reduces productivity.',
      'Automate HR operations including attendance, salaries, overtime, and employee records.',
      ['Staff Hiring', 'Time Attendance', 'Accounts & Wages', 'Compliance Management'],
      ['Attendance Reports', 'Salary Reports', 'HR Employee Reports', 'Overtime Reports'],
    ),
  },
]

export function mergeGarmentsManufacturingIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Procurement, inventory, sales, finance, HR, administration, and production — one ERP for garment factories and apparel manufacturers.',
    vouchersSectionEyebrow: 'Garments manufacturing',
    challengesHeading: 'Why garment manufacturers choose DigitalManager',
    challengesIntro:
      'Cut-to-pack workflows need disciplined procurement, WIP, and costing—without disconnected factory spreadsheets.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Factory-wide visibility',
    solutionParagraphs: [
      'Our Garments ERP Software helps garment factories streamline procurement, inventory tracking, production planning, HR operations, sales management, and financial accounting from one centralized cloud-based platform.',
    ],
    heroAsideCaption: 'Garments manufacturing ERP with procurement, stock, production, sales, finance, and HR on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Garments Manufacturing ERP Software | DigitalManager',
    metaDescription:
      'Cloud ERP for garment factories — procurement, inventory, production, sales, finance, and HR for textile and apparel manufacturers in Pakistan.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based ERP Software for Garments Manufacturing Business',
      subhead: 'Streamline Procurement, Production, Sales & Finance.',
      intro:
        'Our Garments ERP Software helps garment factories streamline procurement, inventory tracking, production planning, HR operations, sales management, and financial accounting from one centralized cloud-based platform. Designed for textile and apparel manufacturers in Pakistan.',
      trust: [...MFG_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Procurement Management System',
        description: 'Material, fabric, and grey purchasing with supplier coordination and returns.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management System',
        description: 'Fabrics, accessories, finished goods, and warehouse stock visibility.',
      },
      {
        icon: 'Store',
        title: 'Sales Management System',
        description: 'Grey, fabric, and cut-piece sales with factory billing and customer tracking.',
      },
      {
        icon: 'Landmark',
        title: 'Finance Management System',
        description: 'Ledgers, banking, vouchers, and statutory-ready financial reporting.',
      },
      {
        icon: 'Users',
        title: 'HR Management & Information System',
        description: 'Hiring, attendance, wages, compliance, and payroll for factory labour.',
      },
      {
        icon: 'Settings',
        title: 'Administration Management System',
        description: 'Masters, approvals, and policy controls across branches and units.',
      },
      {
        icon: 'Factory',
        title: 'Production Management System',
        description: 'Batches, packing, consumption, and production vouchers from cutting to finish.',
      },
    ],
    vouchersReports: {
      heading: 'Garments manufacturing operations by area',
      subheading:
        'Six programme areas — procurement through HR — with challenges, solutions, and representative transactions and reports.',
      tabs: GARMENTS_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for garments manufacturing ERP on DigitalManager.',
    },
  }
}

export function mergeCandyManufacturingIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, sales, inventory, production, accounts, and HR — built for candy and confectionery manufacturers.',
    vouchersSectionEyebrow: 'Candy & confectionery',
    challengesHeading: 'Why confectionery manufacturers choose DigitalManager',
    challengesIntro:
      'Ingredients, batches, and packing need one governed dataset—so margin and throughput stay explainable to leadership.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Sweet production under control',
    solutionParagraphs: [
      'Manage candy production, raw materials, inventory, packaging, sales, finance, and HR operations with our advanced Candy Manufacturing ERP Software designed for confectionery businesses and food production factories.',
    ],
    heroAsideCaption: 'Confectionery ERP with purchase, production, stock, sales, accounts, and HR on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Candy & Confectionery Manufacturing ERP | DigitalManager',
    metaDescription:
      'Cloud ERP for candy manufacturers — purchase, sales, inventory, production, accounts, and HR for confectionery and food production factories.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based ERP Software for Candy and Confectionery Manufacturing',
      subhead: 'Automate Production, Inventory, Sales & Finance.',
      intro:
        'Manage candy production, raw materials, inventory, packaging, sales, finance, and HR operations with our advanced Candy Manufacturing ERP Software designed for confectionery businesses and food production factories.',
      trust: [...MFG_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Ingredient and packaging procurement with supplier and return control.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Orders, billing, dealers, and multi-voucher sales for distributors.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Raw materials, flavours, packaging, and finished candy stock.',
      },
      {
        icon: 'Factory',
        title: 'Production Management',
        description: 'Batches, recipes, packing, and material consumption tracking.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Vouchers, ledgers, cash flow, and financial statements.',
      },
      {
        icon: 'Users',
        title: 'HR Management',
        description: 'Attendance, payroll, overtime, and employee records for factory teams.',
      },
    ],
    vouchersReports: {
      heading: 'Candy manufacturing operations by area',
      subheading:
        'Six programme areas — purchase through HR — with challenges, solutions, and representative transactions and reports.',
      tabs: CANDY_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for candy and confectionery manufacturing on DigitalManager.',
    },
  }
}
