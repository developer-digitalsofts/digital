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

const VISA_TRUST = [
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

const VISA_TABS: SoftwareTabBlock[] = [
  {
    id: 'visa-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Visa and immigration consultancy firms often face difficulties managing office purchases, supplier records, operational expenses, and procurement workflows manually.',
      'Our Purchase Management Module helps automate procurement processes, supplier management, purchase tracking, invoice handling, and operational expense monitoring.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Report',
        'Purchase Report',
        'Purchase Summary Report',
        'Purchase Register',
        'Purchase Return Report',
        'Purchase Return Summary',
        'Purchase Return Register',
        'Purchase Return Comparison',
      ],
    ),
  },
  {
    id: 'visa-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing client payments, consultancy invoices, and customer transactions manually creates delays and increases operational inefficiencies.',
      'Digitize consultancy sales operations with automated invoicing, customer handling, case-wise billing, and real-time sales tracking.',
      [
        'Customer Definition',
        'Sale Order Voucher',
        'Credit Sale Voucher',
        'Sale Return Voucher',
        'Cash Sale Voucher',
      ],
      [
        'Sale Order Report',
        'Pending Sale Order Report',
        'Credit Sale Report',
        'Credit Sale Summary Report',
        'Salesman Performance Report',
        'Cash Sale Report',
        'Sale Return Report',
        'Sale Return Register',
        'Sale Return Comparison Report',
      ],
    ),
  },
  {
    id: 'visa-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Tracking office inventory, visa files, application records, and operational assets manually often leads to mismanagement and delays.',
      'Maintain organized inventory and document tracking with complete visibility and automated inventory workflows.',
      [
        'Visa Inventory Tracking',
        'Automated Notifications',
        'Opening Stock Voucher',
        'Visa Adjustment Voucher',
        'Stock Navigation / Transfer Voucher',
        'Assemble / De-Assemble Voucher',
      ],
      [
        'Minimum & Maximum Stock Level Report',
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
    id: 'visa-finance',
    title: 'Finance Management',
    items: retailTab(
      'Manual accounting processes in visa consultancy businesses often create financial inaccuracies and reporting delays.',
      'Our Finance Management Module automates payments, receipts, ledgers, expense tracking, profitability analysis, and financial reporting for visa consultants and immigration firms.',
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
  {
    id: 'visa-documentation',
    title: 'Documentation Management',
    items: featuresTab(
      'Passport copies, embassy forms, and agreements scattered across folders slow case processing and compliance checks.',
      'Manage passport copies, visa documents, application forms, embassy requirements, agreements, and client records digitally with secure document handling and centralized storage.',
      [
        'Client Document Upload',
        'Passport & Visa Record Management',
        'Embassy Documentation Tracking',
        'Secure File Storage',
        'Case-wise Document Organization',
        'Expiry & Renewal Notifications',
      ],
      'Document checklists, expiry alerts, and case-wise document registers — as configured for your consultancy.',
    ),
  },
  {
    id: 'visa-case',
    title: 'Case Management',
    items: featuresTab(
      'Inquiries, appointments, and embassy follow-ups are hard to track when case status lives in spreadsheets or chat threads.',
      'Track every visa and immigration case from inquiry to approval with complete workflow management.',
      [
        'Case Status Tracking',
        'Application Progress Monitoring',
        'Appointment Scheduling',
        'Embassy Follow-Up Tracking',
        'Visa Approval & Rejection Records',
        'Client Communication History',
      ],
      'Case pipeline, status history, and embassy milestone reports — as configured for your immigration programme.',
    ),
  },
  {
    id: 'visa-crm',
    title: 'CRM Management',
    items: featuresTab(
      'Leads and follow-ups slip through the cracks when customer history is not tied to cases and billing.',
      'Improve customer relationships and manage leads, inquiries, and follow-ups effectively.',
      [
        'Lead Management',
        'Customer Inquiry Tracking',
        'Automated Follow-Ups',
        'Client Communication Records',
        'WhatsApp & Email Communication Logs',
        'Customer History Management',
      ],
      'Lead conversion, inquiry ageing, and consultant activity summaries — as configured for your office.',
    ),
  },
]

export function mergeVisaImmigrationIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, sales, inventory, finance, documentation, case management, and CRM — one ERP for visa and immigration consultancies.',
    vouchersSectionEyebrow: 'Visa & immigration consultancy',
    challengesHeading: 'Why immigration consultancies choose DigitalManager',
    challengesIntro:
      'Cases, documents, billing, and client communication need one spine—not disconnected files and manual registers.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Consultancy operations under control',
    solutionParagraphs: [
      'Streamline consultancy operations, case handling, document management, client communication, invoicing, and financial tracking from one centralized cloud-based platform.',
    ],
    heroAsideCaption: 'Visa consultancy ERP with cases, documents, CRM, stock, sales, and finance on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'ERP Software for Visa & Immigration Consultants | DigitalManager',
    metaDescription:
      'Cloud ERP for visa consultants — case management, documentation, CRM, purchase, sales, inventory, and finance for immigration consultancies.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'ERP Software for Visa & Immigration Consultants',
      subhead: 'Manage Cases, Documents, Clients & Finance in One Platform.',
      intro:
        'Our cloud-based ERP Software for Visa & Immigration Consultants is designed to streamline consultancy operations, case handling, document management, client communication, invoicing, and financial tracking. Manage visa applications, immigration records, customer interactions, and office operations efficiently from one centralized platform.',
      trust: [...VISA_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management & Information',
        description: 'Office purchases, suppliers, invoices, and operational expense control.',
      },
      {
        icon: 'Store',
        title: 'Sales Management & Information',
        description: 'Client billing, case-wise sales, credit and cash collections.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management & Information',
        description: 'Visa stock, files, application records, and office asset tracking.',
      },
      {
        icon: 'Landmark',
        title: 'Finance Management & Information',
        description: 'Ledgers, banking, receivables, payables, and financial statements.',
      },
      {
        icon: 'FileText',
        title: 'Documentation Management & Information',
        description: 'Passports, embassy forms, agreements, and secure case-wise storage.',
      },
      {
        icon: 'Briefcase',
        title: 'Case Management & Information',
        description: 'Inquiry to approval workflows, appointments, and embassy follow-up.',
      },
      {
        icon: 'Users',
        title: 'Customer Relationship Management & Information',
        description: 'Leads, inquiries, follow-ups, and communication history.',
      },
    ],
    vouchersReports: {
      heading: 'Visa consultancy operations by area',
      subheading:
        'Seven programme areas — purchase through CRM — with challenges, solutions, and representative flows, features, and reports.',
      tabs: VISA_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for visa and immigration consultancy ERP on DigitalManager.',
    },
  }
}
