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

const MEDICAL_TRUST = [
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

const PHARMACY_TABS: SoftwareTabBlock[] = [
  {
    id: 'pharm-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Pharmacy businesses face complex procurement challenges including medicine supplier coordination, purchase tracking, batch monitoring, and expiry management.',
      'Our Pharmacy Purchase Management System simplifies medicine procurement with supplier tracking, purchase invoices, return management, and purchase analytics.',
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
    id: 'pharm-sales',
    title: 'Sales Management',
    items: retailTab(
      'Managing medicine sales manually can lead to billing mistakes, inventory mismatches, and customer service delays.',
      'Our Pharmacy Sales Management Module supports barcode billing, medicine-wise sales tracking, quick checkout, sale returns, and customer purchase history.',
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
    id: 'pharm-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Medicine inventory requires strict control over batches, expiry dates, stock levels, and storage handling.',
      'Our Pharmacy Inventory Management System provides real-time stock tracking, expiry alerts, batch-wise inventory handling, warehouse management, and item ledger reporting.',
      [
        'Chart of Items',
        'Freight Assigning to Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN / Goods Received Note / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'GRN Goods Issue Note / Outward Gate Pass Voucher',
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
    id: 'pharm-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Pharmacies require accurate financial tracking for suppliers, customer balances, expenses, and tax reporting.',
      'Our Pharmacy Accounts Management System provides complete financial control with ledgers, vouchers, cash flow management, receivables, payables, and profit analysis.',
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

const HOMEOPATHIC_TABS: SoftwareTabBlock[] = [
  {
    id: 'homeo-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Homeopathic clinics and stores require efficient medicine procurement, vendor coordination, and purchase tracking to avoid stock shortages and delays.',
      'Our Homeopathic Purchase Management System simplifies vendor handling, medicine purchasing, return processing, and stock replenishment.',
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
    id: 'homeo-sales',
    title: 'Sales Management',
    items: retailTab(
      'Manual medicine dispensing and sales operations can create billing errors and inefficient customer handling.',
      'Our Homeopathic Sales Management Module enables accurate medicine billing, customer handling, treatment-based sales, and invoice management.',
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
    id: 'homeo-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Homeopathic medicine inventory needs organized stock handling, dosage tracking, bottle management, and expiry monitoring.',
      'Our Inventory Management System tracks stock movement, medicine availability, item conversion, warehouses, and inventory reports.',
      [
        'Chart of Items',
        'Freight Assigning to Transporter',
        'City Definition',
        'Warehouse / Location / Departments Definition',
        'GRN / Goods Received Note / Inward Gate Pass Voucher',
        'Return Outward Voucher',
        'GRN Goods Issue Note / Outward Gate Pass Voucher',
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
    id: 'homeo-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Homeopathic clinics require organized accounting for daily receipts, medicine purchases, expenses, and customer balances.',
      'Our Accounts Management Module delivers complete financial visibility with vouchers, ledgers, invoice tracking, receivable/payable reports, and profit analysis.',
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

export function mergePharmacyBusinessIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Purchase, sales, inventory, and accounts — built for pharmacies and medical stores with batch and expiry discipline.',
    vouchersSectionEyebrow: 'Pharmacy business',
    challengesHeading: 'Why pharmacies choose DigitalManager',
    challengesIntro:
      'Batch-wise stock, expiry alerts, and regulated sales need one spine—not counters reconciled against spreadsheets every night.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Safe, smart pharmacy operations',
    solutionParagraphs: [
      'An all-in-one POS and inventory solution built specifically for pharmacies and medical stores — batch and expiry control, barcode billing, supplier records, and accounts in a secure cloud-based system.',
    ],
    heroAsideCaption: 'Pharmacy POS and inventory with purchase, sales, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Pharmacy Business Management Software | DigitalManager ERP',
    metaDescription:
      'Track medicines, monitor expiry, simplify billing — pharmacy POS and inventory for batch control, barcode sales, and accounts in the UAE.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Pharmacy Business Management Software for Safe, Smart, and Streamlined Sales',
      subhead: 'Track Medicines. Monitor Expiry. Simplify Billing.',
      intro:
        'An all-in-one POS and inventory solution built specifically for pharmacies and medical stores. Manage medicine stock by batch and expiry, set up sale alerts for low stock or near-expiry drugs, handle barcode sales, maintain supplier records, and comply with health regulations — all in a secure cloud-based system built for pharmacies across the UAE.',
      trust: [...MEDICAL_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Medicine procurement, suppliers, returns, batch tracking, and purchase analytics.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Barcode billing, medicine-wise sales, quick checkout, returns, and customer history.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Batch-wise stock, expiry alerts, warehouses, transfers, and item ledgers.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Ledgers, cash flow, receivables, payables, and profit analysis for pharmacies.',
      },
    ],
    vouchersReports: {
      heading: 'Pharmacy operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: PHARMACY_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for pharmacy business management on DigitalManager.',
    },
  }
}

export function mergeHomeopathicBusinessIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Features',
    featuresLead:
      'Patient records, purchase, sales, inventory, CRM, and accounts — tailored for homeopathic clinics, dispensaries, and retailers.',
    vouchersSectionEyebrow: 'Homeopathic business',
    challengesHeading: 'Why homeopathic practices choose DigitalManager',
    challengesIntro:
      'Dispensing, patient history, and stock discipline need one platform—not paper registers and disconnected billing.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Accurate dispensing and records',
    solutionParagraphs: [
      'Organize medicine inventory and dosage records, monitor patient treatment history, manage prescriptions, and streamline billing through an intelligent cloud-based platform tailored for homeopathic businesses in the UAE.',
    ],
    heroAsideCaption: 'Homeopathic ERP with patients, prescriptions, stock, CRM, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Homeopathic Business Management Software | DigitalManager ERP',
    metaDescription:
      'Manage medicines, track patients, simplify sales — homeopathic clinic software for inventory, prescriptions, CRM, and accounts in the UAE.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Homeopathic Business Management Software Built for Accurate Dispensing & Recordkeeping',
      subhead: 'Manage Medicines. Track Patients. Simplify Sales.',
      intro:
        'A complete software solution for homeopathic clinics, dispensaries, and medicine retailers. Organize medicine inventory and dosage records, monitor patient treatment history, manage prescriptions, and streamline billing through an intelligent cloud-based platform tailored for homeopathic businesses in the UAE.',
      trust: [...MEDICAL_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'HeartPulse',
        title: 'Patient Management',
        description: 'Treatment history, prescriptions, and patient records linked to dispensing.',
      },
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Vendor handling, medicine purchases, returns, and replenishment.',
      },
      {
        icon: 'Store',
        title: 'Sales Management',
        description: 'Treatment-based billing, customers, invoices, and sale returns.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Dosage tracking, bottles, expiry, warehouses, and stock movement.',
      },
      {
        icon: 'Users',
        title: 'Customer Relationship Management',
        description: 'Inquiries, follow-ups, and customer communication aligned to care.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Vouchers, ledgers, receivables, payables, and financial statements.',
      },
    ],
    vouchersReports: {
      heading: 'Homeopathic operations by area',
      subheading:
        'Purchase, sales, inventory, and accounts — each tab summarises challenges, solutions, and representative transactions and reports.',
      tabs: HOMEOPATHIC_TABS,
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for homeopathic business management on DigitalManager.',
    },
  }
}
