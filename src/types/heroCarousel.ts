import type { Bilingual } from '../cms/types'

export type HeroModuleType = 'erp' | 'finance' | 'inventory' | 'pos' | 'hr'

export type HeroCarouselSlide = {
  id: string
  moduleType: HeroModuleType
  navLabel: Bilingual
  navIcon: string
  visible?: boolean
  sortOrder?: number
  pill: Bilingual
  titleBefore: Bilingual
  titleAccent: Bilingual
  titleLine2?: Bilingual
  /** Optional orange word inside titleLine2 (e.g. "Business" in "Business Needs.") */
  titleLine2Accent?: Bilingual
  /** Lock heading to explicit line spans on desktop (no awkward wraps) */
  controlledTitleWrap?: boolean
  body: Bilingual
  ctaPrimary: { label: Bilingual; href: string }
  ctaSecondary: { label: Bilingual; href: string }
  dashboardImageUrl?: string
}

export type HeroCarouselSettings = {
  carouselEnabled?: boolean
  autoplayEnabled?: boolean
  autoplayDurationMs?: number
  slides?: HeroCarouselSlide[]
}

export type HeroCmsPayload = HeroCarouselSettings & {
  title?: Bilingual
  titleBefore?: Bilingual
  titleAccent?: Bilingual
  titleLine2?: Bilingual
  pill?: Bilingual
  useStructuredTitle?: boolean
  showPill?: boolean
  showTrustPoints?: boolean
  body?: Bilingual
  ctaPrimary?: { label?: Bilingual; href?: string }
  ctaSecondary?: { label?: Bilingual; href?: string }
  mockupImageUrl?: string
  trustPoints?: {
    id: string
    icon?: string
    label?: Bilingual
    sortOrder?: number
    active?: boolean
  }[]
}
