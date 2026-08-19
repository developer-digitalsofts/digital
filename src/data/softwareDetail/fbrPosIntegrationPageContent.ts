import type {
  SoftwareDetailPageData,
  SoftwareImplementationStep,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
  SoftwareTabBlock,
} from './types'

const INTEGRATION_PROBLEM =
  'Businesses struggle with manual invoice reporting, delayed tax submissions, and compliance management.'

const INTEGRATION_SOLUTION =
  'Our UAE VAT POS Integration System automates invoice reporting, tax verification, SMS alerts, and real-time analytics while keeping your business compliant.'

const INTEGRATION_FEATURE_BULLETS = [
  'Varying Tax Percentages Based on Products',
  'History of Sales and Purchase Reports',
  'Verification of Tax Filing with SMS Alerts',
  'Real Time Reporting and Analytics',
]

const INTRO =
  'Stay fully compliant with regulatory standards using our officially verified Point of Sale (POS) software integrated with the UAE tax compliance workflows.\n\nThis smart cloud-based system automates real-time invoice reporting, generates digital receipts, verifies TRNs, and ensures seamless tax filing processes.\n\nIdeal for retail businesses, restaurants, pharmacies, and service providers.'

const INVOICING_TAB: SoftwareTabBlock = {
  id: 'fbr-invoicing',
  title: 'Overview',
  items: [
    {
      name: 'Centralized invoicing & compliance',
      description:
        'Manage invoices, sales reporting, UAE VAT verification, tax compliance, and customer transactions through one centralized cloud-based platform aligned with UAE VAT invoicing workflows.',
    },
    {
      name: 'VAT-ready operations',
      description:
        'Operate with a solution positioned for regulator-aligned digital invoicing so payloads, references, and submission status stay traceable from POS to filing.',
    },
    {
      name: 'Ensure Security',
      description:
        'Layered access, audit-friendly trails, and controlled queues help protect sensitive buyer data and submission history while teams collaborate safely.',
    },
  ] satisfies SoftwareNamedItem[],
}

const FBR_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map your POS lanes, item and tax masters, buyer validation rules, and VAT submission cadence so DigitalManager mirrors how your retail and finance teams comply in practice.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Hands-on training for cashiers, branch supervisors, and accountants on digital invoices, exception queues, and reconciliation views before live filing traffic.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Environment setup, schema mappings, sandbox submissions, and go-live checklists so production POS and VAT endpoints are validated together.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing monitoring assistance, retry guidance, and configuration updates as regulatory templates or store formats evolve after deployment.',
  },
]

/**
 * Post-template content for the UAE VAT & Tax Compliance Software module page only.
 */
export function mergeFbrPosIntegrationPremiumPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...pl,
    featuresHeading: 'Software Modules',
    featuresLead:
      'Point of Sale, customer relationship context, tax filing verification, and reporting and analytics — unified for UAE VAT-aligned retail and service operations.',
    vouchersSectionEyebrow: 'UAE VAT POS invoicing',
    challengesHeading: 'UAE VAT POS Integration System',
    challengesIntro: INTEGRATION_PROBLEM,
    challengesListLead: 'Features:',
    challengeBullets: INTEGRATION_FEATURE_BULLETS,
    solutionHeading: 'Solution',
    solutionParagraphs: [INTEGRATION_SOLUTION],
    heroChips: [],
    heroAsideCaption:
      'Real-time digital invoicing, TRN-aware validation, and compliance workflows built around how UAE retailers actually sell.',
    industriesSection: {
      ...pl.industriesSection,
      heading: '',
      description: '',
      items: [],
      note: '',
    },
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured so stores, tax, and finance share one rollout path for UAE VAT POS integration on DigitalManager.',
    demoSendButtonLabel: 'Request Here',
    faqSectionHeading: pl.faqSectionHeading,
  }

  return {
    ...data,
    metaTitle: 'UAE VAT-Integrated POS Software | DigitalManager ERP',
    metaDescription:
      'Compliant, automated, officially integrated UAE VAT POS — real-time invoice reporting, digital receipts, STRN verification, and smoother tax filing for retail and services.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'UAE VAT-Integrated POS Software for Real-Time Sales Compliance',
      subhead: 'Compliant. Automated. Officially Integrated.',
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
        icon: 'Store',
        title: 'Point Of Sale (POS) System',
        description: 'Lanes, tenders, and sales flows that feed structured digital invoice data alongside stock and cash discipline.',
      },
      {
        icon: 'Users',
        title: 'Customer Relationship Management System',
        description: 'Buyer context and STRN validation hooks so compliant payloads stay tied to the right customer master.',
      },
      {
        icon: 'BadgeCheck',
        title: 'Verification Of Tax Filing',
        description: 'Submission status, queues, and checks that reduce last-minute surprises before filing cycles.',
      },
      {
        icon: 'LineChart',
        title: 'Reporting and Analytics',
        description: 'Sales, purchase, and compliance-oriented views leadership can review without manual spreadsheet merges.',
      },
    ],
    vouchersReports: {
      heading: 'UAE VAT Point Of Sale (POS) Invoicing System',
      subheading: 'Verified Solution Integrated By Powerful Features',
      tabs: [INVOICING_TAB],
    },
    whyChoose: {
      ...data.whyChoose,
      points: [],
    },
    realtimeReports: {
      ...data.realtimeReports,
      bullets: [],
    },
    implementation: FBR_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: [],
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for UAE VAT POS integration on DigitalManager.',
    },
  }
}
