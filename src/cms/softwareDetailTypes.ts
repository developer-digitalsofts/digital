import type { Bilingual } from './types'

export const ACCENT_COLOR_OPTIONS = ['orange', 'green', 'blue', 'purple', 'teal'] as const
export type AccentColorOption = (typeof ACCENT_COLOR_OPTIONS)[number]

export type SoftwareDetailFeature = {
  icon: string
  title: Bilingual
  description: Bilingual
}

export type SoftwareDetailFaq = {
  q: Bilingual
  a: Bilingual
}

export type SoftwareDetailCapability = {
  title: Bilingual
  body: Bilingual
}

export type SoftwareDetailWorkflow = {
  step: Bilingual
  detail: Bilingual
}

export type SoftwareDetailCmsRecord = {
  id: string
  kind: 'module' | 'industry'
  slug: string
  active: boolean
  sortOrder: number
  icon: string
  accentColor: AccentColorOption
  heroImageUrl: string
  label: Bilingual
  shortDescription: Bilingual
  metaTitle: Bilingual
  metaDescription: Bilingual
  hero: {
    eyebrow: Bilingual
    headline: Bilingual
    subhead: Bilingual
    intro: Bilingual
    ctaPrimary: { label: Bilingual; href: string }
    ctaSecondary: { label: Bilingual; href: string }
  }
  highlights: { en: string[]; ar: string[] }
  capabilities: SoftwareDetailCapability[]
  workflows: SoftwareDetailWorkflow[]
  outcomes: { en: string[]; ar: string[] }
  features: SoftwareDetailFeature[]
  faqs: SoftwareDetailFaq[]
  demoCta: { heading: Bilingual; sub: Bilingual }
  isCustom: boolean
  createdAt: string
  updatedAt: string
}

export function emptyBilingual(): Bilingual {
  return { en: '', ar: '' }
}

export function emptySoftwareDetailDraft(
  kind: 'module' | 'industry' = 'module',
): Omit<SoftwareDetailCmsRecord, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    kind,
    slug: '',
    active: true,
    sortOrder: 0,
    icon: 'Box',
    accentColor: 'orange',
    heroImageUrl: '',
    label: emptyBilingual(),
    shortDescription: emptyBilingual(),
    metaTitle: emptyBilingual(),
    metaDescription: emptyBilingual(),
    hero: {
      eyebrow: emptyBilingual(),
      headline: emptyBilingual(),
      subhead: emptyBilingual(),
      intro: emptyBilingual(),
      ctaPrimary: { label: emptyBilingual(), href: '/contact' },
      ctaSecondary: { label: emptyBilingual(), href: '/#modules' },
    },
    highlights: { en: [], ar: [] },
    capabilities: [],
    workflows: [],
    outcomes: { en: [], ar: [] },
    features: [],
    faqs: [],
    demoCta: { heading: emptyBilingual(), sub: emptyBilingual() },
    isCustom: true,
  }
}
