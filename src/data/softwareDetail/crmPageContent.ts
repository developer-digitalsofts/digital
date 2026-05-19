import type {
  SoftwareDetailPageData,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
  SoftwareTabBlock,
} from './types'

const PROBLEM =
  'Traditional customer management systems are disorganized, slow, and difficult to track, causing poor customer handling and lost sales opportunities.'

const SOLUTION =
  'Our CRM Software helps businesses organize leads, automate follow-ups, manage campaigns, improve customer support, and analyze customer data effectively.'

const FEATURE_BULLETS = [
  'Organize & Track Information',
  'Automate Marketing Campaigns',
  'Customer Support Tickets',
  'Data Insights & Customizable Reports',
  'Plan & Track Projects',
  'Access and Manage Data with Mobile Apps',
]

const INTRO =
  'All-in-one CRM solution for sales teams, support centers, service businesses, and growing enterprises.\n\nStreamline lead management, follow-ups, support tickets, and customer insights — all from one scalable platform.'

const CRM_OVERVIEW_TAB: SoftwareTabBlock = {
  id: 'crm-areas',
  title: 'Capability areas',
  items: [
    {
      name: 'Contact Management',
      description: 'Authoritative accounts, contacts, and communication history so every handover stays contextual.',
    },
    {
      name: 'Relationship Management',
      description: 'Activities, ownership, and follow-up discipline that keep deals and renewals from stalling in inboxes.',
    },
    {
      name: 'Marketing Automation',
      description: 'Campaign rhythms, segments, and repeatable outreach without losing alignment to sales and service.',
    },
    {
      name: 'Customer Service',
      description: 'Tickets, SLAs, and resolution notes tied to the same customer record finance and operations trust.',
    },
    {
      name: 'Reporting & Analytics',
      description: 'Dashboards and exports leadership can use for pipeline, support load, and account health at a glance.',
    },
  ] satisfies SoftwareNamedItem[],
}

/**
 * Post-template content for the CRM Software module page only.
 */
export function mergeCrmPremiumPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...pl,
    featuresHeading: 'Software Features',
    featuresLead:
      'Contact and relationship management, marketing automation, customer service, and analytics — one CRM spine for sales, support, and growth teams.',
    vouchersSectionEyebrow: 'CRM platform',
    challengesHeading: 'MODULES & FEATURES',
    challengesIntro: PROBLEM,
    challengesListLead: 'Features:',
    challengeBullets: FEATURE_BULLETS,
    solutionHeading: 'Solution',
    solutionParagraphs: [SOLUTION],
    heroChips: [],
    heroAsideCaption: 'Leads, clients, campaigns, and support tickets on one scalable cloud workspace.',
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
    metaTitle: 'Cloud-Based CRM Software | DigitalManager ERP',
    metaDescription:
      'Track leads, manage clients, and grow loyalty — lead management, follow-ups, support tickets, and customer insights on one scalable CRM platform.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based CRM Software That Strengthens Customer Relationships',
      subhead: 'Track Leads. Manage Clients. Grow Loyalty.',
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
        icon: 'Contact',
        title: 'Contact Management',
        description: 'Structured accounts and contacts with ownership, history, and clean handovers between teams.',
      },
      {
        icon: 'HeartHandshake',
        title: 'Relationship Management',
        description: 'Nurture long-term relationships with activities, reminders, and context that survives staff changes.',
      },
      {
        icon: 'Megaphone',
        title: 'Marketing Automation',
        description: 'Campaigns and follow-up sequences that stay tied to pipeline stages and real responses.',
      },
      {
        icon: 'Headphones',
        title: 'Customer Service',
        description: 'Tickets and resolutions linked to customers so support and sales see the same truth.',
      },
      {
        icon: 'PieChart',
        title: 'Reporting & Analytics',
        description: 'Insights and configurable views for pipeline, service levels, and account performance.',
      },
    ],
    vouchersReports: {
      heading: 'How teams use CRM on DigitalManager',
      subheading:
        'The five capability areas below complement the modules & features list — from first touch through retention and reporting.',
      tabs: [CRM_OVERVIEW_TAB],
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
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for CRM on DigitalManager.',
    },
  }
}
