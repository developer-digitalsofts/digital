import type { Bilingual } from '../cms/types'

export type ContentStatus = 'draft' | 'published'

export type BlogBlock =
  | { id: string; type: 'paragraph'; text: Bilingual }
  | { id: string; type: 'heading2'; text: Bilingual }
  | { id: string; type: 'heading3'; text: Bilingual }
  | { id: string; type: 'bulletList'; items: Bilingual[] }
  | { id: string; type: 'numberedList'; items: Bilingual[] }
  | { id: string; type: 'quote'; text: Bilingual; attribution?: Bilingual }
  | { id: string; type: 'image'; src: string; alt?: Bilingual; caption?: Bilingual }
  | { id: string; type: 'cta'; heading?: Bilingual; description?: Bilingual; label?: Bilingual; href?: string }
  | { id: string; type: 'divider' }

export type BlogCategory = {
  id: string
  name: Bilingual
  slug: string
  description?: Bilingual
  sortOrder?: number
  enabled?: boolean
}

export type BlogFaqItem = {
  id: string
  question: Bilingual
  answer: Bilingual
}

export type BlogPostSeo = {
  title?: Bilingual
  description?: Bilingual
  canonicalUrl?: string
  ogTitle?: Bilingual
  ogDescription?: Bilingual
  ogImage?: string
  robotsIndex?: boolean
  robotsFollow?: boolean
}

export type BlogTranslationStatus = 'draft' | 'needs_review' | 'approved' | 'published'

export type BlogPostRecord = {
  id: string
  internalTitle?: string
  title: Bilingual
  slug: string
  excerpt: Bilingual
  featuredImage?: string
  featuredImageAlt?: Bilingual
  categoryId?: string
  tags?: string[]
  author?: Bilingual
  authorRole?: Bilingual
  authorImage?: string
  body: BlogBlock[]
  faq?: BlogFaqItem[]
  relatedPostIds?: string[]
  relatedSolutionUrl?: string
  translationPairId?: string
  translationStatus?: BlogTranslationStatus
  primaryKeyword?: string
  searchIntent?: string
  ctaHeading?: Bilingual
  ctaDescription?: Bilingual
  ctaLabel?: Bilingual
  ctaUrl?: string
  featured?: boolean
  showOnHomepage?: boolean
  sortOrder?: number
  publishDate?: string
  updatedDate?: string
  status?: ContentStatus
  enabled?: boolean
  countryCode?: string
  languageCode?: string
  seo?: BlogPostSeo
  _seedVersion?: string
}

export type BlogPostsDoc = {
  schemaVersion?: number
  items: BlogPostRecord[]
  _meta?: Record<string, unknown>
}

export type BlogCategoriesDoc = {
  schemaVersion?: number
  items: BlogCategory[]
  _meta?: Record<string, unknown>
}

export type BlogSectionConfig = {
  enabled?: boolean
  eyebrow?: Bilingual
  heading?: Bilingual
  supportingText?: Bilingual
  limit?: number
  selectionMode?: 'featured' | 'manual' | 'recent'
  manualIds?: string[]
  viewAllLabel?: Bilingual
  viewAllUrl?: string
}

export type BlogSectionDoc = {
  schemaVersion?: number
  section?: BlogSectionConfig
  _meta?: Record<string, unknown>
}

export type ResolvedBlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  featuredImage: string
  featuredImageAlt: string
  categoryId: string
  categoryName: string
  categorySlug: string
  tags: string[]
  author: string
  authorRole: string
  authorImage: string
  body: BlogBlock[]
  faq: { id: string; question: string; answer: string }[]
  relatedPostIds: string[]
  relatedSolutionUrl: string
  ctaHeading: string
  ctaDescription: string
  ctaLabel: string
  ctaUrl: string
  featured: boolean
  publishDate: string
  updatedDate: string
  readingMinutes: number
  seo: {
    title: string
    description: string
    canonicalUrl: string
    ogTitle: string
    ogDescription: string
    ogImage: string
    robotsIndex: boolean
    robotsFollow: boolean
  }
}
