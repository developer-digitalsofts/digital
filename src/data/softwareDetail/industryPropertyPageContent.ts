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

const PROPERTY_TRUST = [
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

const REAL_ESTATE_TABS: SoftwareTabBlock[] = [
  {
    id: 're-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Real estate businesses often face challenges in managing land purchases, construction material procurement, vendor coordination, and purchase records manually.',
      'Our Purchase Management Module helps manage land purchases, material procurement, supplier handling, purchase returns, and construction purchasing workflows efficiently.',
      ['Material Purchase Voucher', 'Land Purchase Voucher', 'Material Purchase Return Voucher'],
      [
        'Material Purchase Reports',
        'Land Purchase Reports',
        'Purchase Returns Reports',
        'Construction Works Reports',
      ],
    ),
  },
  {
    id: 're-sales',
    title: 'Property Sales Management',
    items: retailTab(
      'Managing property bookings, customer installment plans, plot records, commissions, and resale operations manually creates operational inefficiencies.',
      'Our Property Sales Management Module streamlines plot management, customer bookings, installment tracking, resale handling, commission management, and property sales operations.',
      [
        'Property Information Form',
        'Area / Location / Installment Plan',
        'Property Sale Inquiry Form',
        'Property Sale And Installment Plan Voucher',
        'Property Resale And Installment Plan Voucher',
        'Property Sale Return Voucher',
        'Property Cancellation Voucher',
      ],
      [
        'Property Sale Reports',
        'Property Resale Reports',
        'Property Cancelled Reports',
        'Property Sale Return Reports',
        'Property Sale Commission Reports',
        'Property Information Reports',
        'Property Listing Reports',
      ],
    ),
  },
  {
    id: 're-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Manual accounting in real estate businesses creates challenges in installment tracking, expense monitoring, receivables handling, and financial reporting.',
      'Our Accounts Management Module provides complete financial management including cash handling, installment tracking, cheque management, receivables, payables, and profitability reporting.',
      [
        'Property Receipt Voucher',
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
        'Debitor Aging Sheet',
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

const CONSTRUCTION_TABS: SoftwareTabBlock[] = [
  {
    id: 'con-construction',
    title: 'Construction Management',
    items: retailTab(
      'Construction companies face challenges managing project workflows, labor coordination, machinery utilization, material procurement, and project costing manually.',
      'Our Construction Management Module helps monitor projects, estimate costs, manage contractors, track materials, and improve project execution efficiency.',
      [
        'Project Quotation Preparation',
        'Customer Contract Form',
        'Construction Material Defining Form',
        'Construction Material Purchase Voucher',
        'Construction Material Consumption Voucher',
        'Project Payments Paid Against Voucher',
        'Project Payments Received Against Voucher',
      ],
      [
        'Project Quotations Report',
        'Projects Information Report',
        'Material Purchase Reports',
        'Material Issuance / Consumption Reports',
        'Project Labor / Services Reports',
        'Project Payments Reports',
        'Project Receipts Report',
        'Project Cost / Expenses Reports',
      ],
    ),
  },
  {
    id: 'con-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Managing financial records, contractor payments, project expenses, and supplier balances manually creates accounting complexities in construction businesses.',
      'Our Accounts Management Module provides integrated accounting with project-based expense tracking, voucher management, cash flow monitoring, and financial reporting.',
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
        'Debitor Aging Sheet',
        'Creditor Aging Sheet',
        'Trial Balance 2 Column',
        'Trial Balance 6 Column',
        'Item Wise Profit & Loss',
        'Profit & Loss Sheet',
        'Balance Sheet',
      ],
    ),
  },
  {
    id: 'con-stock',
    title: 'Stock & Production Management',
    items: retailTab(
      'Construction businesses require proper inventory handling for cement, steel, machinery, hardware items, and production materials.',
      'Our Stock & Production Management Module helps manage construction inventory, warehouse operations, stock transfers, and production material consumption efficiently.',
      [
        'Chart Of Goods',
        'Warehouse Definition',
        'Opening Stock Voucher',
        'Stock Adjustment Voucher',
        'Stock Transfer Voucher',
        'Stock Breakage And Returns',
      ],
      [
        'Low And High Stock Level Reports',
        'Product Ledger Report',
        'Inventory Summary Report',
        'Stock List Report',
        'Stock Value Report',
        'Stock Transfer Reports',
        'Stock Adjustment Report',
        'Stock Breakage And Returns Reports',
      ],
    ),
  },
  {
    id: 'con-payroll',
    title: 'Payroll Management',
    items: retailTab(
      'Managing labor attendance, salaries, overtime, staff advances, and payroll operations manually can reduce operational efficiency and accuracy.',
      'Our Payroll Management Module automates attendance tracking, shift management, salary calculations, overtime handling, and payroll reporting for construction businesses.',
      [
        'Roaster Defining',
        'Salary Days Setting',
        'Department Management',
        'Shifts Management',
        'Shift Group Management',
        'Staff Hiring Form',
        'Staff Attendance',
        'Staff Advance Voucher',
        'Staff Loan Voucher',
        'Staff Incentive Voucher',
        'Staff Penalty Voucher',
        'Staff Mess Charges',
        'Overtime Approval Voucher',
        'Update Attendance Voucher',
      ],
      [
        'Attendance Reports',
        'Roasters Detail Reports',
        'Overtime Reports',
        'Staff Loan Reports',
        'Mess Charges Reports',
        'Staff Advances Reports',
        'Staff Penalty Reports',
        'Staff Incentive Reports',
        'Salary Sheet Reports',
        'Salary Slip Reports',
      ],
    ),
  },
]

export function mergeRealEstateBusinessIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, property sales, accounts, and HR — complete ERP for builders, dealers, housing societies, and developers.',
    vouchersSectionEyebrow: 'Real estate ERP',
    challengesHeading: 'Why real estate businesses choose DigitalManager',
    challengesIntro:
      'Plots, installments, commissions, and land purchases need one timeline—not shadow ledgers and manual booking registers.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Property operations under control',
    solutionParagraphs: [
      'Manage plots, customer bookings, installment plans, commissions, land purchases, accounts, and property sales from one centralized cloud-based platform.',
    ],
    heroAsideCaption: 'Real estate ERP with plots, installments, sales, purchases, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Software for Real Estate Business | DigitalManager ERP',
    metaDescription:
      'Manage properties, track installments, control operations — ERP for real estate builders, dealers, housing societies, and developers in the UAE.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Software for Real Estate Business',
      subhead: 'Manage Properties. Track Installments. Control Real Estate Operations.',
      intro:
        'A complete ERP solution for real estate builders, property dealers, housing societies, and construction developers. Manage plots, customer bookings, installment plans, commissions, land purchases, accounts, and property sales from one centralized cloud-based platform.',
      trust: [...PROPERTY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Land and material purchases, suppliers, returns, and construction procurement.',
      },
      {
        icon: 'Building2',
        title: 'Property Sales Management',
        description: 'Plots, bookings, installments, resale, commissions, and cancellations.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Installments, cheques, receivables, payables, and financial statements.',
      },
      {
        icon: 'Users',
        title: 'Human Resource Management',
        description: 'Staff records, attendance, and payroll aligned to sales and site teams.',
      },
    ],
    vouchersReports: {
      heading: 'Real estate operations by area',
      subheading:
        'Purchase, property sales, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: REAL_ESTATE_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for real estate business software on DigitalManager.',
    },
  }
}

export function mergeConstructionBusinessIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Multi-site construction, procurement, inventory, labour, sales, accounts, and payroll — one ERP for builders and contractors.',
    vouchersSectionEyebrow: 'Construction ERP',
    challengesHeading: 'Why builders choose DigitalManager',
    challengesIntro:
      'Project costing, materials, labour, and site cash need one governed dataset—so margin stays explainable to investors and banks.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Sites and books aligned',
    solutionParagraphs: [
      'Manage project costing, labor hiring, machinery, stock, material purchases, payroll, billing, and site operations through a centralized cloud-based system.',
    ],
    heroAsideCaption: 'Construction ERP with projects, stock, labour, payroll, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Builders & Construction Management Software | DigitalManager ERP',
    metaDescription:
      'Manage projects, control materials, streamline construction — ERP for builders, contractors, developers, and construction companies.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based Builders and Construction Management Software',
      subhead: 'Manage Projects. Control Materials. Streamline Construction Operations.',
      intro:
        'An advanced ERP solution designed for builders, contractors, developers, and construction companies. Manage project costing, labor hiring, machinery, stock, material purchases, payroll, billing, and site operations through a centralized cloud-based system.',
      trust: [...PROPERTY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'Building2',
        title: 'Multi Construction Sites Management',
        description: 'Multiple sites, projects, and cost centres with consolidated visibility.',
      },
      {
        icon: 'ShoppingCart',
        title: 'Material and Machinery Purchase Management',
        description: 'Procurement for materials, plant, and machinery across projects.',
      },
      {
        icon: 'Package',
        title: 'Store Inventory Management',
        description: 'Site stores, stock issues, transfers, and warehouse control.',
      },
      {
        icon: 'HardHat',
        title: 'Labour Work and Professional Services Hiring Management',
        description: 'Contractors, labour hiring, and professional services on projects.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Project billing, customer contracts, and progress receipts.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Project expenses, vouchers, banking, and financial reporting.',
      },
    ],
    vouchersReports: {
      heading: 'Construction operations by area',
      subheading:
        'Construction, accounts, stock & production, and payroll — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: CONSTRUCTION_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for construction management software on DigitalManager.',
    },
  }
}
