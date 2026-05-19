import type { SoftwareDetailPageData, SoftwareNamedItem, SoftwarePremiumPageConfig } from './types'

const tx = (name: string): SoftwareNamedItem => ({ name, description: '' })

const INVENTORY_TRANSACTIONS: SoftwareNamedItem[] = [
  tx('Chart of Items'),
  tx('Warehouse and Racks'),
  tx('Opening Stock Voucher'),
  tx('Stock Requisition Voucher'),
  tx('GatePass Inward'),
  tx('Stock Issuance Voucher'),
  tx('Stock Consumption Voucher'),
  tx('Product Conversion'),
  tx('Repair Outward/Inward Voucher'),
  tx('Stock Transfer Voucher'),
  tx('Product Assemble and De-assemble'),
]

const INVENTORY_REPORTS: SoftwareNamedItem[] = [
  tx('Low/High Stock Level Reports'),
  tx('Stock Requisition Reports'),
  tx('Stock Order Reports'),
  tx('Stock Inward Reports'),
  tx('Stock Issuance Reports'),
  tx('Stock Consumption Reports'),
  tx('Stock Transfer Reports'),
  tx('Product Ledger Report'),
  tx('Inventory Summary Report'),
  tx('Stock Value Reports'),
  tx('Stock Adjustment Reports'),
  tx('Repair Outward Reports'),
  tx('Repair Inward Reports'),
]

const PROBLEM =
  'Inefficient inventory management can cause stock issues, tracking problems, operational delays, and increased costs. Manual systems often create errors and reduce business efficiency.'

const SOLUTION =
  'Our Inventory Management Software provides real-time stock visibility, warehouse management, barcode support, approvals, reporting, and complete inventory control.'

const INTRO =
  'All-in-one inventory control solution for warehouses, retail stores, manufacturers, distributors, and service-based businesses.\n\nReal-time tracking, automated recording, and seamless integration with sales, purchases, and accounts — built for businesses of every scale.'

/**
 * Post-template content for the Inventory Management module page only.
 * Keeps the premium layout shell; trims unrelated sections via empty arrays + layout copy.
 */
export function mergeInventoryManagementPremiumPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...pl,
    featuresHeading: 'Software Features',
    featuresLead:
      'Chart of items, multiple locations with rack awareness, requisitions and approvals, barcode labelling and scanning, stock alerts, and product assemble / de-assemble — aligned to how inventory teams work day to day.',
    vouchersSectionEyebrow: 'Inventory module',
    challengesHeading: 'Inventory Management',
    challengesIntro: PROBLEM,
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Solution',
    solutionParagraphs: [SOLUTION],
    heroChips: [],
    heroAsideCaption: 'Cloud inventory control with real-time stock, warehouse discipline, and reporting your finance team can trust.',
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

  return {
    ...data,
    metaTitle: 'Cloud-Based Inventory Management Software | DigitalManager ERP',
    metaDescription:
      'Track stock, avoid shortages, and maximize profits with cloud-based inventory management — real-time tracking, automated recording, and integration with sales, purchases, and accounts.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Inventory Management Software That Keeps Your Stock in Check',
      subhead: 'Track Stock. Avoid Shortages. Maximize Profits.',
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
        icon: 'Layers',
        title: 'Chart of Items',
        description: 'Raw Material, Finished Goods, Fixed Assets, Tools, Equipment etc.',
      },
      {
        icon: 'MapPin',
        title: 'Multiple Stock Locations',
        description: 'Warehouses and Rack Management',
      },
      {
        icon: 'ClipboardCheck',
        title: 'Requisition and Approvals',
        description: 'Structured internal requests with approval paths before stock moves.',
      },
      {
        icon: 'ScanLine',
        title: 'Barcode Labeling and Scanning',
        description: 'Label, scan, and validate movements to reduce mis-postings at the gate and on the floor.',
      },
      {
        icon: 'Bell',
        title: 'Low/High Level Stock Alerts',
        description: 'Proactive signals when SKUs breach minimum or maximum levels you define.',
      },
      {
        icon: 'Package',
        title: 'Product Assemble / De-Assemble',
        description: 'Model kitting and breakdown with controlled impact on on-hand and valuation.',
      },
    ],
    vouchersReports: {
      heading: 'Inventory Management',
      subheading:
        'Core transactions and reporting lists below mirror how DigitalManager inventory is structured — from chart of items through transfers, consumption, and repair vouchers.',
      tabs: [
        { id: 'transactions', title: 'Transactions', items: INVENTORY_TRANSACTIONS },
        { id: 'reports', title: 'Reporting', items: INVENTORY_REPORTS },
      ],
    },
    whyChoose: {
      ...data.whyChoose,
      points: [],
    },
    realtimeReports: {
      ...data.realtimeReports,
      bullets: [],
    },
    implementation: [],
    related: [],
    seoBlocks: [],
    faqs: [],
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for inventory management on DigitalManager.',
    },
  }
}
