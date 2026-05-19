import type {
  SoftwareDetailPageData,
  SoftwareImplementationStep,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
} from './types'

const tx = (name: string): SoftwareNamedItem => ({ name, description: '' })

const PRODUCTION_TRANSACTIONS: SoftwareNamedItem[] = [
  tx('Inward Gate Pass'),
  tx('Stock Transfer Voucher'),
  tx('Stock Consumption Voucher'),
  tx('Production Estimation Voucher'),
  tx('BOM Production Voucher'),
  tx('Manual Production Voucher'),
  tx('Outward Gate Pass / Delivery Chalan Voucher'),
]

const PRODUCTION_REPORTS: SoftwareNamedItem[] = [
  tx('Inward Gate Pass Report'),
  tx('Stock Transfer Report'),
  tx('Stock Consumption Report'),
  tx('Production Report BOM / Manual / All Production'),
  tx('Delivery Chalan Report'),
]

const PROBLEM =
  'Manual production handling causes delays, stock issues, poor resource planning, increased wastage, and reduced manufacturing efficiency. Lack of real-time visibility affects productivity and operational control.'

const SOLUTION =
  'Our Production Management Software streamlines manufacturing operations with production planning, BOM handling, stock consumption, warehouse integration, and complete production tracking.'

const INTRO =
  'All-in-one production management solution for textile units, pharmaceutical plants, food manufacturers, packaging industries, and engineering workshops.\n\nSeamlessly integrate production with inventory, sales, and accounts — designed for factories and production setups of all sizes.'

const PRODUCTION_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map your BOMs, routings, warehouses, costing rules, and gate-pass flows so DigitalManager production matches how your shop floor and finance teams actually operate.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Hands-on training for planners, storekeepers, and production supervisors — covering vouchers, consumption, transfers, and reporting before go-live.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Environment setup, master data alignment, BOM imports, and sandbox validation so first production runs post cleanly to stock and accounts.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing assistance for configuration changes, peak manufacturing periods, and integration with inventory and sales as your lines scale.',
  },
]

/**
 * Post-template content for the Production Management module page only.
 */
export function mergeProductionManagementPremiumPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...pl,
    featuresHeading: 'Software Features',
    featuresLead:
      'Chart of accounts, cash and product context, departments and warehouses, bill of materials, and factory overheads — aligned to manufacturing efficiency on one cloud platform.',
    vouchersSectionEyebrow: 'Production module',
    challengesHeading: 'Production Management',
    challengesIntro: PROBLEM,
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Solution',
    solutionParagraphs: [SOLUTION],
    heroChips: [],
    heroAsideCaption:
      'Plan and run production with BOM discipline, stock consumption you can trace, and delivery documentation tied to inventory and accounts.',
    industriesSection: {
      ...pl.industriesSection,
      heading: '',
      description: '',
      items: [],
      note: '',
    },
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured so operations and finance share one rollout path for production on DigitalManager.',
    demoSendButtonLabel: 'Request Here',
    faqSectionHeading: pl.faqSectionHeading,
  }

  return {
    ...data,
    metaTitle: 'Cloud-Based Production Management Software | DigitalManager ERP',
    metaDescription:
      'Simplify production, track resources, and deliver quality — BOMs, consumption, warehouse integration, and reporting for factories of all sizes.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Production Management Software That Powers Your Manufacturing Efficiency',
      subhead: 'Simplify Production. Track Resources. Deliver Quality.',
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
        title: 'Chart of Accounts',
        description: 'Financial structure that keeps production postings, WIP, and finished goods aligned with the general ledger.',
      },
      {
        icon: 'Wallet',
        title: 'Cash and Product',
        description: 'Link production movements to product masters and cash impact where your process requires it.',
      },
      {
        icon: 'Building2',
        title: 'Chart of Departments / Warehouse',
        description: 'Organise production, stores, and cost centres so issues, transfers, and completions land in the right place.',
      },
      {
        icon: 'Boxes',
        title: 'BOM (Bill of Material)',
        description: 'Define multilevel BOMs to drive material issues, estimations, and BOM-based production vouchers.',
      },
      {
        icon: 'Factory',
        title: 'FOH (Factory Over Heads)',
        description: 'Capture and absorb factory overheads so product cost reflects real manufacturing burden.',
      },
    ],
    vouchersReports: {
      heading: 'Production Management',
      subheading:
        'Core transactions and reports below reflect how DigitalManager ties gate passes, stock moves, and production vouchers to inventory and accounts.',
      tabs: [
        { id: 'transactions', title: 'Transactions', items: PRODUCTION_TRANSACTIONS },
        { id: 'reports', title: 'Reporting', items: PRODUCTION_REPORTS },
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
    implementation: PRODUCTION_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: [],
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for production management on DigitalManager.',
    },
  }
}
