/**
 * Server-side page/section helpers (mirrors src/cms/sectionCatalog.ts defaults).
 */
import { nanoid } from 'nanoid'

export const SECTION_TYPES = new Set([
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
])

export const PAGE_TEMPLATES = new Set([
  'blank',
  'hero',
  'imageText',
  'feature',
  'pricing',
  'faq',
  'contact',
  'home',
  'custom',
])

export const SYSTEM_PAGES = [
  { id: 'sys-home', slug: '', title: { en: 'Homepage', ar: 'الرئيسية' }, pageType: 'home', template: 'home', publicPath: '/' },
  { id: 'sys-contact', slug: 'contact', title: { en: 'Contact', ar: 'اتصل بنا' }, pageType: 'contact', template: 'contact', publicPath: '/contact' },
]

function bi(en = '', ar = '') {
  return { en, ar }
}

export function defaultSectionContent(type) {
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
        title: bi('Trusted By Businesses Across UAE & GCC'),
        items: [
          { id: 'st1', value: '20+', label: bi('Years Experience'), icon: 'Award', accentColor: '#ff7a45' },
          { id: 'st2', value: '120+', label: bi('Business Solutions'), icon: 'Layers', accentColor: '#2563eb' },
          { id: 'st3', value: '1000+', label: bi('Happy Clients'), icon: 'Users', accentColor: '#16a34a' },
        ],
      }
    case 'imageText':
      return {
        eyebrow: bi('About Us'),
        heading: bi('About this page'),
        body: bi('Add supporting copy here.'),
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
        ],
      }
    case 'featureStrip':
      return { items: [{ id: 'fs1', icon: 'Shield', title: bi('Secure Cloud ERP') }] }
    case 'comparison':
      return {
        title: bi('Compare your options'),
        leftTitle: bi('Spreadsheets'),
        rightTitle: bi('DigitalManager'),
        leftItems: [bi('Manual updates')],
        rightItems: [bi('Live operations')],
      }
    case 'workflowSteps':
      return {
        title: bi('See how your daily workflows run inside DigitalManager'),
        subtitle: bi('From sales and purchases to stock, accounts, and reports.'),
        steps: [{ id: 'ws1', title: bi('Capture'), description: bi('Record sales and stock movements.') }],
      }
    case 'modules':
      return {
        title: bi('ERP Module Ecosystem'),
        subtitle: bi('Accounts, inventory, POS, payroll, and reports — one connected ERP platform.'),
        exploreLabel: bi('Explore →'),
        items: [{ id: 'md1', icon: 'Landmark', accentColor: '#ff7a45', title: bi('Accounts'), description: bi('Ledger and statements.'), href: '/software/accounts-management-software' }],
      }
    case 'industries':
      return {
        title: bi('Industry ERP Solutions'),
        subtitle: bi('Purpose-built ERP for petrol, retail, manufacturing and more.'),
        exploreLabel: bi('Explore →'),
        items: [{ id: 'in1', icon: 'Fuel', accentColor: '#f97316', title: bi('Petrol & Gas'), description: bi('Forecourt retail in one ledger.'), href: '/software/industry/petrol-pump-software' }],
      }
    case 'pricing':
      return {
        title: bi('Plans that fit growing teams'),
        subtitle: bi('Talk to us for a footprint that matches your modules.'),
        plans: [{ id: 'pr1', name: bi('Starter'), price: bi('Talk to sales'), features: [bi('Core accounts')], href: '/contact', accentColor: '#ff7a45' }],
      }
    case 'faqs':
      return {
        title: bi('Questions ERP buyers ask'),
        items: [{ id: 'fq1', question: bi('Is DigitalManager suitable for small businesses?'), answer: bi('Yes. Start with accounts and inventory.') }],
      }
    case 'cta':
      return {
        title: bi('Ready to modernize your business with a trusted ERP partner?'),
        body: bi('Book a walkthrough and see DigitalManager on your operations.'),
        primary: { label: bi('Book Free Demo'), href: '/contact' },
        secondary: { label: bi('Explore ERP Modules'), href: '/#modules' },
      }
    case 'richText':
      return { heading: bi('Page heading'), body: bi('Add the main page copy here.') }
    default:
      return {}
  }
}

export function templateSectionTypes(template) {
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

export function createSection(type, order = 0) {
  return {
    id: nanoid(10),
    type,
    visible: true,
    order,
    content: defaultSectionContent(type),
  }
}

export function buildTemplateSections(template) {
  return templateSectionTypes(template).map((type, i) => createSection(type, i + 1))
}

export function normalizeSections(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((s) => s && typeof s === 'object' && typeof s.id === 'string' && SECTION_TYPES.has(s.type))
    .map((s, i) => ({
      id: s.id,
      type: s.type,
      visible: s.visible !== false,
      order: typeof s.order === 'number' && Number.isFinite(s.order) ? s.order : i + 1,
      content: s.content && typeof s.content === 'object' && !Array.isArray(s.content) ? s.content : defaultSectionContent(s.type),
    }))
    .sort((a, b) => a.order - b.order)
}

export function mergeSectionsById(prev = [], patch = []) {
  const map = new Map(prev.map((s) => [s.id, s]))
  for (const row of patch) {
    if (!row?.id) continue
    const existing = map.get(row.id)
    map.set(row.id, existing ? { ...existing, ...row, content: { ...(existing.content || {}), ...(row.content || {}) } } : row)
  }
  return normalizeSections([...map.values()])
}

export function isSystemPageId(id) {
  return SYSTEM_PAGES.some((p) => p.id === id)
}

export function getSystemPage(id) {
  return SYSTEM_PAGES.find((p) => p.id === id)
}
