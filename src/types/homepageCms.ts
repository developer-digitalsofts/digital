import type { Bilingual } from '../cms/types'

export type CmsImageField = {
  src?: string
  alt?: Bilingual
  objectPosition?: string
}

export type DemoCtaCms = {
  schemaVersion?: number
  title: Bilingual
  description: Bilingual
  buttonLabel: Bilingual
  enabled?: boolean
  _meta?: Record<string, unknown>
}

export type TestimonialCmsItem = {
  id: string
  quote: Bilingual
  customerName: Bilingual
  designation: Bilingual
  company: Bilingual
  image?: string
  imageAlt?: Bilingual
  sortOrder?: number
  enabled?: boolean
}

export type TestimonialsCms = {
  schemaVersion?: number
  eyebrow: Bilingual
  title: Bilingual
  items: TestimonialCmsItem[]
  _meta?: Record<string, unknown>
}

export type PersonalizedDemoHighlight = {
  id: string
  label: Bilingual
  icon?: string
  sortOrder?: number
  enabled?: boolean
}

export type PersonalizedDemoCms = {
  schemaVersion?: number
  eyebrow: Bilingual
  title: Bilingual
  description: Bilingual
  highlights: PersonalizedDemoHighlight[]
  submitLabel: Bilingual
  successMessage: Bilingual
  errorMessage: Bilingual
  enabled?: boolean
  _meta?: Record<string, unknown>
}

export type ErpModulesHeaderCms = {
  schemaVersion?: number
  eyebrow: Bilingual
  title: Bilingual
  _deprecatedCards?: unknown[]
  _meta?: Record<string, unknown>
}
