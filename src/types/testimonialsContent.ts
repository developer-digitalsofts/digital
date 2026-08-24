import type { Bilingual } from '../cms/types'

export type ContentStatus = 'draft' | 'published'

export type TestimonialRecord = {
  id: string
  internalTitle?: string
  quote: Bilingual
  customerName: Bilingual
  designation?: Bilingual
  company?: Bilingual
  companyLogo?: string
  companyLogoAlt?: Bilingual
  image?: string
  imageAlt?: Bilingual
  productService?: Bilingual
  industry?: string
  city?: string
  country?: string
  rating?: number
  verified?: boolean
  verificationNote?: string
  caseStudyUrl?: string
  solutionUrl?: string
  featuredOnHomepage?: boolean
  sortOrder?: number
  enabled?: boolean
  status?: ContentStatus
  /** Admin-only marker — sample drafts must not auto-publish */
  isSample?: boolean
  countryCode?: string
  languageCode?: string
}

export type TestimonialsSectionConfig = {
  enabled?: boolean
  eyebrow?: Bilingual
  heading?: Bilingual
  supportingText?: Bilingual
  limit?: number
  selectionMode?: 'featured' | 'manual'
  manualIds?: string[]
  viewAllLabel?: Bilingual
  viewAllUrl?: string
  showViewAll?: boolean
}

export type TestimonialsPageConfig = {
  enabled?: boolean
  eyebrow?: Bilingual
  title?: Bilingual
  intro?: Bilingual
  seoTitle?: Bilingual
  seoDescription?: Bilingual
}

export type TestimonialsContentDoc = {
  schemaVersion?: number
  section?: TestimonialsSectionConfig
  page?: TestimonialsPageConfig
  items: TestimonialRecord[]
  _meta?: Record<string, unknown>
}

export type ResolvedTestimonial = {
  id: string
  quote: string
  customerName: string
  designation: string
  company: string
  companyLogo: string
  companyLogoAlt: string
  image: string
  imageAlt: string
  productService: string
  industry: string
  city: string
  country: string
  rating?: number
  verified: boolean
  caseStudyUrl: string
  solutionUrl: string
  featuredOnHomepage?: boolean
  countryCode?: string
}
