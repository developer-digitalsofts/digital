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

const AGRIFOOD_TRUST = [
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

const DAIRY_TABS: SoftwareTabBlock[] = [
  {
    id: 'dairy-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Dairy farm businesses often struggle with feed purchases, medicine procurement, supplier tracking, and maintaining accurate expense records manually.',
      'Our Dairy Farm Management Software simplifies procurement operations with organized supplier management, automated purchase records, invoice tracking, and expense monitoring.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Report',
        'Purchase Report',
        'Purchase Summary Report',
        'Purchase Register',
        'Purchase Return Report',
      ],
    ),
  },
  {
    id: 'dairy-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing milk sales, livestock sales, and customer records manually often causes errors and delays.',
      'Automate dairy sales operations with real-time invoice generation, customer management, and daily sales reporting.',
      ['Add New Customers', 'Sale Order Voucher', 'Sale Voucher', 'Sale Return Voucher'],
      [
        'Customer List',
        'Salesman Definition',
        'Sale Order Report',
        'Pending Sale Report',
        'Sale Report',
        'Sale Return Report',
      ],
    ),
  },
  {
    id: 'dairy-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Inventory handling for feed, medicines, and farm supplies becomes difficult without proper stock tracking.',
      'Track feed stock, medicines, farm equipment, and inventory movement with complete stock visibility.',
      [
        'Chart Of Items',
        'Warehouse Definition',
        'Opening Stock Voucher',
        'Stock Adjustment Voucher',
        'Stock Transfer Voucher',
      ],
      [
        'Goods Receipt Report',
        'Stock Report',
        'Stock Value Report',
        'Item Ledger Report',
        'Inventory Summary Report',
      ],
    ),
  },
  {
    id: 'dairy-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Manual accounting in dairy farms creates difficulty in expense tracking and financial reporting.',
      'Manage payments, receipts, expenses, customer ledgers, and complete farm accounting digitally.',
      [
        'Opening Balance Voucher',
        'Cash Payment Voucher',
        'Cash Receipt Voucher',
        'Bank Payment Voucher',
        'Journal Entry Voucher',
      ],
      [
        'Account Ledger',
        'Cash Payment Report',
        'Cash Receipt Report',
        'Trial Balance',
        'Profit & Loss',
        'Balance Sheet',
      ],
    ),
  },
]

const AGRICULTURE_TABS: SoftwareTabBlock[] = [
  {
    id: 'agri-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Agriculture businesses often face difficulty managing supplier records, fertilizer purchases, and procurement tracking.',
      'Digitize agricultural procurement workflows with automated purchasing and supplier management.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Report',
        'Purchase Report',
        'Purchase Summary Report',
        'Purchase Register',
      ],
    ),
  },
  {
    id: 'agri-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing crop sales and customer transactions manually leads to inefficiencies.',
      'Track crop sales, customer invoices, and market transactions digitally with real-time reporting.',
      ['Add New Customers', 'Sale Order Voucher', 'Sale Voucher', 'Sale Return Voucher'],
      ['Customer List', 'Sale Report', 'Pending Sale Report', 'Sale Return Report'],
    ),
  },
  {
    id: 'agri-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Agricultural inventory like seeds, pesticides, fertilizers, and tools is difficult to monitor manually.',
      'Manage agricultural inventory with complete stock control and warehouse management.',
      ['Chart Of Items', 'Warehouse Definition', 'Opening Stock Voucher', 'Stock Adjustment Voucher'],
      ['Stock Report', 'Inventory Summary Report', 'Stock Value Report', 'Item Ledger Report'],
    ),
  },
  {
    id: 'agri-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Manual farm accounting causes errors in expense tracking and financial reporting.',
      'Automate agriculture business accounting with complete ledger, expense, and profitability reports.',
      [
        'Opening Balance Voucher',
        'Cash Payment Voucher',
        'Cash Receipt Voucher',
        'Bank Payment Voucher',
        'Journal Entry Voucher',
      ],
      ['Account Ledger', 'Cash Flow Management', 'Trial Balance', 'Profit & Loss', 'Balance Sheet'],
    ),
  },
]

export function mergeDairyFarmIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Modules & Features',
    featuresLead:
      'Herd, feed, purchase, sales, inventory, milk production, and accounts — one cloud platform for dairy farms and milk production units.',
    vouchersSectionEyebrow: 'Dairy farm ERP',
    challengesHeading: 'Why dairy farms choose DigitalManager',
    challengesIntro:
      'Animal records, milk production, feed, and farm profitability need one spine—not spreadsheets reconciled after close.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Farm operations under control',
    solutionParagraphs: [
      'Track animal records, milk production, feed inventory, vaccination schedules, breeding cycles, expenses, and farm profitability using our advanced Dairy Farm Management Software.',
    ],
    heroAsideCaption: 'Dairy farm management with herd, feed, milk production, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Cloud-Based Dairy Farm Management Software | DigitalManager ERP',
    metaDescription:
      'Track animals, milk production, feed, vaccinations, breeding, expenses, and profitability — dairy farm ERP for Pakistan.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Dairy Farm Management Software',
      subhead: 'Smart Dairy Operations with Complete Farm Control.',
      intro:
        'Track animal records, milk production, feed inventory, vaccination schedules, breeding cycles, expenses, and farm profitability using our advanced Dairy Farm Management Software. Designed for dairy farms, livestock businesses, and milk production units in Pakistan.',
      trust: [...AGRIFOOD_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'Bird',
        title: 'Herd Management',
        description: 'Animal records, breeding cycles, vaccination schedules, and livestock tracking.',
      },
      {
        icon: 'Wheat',
        title: 'Feed Management',
        description: 'Feed planning, consumption, and supplier-linked procurement visibility.',
      },
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Feed, medicine, and supplier purchases with invoice and expense control.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Milk and livestock sales with customer records and daily reporting.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Feed, medicines, and farm supplies with warehouse and stock movement.',
      },
      {
        icon: 'Milk',
        title: 'Milk Production Management',
        description: 'Production tracking tied to herd records and sales fulfilment.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Farm payments, receipts, ledgers, and financial statements.',
      },
    ],
    vouchersReports: {
      heading: 'Dairy farm operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: DAIRY_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for dairy farm management on DigitalManager.',
    },
  }
}

export function mergeAgricultureIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Modules & Features',
    featuresLead:
      'Land, crop, purchase, sales, inventory, livestock, and accounts — smart agriculture ERP for modern farming.',
    vouchersSectionEyebrow: 'Smart agriculture',
    challengesHeading: 'Why agriculture businesses choose DigitalManager',
    challengesIntro:
      'Crops, inputs, labour, and farm profitability need disciplined records—not manual registers and guesswork.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Modern farming on one platform',
    solutionParagraphs: [
      'Manage crops, land records, fertilizers, pesticides, labor activities, inventory, expenses, irrigation schedules, and farm profitability with our modern Smart Agriculture Farm Management ERP Software.',
    ],
    heroAsideCaption: 'Agriculture ERP with land, crop, livestock, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Cloud-Based Smart Agriculture Farm Management Software | DigitalManager',
    metaDescription:
      'Manage crops, land, fertilizers, pesticides, labour, inventory, irrigation, and farm profitability — smart agriculture ERP for Pakistan.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Smart Agriculture Farm Management Software for Modern Farming',
      subhead: 'Grow Smarter. Track Everything. Maximize Farm Profitability.',
      intro:
        'Manage crops, land records, fertilizers, pesticides, labor activities, inventory, expenses, irrigation schedules, and farm profitability with our modern Smart Agriculture Farm Management ERP Software.',
      trust: [...AGRIFOOD_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'Map',
        title: 'Land Management',
        description: 'Land parcels, seasons, and plot-wise activity tracking.',
      },
      {
        icon: 'Sprout',
        title: 'Crop Management',
        description: 'Crop cycles, inputs, and harvest planning with cost visibility.',
      },
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Fertilizer, seed, and supplier procurement with digital vouchers.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Crop sales, customer invoices, and market transaction reporting.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Seeds, pesticides, fertilizers, and tools with warehouse control.',
      },
      {
        icon: 'Bird',
        title: 'Livestock Management',
        description: 'Allied livestock records alongside crop operations where needed.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Farm accounting, cash flow, and profitability reporting.',
      },
    ],
    vouchersReports: {
      heading: 'Agriculture farm operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: AGRICULTURE_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for smart agriculture farm management on DigitalManager.',
    },
  }
}
