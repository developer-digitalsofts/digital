import type { Bilingual } from './types'
import type { PageSectionRecord, PageSeo } from './sectionCatalog'
import { emptySeo } from './sectionCatalog'

export const PAGE_TEMPLATES = [
  { id: 'blank', label: 'Blank Page' },
  { id: 'hero', label: 'Hero Page' },
  { id: 'imageText', label: 'Image and Text Page' },
  { id: 'feature', label: 'Feature Page' },
  { id: 'pricing', label: 'Pricing Page' },
  { id: 'faq', label: 'FAQ Page' },
  { id: 'contact', label: 'Contact Page' },
] as const

export type PageTemplateId = (typeof PAGE_TEMPLATES)[number]['id']

export type PageHeaderNav = {
  enabled: boolean
  label: Bilingual
  sortOrder: number
  parentId?: string
  openInNewTab?: boolean
  highlightAsCta?: boolean
  showDesktop?: boolean
  showMobile?: boolean
}

export type PageFooterNav = {
  enabled: boolean
  label: Bilingual
  column: 'product' | 'industries' | 'company' | 'contact'
  sortOrder: number
  openInNewTab?: boolean
}

export type PageNavigation = {
  header: PageHeaderNav
  footer: PageFooterNav
}

export type PageKind = 'system' | 'custom'

export type CmsPageRecord = {
  id: string
  slug: string
  pageType: string
  template?: PageTemplateId | string
  kind?: PageKind
  status: 'published' | 'draft'
  language: 'en' | 'ar' | 'both'
  sortOrder: number
  showInMenu: boolean
  title: Bilingual
  heading: Bilingual
  shortDescription: Bilingual
  content: Bilingual
  featuredImageUrl: string
  /** Legacy flat SEO fields */
  metaTitle: Bilingual
  metaDescription: Bilingual
  seo?: PageSeo
  navigation?: PageNavigation
  headerNav?: PageHeaderNav
  footerNav?: PageFooterNav
  heroCta?: PageHeroCta
  sections?: PageSectionRecord[]
  publishedSections?: PageSectionRecord[] | null
  publishedContent?: Record<string, unknown> | null
  lastPublishedAt?: string | null
  editorialStatus?: string
  createdAt: string
  updatedAt: string
}

export type PageHeroCta = {
  enabled: boolean
  label: Bilingual
  variant: 'primary' | 'secondary'
  sortOrder: number
}

export const PAGE_TYPE_OPTIONS = [
  'custom',
  'about',
  'services',
  'projects',
  'blog',
  'contact',
  'residential',
] as const

export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160)
}

export function emptyBilingual(): Bilingual {
  return { en: '', ar: '' }
}

export function defaultHeroCta(): PageHeroCta {
  return {
    enabled: false,
    label: emptyBilingual(),
    variant: 'primary',
    sortOrder: 0,
  }
}

export function defaultHeaderNav(): PageHeaderNav {
  return {
    enabled: false,
    label: emptyBilingual(),
    sortOrder: 0,
    parentId: '',
    openInNewTab: false,
    highlightAsCta: false,
    showDesktop: true,
    showMobile: true,
  }
}

export function defaultFooterNav(): PageFooterNav {
  return {
    enabled: false,
    label: emptyBilingual(),
    column: 'company',
    sortOrder: 0,
    openInNewTab: false,
  }
}

export function defaultNavigation(): PageNavigation {
  return { header: defaultHeaderNav(), footer: defaultFooterNav() }
}

export function emptyPageDraft(): Omit<CmsPageRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    slug: '',
    pageType: 'custom',
    template: 'blank',
    kind: 'custom',
    status: 'draft',
    language: 'both',
    sortOrder: 0,
    showInMenu: false,
    metaTitle: emptyBilingual(),
    metaDescription: emptyBilingual(),
    title: emptyBilingual(),
    heading: emptyBilingual(),
    shortDescription: emptyBilingual(),
    content: emptyBilingual(),
    featuredImageUrl: '',
    seo: emptySeo(),
    navigation: defaultNavigation(),
    headerNav: defaultHeaderNav(),
    footerNav: defaultFooterNav(),
    heroCta: defaultHeroCta(),
    sections: [],
    publishedSections: null,
    publishedContent: null,
    lastPublishedAt: null,
  }
}

export type SystemPageDef = {
  id: string
  slug: string
  title: Bilingual
  pageType: string
  template: PageTemplateId | string
  kind: 'system'
  editable: boolean
  manageSections: boolean
  publicPath: string
}

export const SYSTEM_PAGES: SystemPageDef[] = [
  {
    id: 'sys-home',
    slug: '',
    title: { en: 'Homepage', ar: 'الرئيسية' },
    pageType: 'home',
    template: 'home',
    kind: 'system',
    editable: true,
    manageSections: true,
    publicPath: '/',
  },
  {
    id: 'sys-contact',
    slug: 'contact',
    title: { en: 'Contact', ar: 'اتصل بنا' },
    pageType: 'contact',
    template: 'contact',
    kind: 'system',
    editable: true,
    manageSections: false,
    publicPath: '/contact',
  },
]

export function isSystemPageId(id: string) {
  return SYSTEM_PAGES.some((p) => p.id === id)
}

export function getSystemPage(id: string) {
  return SYSTEM_PAGES.find((p) => p.id === id)
}

export function syncLegacyNav(page: CmsPageRecord): PageNavigation {
  const nav = page.navigation || defaultNavigation()
  if (page.headerNav) {
    nav.header = { ...nav.header, ...page.headerNav }
  }
  if (page.footerNav) {
    nav.footer = { ...nav.footer, ...page.footerNav }
  }
  return nav
}

export function navToLegacy(page: CmsPageRecord) {
  const nav = syncLegacyNav(page)
  return {
    headerNav: nav.header,
    footerNav: nav.footer,
    showInMenu: nav.header.enabled,
  }
}
