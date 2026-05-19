import type { Bilingual } from './types'

export const PAGE_TYPE_OPTIONS = [
  'home',
  'about',
  'services',
  'projects',
  'blog',
  'contact',
  'residential',
  'custom',
] as const

export type PageTypeOption = (typeof PAGE_TYPE_OPTIONS)[number]

export type CmsPageRecord = {
  id: string
  slug: string
  pageType: string
  status: 'published' | 'draft'
  language: 'en' | 'ar' | 'both'
  sortOrder: number
  showInMenu: boolean
  metaTitle: Bilingual
  metaDescription: Bilingual
  title: Bilingual
  heading: Bilingual
  shortDescription: Bilingual
  content: Bilingual
  featuredImageUrl: string
  createdAt: string
  updatedAt: string
}

export function emptyBilingual(): Bilingual {
  return { en: '', ar: '' }
}

export function emptyPageDraft(): Omit<CmsPageRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    slug: '',
    pageType: 'custom',
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
  }
}
