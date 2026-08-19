import type { ComponentType } from 'react'
import { HeroSection } from '../components/HeroSection'
import { TrustStatsSection } from '../components/TrustStatsSection'
import { IndustryShowcaseSection } from '../components/IndustryShowcaseSection'
import { ErpModulesSection } from '../components/erp-modules/ErpModulesSection'
import { DemoCTASection } from '../components/DemoCTASection'
import { ModulesSection } from '../components/ModulesSection'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { PersonalizedDemoSection } from '../components/PersonalizedDemoSection'
import { FAQSection } from '../components/FAQSection'

export const HOME_SECTION_SCHEMA_VERSION = 2

export type HomeSectionId =
  | 'hero'
  | 'stats'
  | 'about'
  | 'valueChain'
  | 'demoCta'
  | 'modules'
  | 'testimonials'
  | 'personalizedDemo'
  | 'faqs'

/** CMS JSON key for each homepage section (may differ from section id). */
export type HomeSectionCmsKey =
  | 'hero'
  | 'stats'
  | 'industries'
  | 'valueChain'
  | 'demoCta'
  | 'modules'
  | 'testimonials'
  | 'personalizedDemo'
  | 'faqs'

export type HomeSectionDefinition = {
  id: HomeSectionId
  label: string
  category: 'Homepage'
  cmsKey: HomeSectionCmsKey
  component: ComponentType
  required?: boolean
  deprecated?: boolean
  defaultSortOrder: number
}

/** Approved homepage section registry — shared by frontend renderer and CMS admin. */
export const HOME_SECTION_REGISTRY: HomeSectionDefinition[] = [
  {
    id: 'hero',
    label: 'Hero Carousel',
    category: 'Homepage',
    cmsKey: 'hero',
    component: HeroSection,
    required: true,
    defaultSortOrder: 1,
  },
  {
    id: 'stats',
    label: 'Trust Metrics',
    category: 'Homepage',
    cmsKey: 'stats',
    component: TrustStatsSection,
    defaultSortOrder: 2,
  },
  {
    id: 'about',
    label: 'Built for Your Industry',
    category: 'Homepage',
    cmsKey: 'industries',
    component: IndustryShowcaseSection,
    defaultSortOrder: 3,
  },
  {
    id: 'valueChain',
    label: 'One Platform — Every Business Function',
    category: 'Homepage',
    cmsKey: 'valueChain',
    component: ErpModulesSection,
    defaultSortOrder: 4,
  },
  {
    id: 'demoCta',
    label: 'See DigitalManager in Action',
    category: 'Homepage',
    cmsKey: 'demoCta',
    component: DemoCTASection,
    defaultSortOrder: 5,
  },
  {
    id: 'modules',
    label: 'Powerful Modules — One Unified Platform',
    category: 'Homepage',
    cmsKey: 'modules',
    component: ModulesSection,
    defaultSortOrder: 6,
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    category: 'Homepage',
    cmsKey: 'testimonials',
    component: TestimonialsSection,
    defaultSortOrder: 7,
  },
  {
    id: 'personalizedDemo',
    label: 'Personalized Demo Form',
    category: 'Homepage',
    cmsKey: 'personalizedDemo',
    component: PersonalizedDemoSection,
    defaultSortOrder: 8,
  },
  {
    id: 'faqs',
    label: 'Frequently Asked Questions',
    category: 'Homepage',
    cmsKey: 'faqs',
    component: FAQSection,
    defaultSortOrder: 9,
  },
]

export const HOME_SECTION_IDS = new Set(HOME_SECTION_REGISTRY.map((s) => s.id))

export const DEPRECATED_HOME_SECTION_IDS = new Set([
  'workflow',
  'industries',
  'cta',
  'topBar',
  'footer',
])

const registryById = new Map(HOME_SECTION_REGISTRY.map((s) => [s.id, s]))

export function getHomeSectionDefinition(id: string): HomeSectionDefinition | undefined {
  return registryById.get(id as HomeSectionId)
}

export function isActiveHomeSectionId(id: string): id is HomeSectionId {
  return HOME_SECTION_IDS.has(id as HomeSectionId)
}
