import type {
  SoftwareDetailPageData,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
  SoftwareTabBlock,
} from './types'

const PROBLEM =
  'Businesses often struggle to maintain real-time communication with customers using traditional communication methods. Delayed alerts and poor engagement reduce customer satisfaction and operational efficiency.'

const SOLUTION =
  'Our SMS Integration System enables businesses to send instant notifications, reminders, promotional messages, stock alerts, and transactional updates directly from their ERP, POS, or CRM systems.'

const FEATURE_BULLETS = [
  'Alerts Sale / Purchase to Controller',
  'Alerts Minimum Stock',
  'Overdue Alerts to Customer with SMS',
  'Promotion of New Ideas / Products with SMS Alert',
  'Welcome Note to Customer with SMS',
]

const INTRO =
  'All-in-one SMS solution for retail, healthcare, education, logistics, and service-based businesses.\n\nEasily integrate with your POS, CRM, or ERP to send invoices, promotions, reminders, and alerts — instantly and reliably across the UAE.'

const SMS_TAB: SoftwareTabBlock = {
  id: 'sms-scenarios',
  title: 'Connected workflows',
  items: [
    {
      name: 'Sale/Purchase Alerts',
      description:
        'Notify controllers and supervisors when sales or purchases post so branches and head office stay aligned without manual phone trees.',
    },
    {
      name: 'Stock Alerts',
      description:
        'Surface minimum stock and critical inventory signals early so replenishment happens before shelves go empty.',
    },
    {
      name: 'Promotions',
      description:
        'Launch product and campaign bursts with SMS so customers see timely offers tied to real catalogue and pricing masters.',
    },
  ] satisfies SoftwareNamedItem[],
}

/**
 * Post-template content for the Integration System (SMS) module page only. Canonical slug: `integration-system`.
 */
export function mergeSmsIntegrationPremiumPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...pl,
    featuresHeading: 'Software Features',
    featuresLead: 'The features that are included in SMS Integration System software are:',
    vouchersSectionEyebrow: 'SMS integration',
    challengesHeading: 'SMS Integration System',
    challengesIntro: PROBLEM,
    challengesListLead: 'Features:',
    challengeBullets: FEATURE_BULLETS,
    solutionHeading: 'Solution',
    solutionParagraphs: [SOLUTION],
    heroChips: [],
    heroAsideCaption: 'Instant SMS from DigitalManager — invoices, reminders, stock, and promotions tied to your live ERP, POS, and CRM events.',
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
    metaTitle: 'Cloud-Based SMS Integration System | DigitalManager ERP',
    metaDescription:
      'Send alerts, boost engagement, and automate SMS from POS, CRM, or ERP — reminders, promotions, and transactional updates across the UAE.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based SMS Integration System That Keeps Your Customers Connected',
      subhead: 'Send Alerts. Boost Engagement. Automate Communication.',
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
        icon: 'Bell',
        title: 'Sale/Purchase Alerts',
        description: 'Controller-facing alerts when sales or purchase activity needs attention across branches.',
      },
      {
        icon: 'Package',
        title: 'Stock Alerts',
        description: 'Minimum stock and inventory signals so buyers and store teams react before stock-outs.',
      },
      {
        icon: 'Megaphone',
        title: 'Promotions',
        description: 'Campaign and product promotion SMS tied to your masters and timing rules.',
      },
    ],
    vouchersReports: {
      heading: 'How SMS fits your operations',
      subheading: 'Three pillars of the SMS Integration System — aligned to alerts, inventory, and customer engagement.',
      tabs: [SMS_TAB],
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for SMS integration on DigitalManager.',
    },
  }
}
