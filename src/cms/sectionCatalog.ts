import type { Bilingual } from './types'

export const PAGE_TEMPLATES = [
  { id: 'blank', label: 'Blank Page', description: 'Header, footer and empty canvas.' },
  { id: 'hero', label: 'Hero Page', description: 'Hero banner plus supporting copy.' },
  { id: 'imageText', label: 'Image and Text Page', description: 'Image and text split layout.' },
  { id: 'feature', label: 'Feature Page', description: 'Feature cards grid.' },
  { id: 'pricing', label: 'Pricing Page', description: 'Pricing plans section.' },
  { id: 'faq', label: 'FAQ Page', description: 'Frequently asked questions.' },
  { id: 'contact', label: 'Contact Page', description: 'CTA and contact-oriented copy.' },
] as const

export type PageTemplateId = (typeof PAGE_TEMPLATES)[number]['id']

export const SECTION_TYPES = [
  'hero',
  'stats',
  'imageText',
  'featureCards',
  'featureStrip',
  'comparison',
  'workflowSteps',
  'modules',
  'industries',
  'pricing',
  'faqs',
  'cta',
  'richText',
] as const

export type SectionType = (typeof SECTION_TYPES)[number]

export type PageSectionRecord = {
  id: string
  type: SectionType
  visible: boolean
  order: number
  content: Record<string, unknown>
}

export type PageSeo = {
  title: Bilingual
  description: Bilingual
  socialImage: string
  canonicalUrl: string
  noIndex: boolean
}

export const SECTION_LIBRARY: {
  type: SectionType
  name: string
  description: string
}[] = [
  { type: 'hero', name: 'Hero', description: 'Headline, description and two buttons.' },
  { type: 'stats', name: 'Trust Statistics', description: 'Key numbers in a trust bar.' },
  { type: 'imageText', name: 'Image and Text', description: 'Image beside heading and copy.' },
  { type: 'featureCards', name: 'Feature Cards', description: 'Icon cards with titles and descriptions.' },
  { type: 'featureStrip', name: 'Feature Strip', description: 'Compact row of highlights.' },
  { type: 'comparison', name: 'Comparison', description: 'Side-by-side comparison columns.' },
  { type: 'workflowSteps', name: 'Workflow Steps', description: 'Numbered process steps.' },
  { type: 'modules', name: 'ERP Module Cards', description: 'Module cards using the homepage style.' },
  { type: 'industries', name: 'Industry Cards', description: 'Industry cards using the homepage style.' },
  { type: 'pricing', name: 'Pricing Plans', description: 'Plan cards with features and CTA.' },
  { type: 'faqs', name: 'FAQs', description: 'Accordion questions and answers.' },
  { type: 'cta', name: 'CTA', description: 'Dark call-to-action banner.' },
  { type: 'richText', name: 'Rich Text', description: 'Heading and plain-text body.' },
]

function bi(en = '', ar = ''): Bilingual {
  return { en, ar }
}

export function isSectionType(v: unknown): v is SectionType {
  return typeof v === 'string' && (SECTION_TYPES as readonly string[]).includes(v)
}

export function defaultSectionContent(type: SectionType): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return {
        pill: bi('All-in-One ERP Solution for Growing Businesses'),
        titleBefore: bi('Run Your Business '),
        titleAccent: bi('Smarter'),
        titleLine2: bi('With One Connected ERP Platform'),
        body: bi('DigitalManager helps businesses manage finance, inventory, sales, POS, HR, CRM, branches and reports from one secure cloud platform.'),
        ctaPrimary: { label: bi('Book Free Demo'), href: '/contact' },
        ctaSecondary: { label: bi('Explore ERP Modules'), href: '/#modules' },
        imageUrl: '',
        imageAlt: bi(''),
      }
    case 'stats':
      return {
        title: bi('Trusted Results.\nStronger Businesses.', 'نتائج موثوقة.\nأعمال أقوى.'),
        items: [
          { id: 'st1', value: '20+', label: bi('Years of Experience'), icon: 'Award', accentColor: '#ff7a45' },
          { id: 'st2', value: '1000+', label: bi('Businesses Served'), icon: 'Building2', accentColor: '#ff7a45' },
          { id: 'st3', value: '15+', label: bi('Industries Covered'), icon: 'Layers', accentColor: '#ff7a45' },
          { id: 'st4', value: '99%', label: bi('Client Satisfaction'), icon: 'HeartHandshake', accentColor: '#ff7a45' },
          { id: 'st5', value: '24/7', label: bi('Customer Support'), icon: 'Headphones', accentColor: '#ff7a45' },
        ],
      }
    case 'imageText':
      return {
        eyebrow: bi('About Us'),
        heading: bi('About this page'),
        body: bi('Add supporting copy here. The layout matches the public site typography.'),
        imageUrl: '',
        imageAlt: bi(''),
        imageLeft: false,
        ctaPrimary: { label: bi('Learn more'), href: '/contact' },
      }
    case 'featureCards':
      return {
        title: bi('Enterprise-grade control across your value chain'),
        subtitle: bi('Manage every department with one connected ERP system.'),
        items: [
          { id: 'fc1', icon: 'Activity', accentColor: '#ff7a45', title: bi('Everyday business activity'), description: bi('Capture operational events as they happen.') },
          { id: 'fc2', icon: 'BookOpen', accentColor: '#2563eb', title: bi('Accounts and bookkeeping'), description: bi('Vouchers, ledgers, and period controls.') },
          { id: 'fc3', icon: 'Package', accentColor: '#16a34a', title: bi('Inventory management'), description: bi('Multi-location stock and costing.') },
        ],
      }
    case 'featureStrip':
      return {
        items: [
          { id: 'fs1', icon: 'Shield', title: bi('Secure Cloud ERP') },
          { id: 'fs2', icon: 'Cloud', title: bi('Pakistan Ready') },
          { id: 'fs3', icon: 'GitBranch', title: bi('Multi-Branch Reporting') },
        ],
      }
    case 'comparison':
      return {
        title: bi('Compare your options'),
        leftTitle: bi('Spreadsheets'),
        rightTitle: bi('DigitalManager'),
        leftItems: [bi('Manual updates'), bi('Scattered files')],
        rightItems: [bi('Live operations'), bi('One connected ERP')],
      }
    case 'workflowSteps':
      return {
        title: bi('See how your daily workflows run inside DigitalManager'),
        subtitle: bi('From sales and purchases to stock, accounts, and reports.'),
        steps: [
          { id: 'ws1', title: bi('Capture'), description: bi('Record sales, purchases and stock movements.') },
          { id: 'ws2', title: bi('Control'), description: bi('Approve, post and reconcile in one system.') },
          { id: 'ws3', title: bi('Report'), description: bi('See live KPIs without exporting spreadsheets.') },
        ],
      }
    case 'modules':
      return {
        title: bi('ERP Module Ecosystem'),
        subtitle: bi('Accounts, inventory, POS, payroll, and reports — one connected ERP platform.'),
        exploreLabel: bi('Explore →'),
        items: [
          { id: 'md1', icon: 'Landmark', accentColor: '#ff7a45', title: bi('Accounts'), description: bi('Ledger, vouchers, AR/AP, and audit-ready financial statements.'), href: '/software/accounts-management-software' },
          { id: 'md2', icon: 'Package', accentColor: '#16a34a', title: bi('Inventory'), description: bi('Multi-location stock, transfers, costing, and cycle counts.'), href: '/software/inventory-management-software' },
        ],
      }
    case 'industries':
      return {
        title: bi('Industry ERP Solutions'),
        subtitle: bi('Purpose-built ERP for petrol, retail, manufacturing and more.'),
        exploreLabel: bi('Explore →'),
        items: [
          { id: 'in1', icon: 'Fuel', accentColor: '#f97316', title: bi('Petrol & Gas'), description: bi('Shifts, nozzles, wet stock, and forecourt retail in one ledger.'), href: '/software/industry/petrol-pump-software' },
        ],
      }
    case 'pricing':
      return {
        title: bi('Plans that fit growing teams'),
        subtitle: bi('Talk to us for a footprint that matches your modules.'),
        plans: [
          { id: 'pr1', name: bi('Starter'), price: bi('Talk to sales'), features: [bi('Core accounts'), bi('Inventory')], href: '/contact', accentColor: '#ff7a45' },
          { id: 'pr2', name: bi('Business'), price: bi('Custom'), features: [bi('POS & payroll'), bi('Multi-branch')], href: '/contact', accentColor: '#2563eb' },
        ],
      }
    case 'faqs':
      return {
        title: bi('Questions ERP buyers ask'),
        items: [
          { id: 'fq1', question: bi('Is DigitalManager suitable for small businesses?'), answer: bi('Yes. Start with accounts and inventory, then add POS or payroll as you grow.') },
        ],
      }
    case 'cta':
      return {
        title: bi('Ready to modernize your business with a trusted ERP partner?'),
        body: bi('Book a walkthrough and see DigitalManager on your operations.'),
        primary: { label: bi('Book Free Demo'), href: '/contact' },
        secondary: { label: bi('Explore ERP Modules'), href: '/#modules' },
      }
    case 'richText':
      return {
        heading: bi('Page heading'),
        body: bi('Add the main page copy here. HTML and scripts are not allowed.'),
      }
    default:
      return {}
  }
}

export function templateSectionTypes(template: string): SectionType[] {
  switch (template) {
    case 'hero':
      return ['hero', 'cta']
    case 'imageText':
      return ['imageText']
    case 'feature':
      return ['featureCards']
    case 'pricing':
      return ['pricing', 'cta']
    case 'faq':
      return ['faqs']
    case 'contact':
      return ['richText', 'cta']
    default:
      return []
  }
}

export function emptySeo(): PageSeo {
  return {
    title: bi(),
    description: bi(),
    socialImage: '',
    canonicalUrl: '',
    noIndex: false,
  }
}

export function createSection(type: SectionType, order = 0): PageSectionRecord {
  return {
    id: `sec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    visible: true,
    order,
    content: defaultSectionContent(type),
  }
}

export function buildTemplateSections(template: string): PageSectionRecord[] {
  return templateSectionTypes(template).map((type, i) => createSection(type, i + 1))
}
