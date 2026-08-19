import { industryCategories, moduleMegaItems } from '../megaMenu'
import type { PremiumPhotoPaths } from './premiumImagePacks'

export type DetailPhotoSlot = keyof PremiumPhotoPaths

export type DetailSectionKey =
  | 'hero'
  | 'metrics'
  | 'workflow'
  | 'overview'
  | 'imageFeatures'
  | 'annotatedView'
  | 'challengeSolution'
  | 'alternatingBenefits'
  | 'roles'
  | 'testimonial'
  | 'capabilities'
  | 'industriesSection'
  | 'implementation'
  | 'demo'
  | 'faqs'

export type DetailVisibleSections = Record<DetailSectionKey, boolean>

export type DetailPageConfig = {
  slug: string
  type: 'module' | 'industry'
  contentSource: 'detail'
  heroImage: DetailPhotoSlot
  featureImages: DetailPhotoSlot[]
  overviewScreenshot: DetailPhotoSlot
  dashboardScreenshot: DetailPhotoSlot
  visibleSections: DetailVisibleSections
}

const ALL_SECTIONS_ON: DetailVisibleSections = {
  hero: true,
  metrics: true,
  workflow: true,
  overview: true,
  imageFeatures: true,
  annotatedView: true,
  challengeSolution: true,
  alternatingBenefits: true,
  roles: true,
  testimonial: true,
  capabilities: true,
  industriesSection: true,
  implementation: true,
  demo: true,
  faqs: true,
}

const MODULE_OVERRIDES: Partial<DetailVisibleSections> = {
  roles: false,
}

const INDUSTRY_OVERRIDES: Partial<DetailVisibleSections> = {
  roles: true,
}

/** Route aliases where URL segment differs from canonical data slug. */
const SLUG_ALIASES: Record<string, string> = {
  'point-of-sale-software': 'point-of-sale-management-software',
  'sms-integration-system': 'integration-system',
}

function defaultFeatureImages(slug: string): DetailPhotoSlot[] {
  const hash = slug.length % 3
  const pools: DetailPhotoSlot[][] = [
    ['heroTeam', 'teamMeeting', 'ledgerOffice', 'financialReports', 'dashboard'],
    ['teamMeeting', 'heroTeam', 'dashboard', 'ledgerOffice', 'financialReports'],
    ['ledgerOffice', 'heroTeam', 'teamMeeting', 'financialReports', 'dashboard'],
  ]
  return pools[hash] ?? pools[0]
}

function heroSlotForSlug(slug: string): DetailPhotoSlot {
  if (/petrol|fuel|oil|lpg|fleet|tank|bowser|depot/.test(slug)) return 'heroTeam'
  if (/payroll|hr|staff|poultry|visa|hotel/.test(slug)) return 'teamMeeting'
  if (/account|finance|crm|integration|sms/.test(slug)) return 'teamMeeting'
  return 'heroTeam'
}

function overviewSlotForSlug(slug: string): DetailPhotoSlot {
  if (/account|finance/.test(slug)) return 'ledgerOffice'
  return 'dashboard'
}

function buildConfig(slug: string, type: 'module' | 'industry'): DetailPageConfig {
  return {
    slug,
    type,
    contentSource: 'detail',
    heroImage: heroSlotForSlug(slug),
    featureImages: defaultFeatureImages(slug),
    overviewScreenshot: overviewSlotForSlug(slug),
    dashboardScreenshot: 'dashboard',
    visibleSections: {
      ...ALL_SECTIONS_ON,
      ...(type === 'module' ? MODULE_OVERRIDES : INDUSTRY_OVERRIDES),
    },
  }
}

function registerConfigs(): Record<string, DetailPageConfig> {
  const out: Record<string, DetailPageConfig> = {}

  for (const item of moduleMegaItems) {
    out[item.slug] = buildConfig(item.slug, 'module')
    const pathSlug = item.to.match(/\/software\/([^/?#]+)/)?.[1]
    if (pathSlug && pathSlug !== item.slug) {
      out[pathSlug] = { ...buildConfig(item.slug, 'module'), slug: item.slug }
    }
  }

  for (const cat of industryCategories) {
    for (const link of cat.links) {
      out[link.slug] = buildConfig(link.slug, 'industry')
    }
  }

  for (const [alias, canonical] of Object.entries(SLUG_ALIASES)) {
    if (out[canonical]) {
      out[alias] = { ...out[canonical], slug: canonical }
    }
  }

  return out
}

/** Per-route layout + image mapping for every mega-menu detail page. */
export const detailPageConfig: Record<string, DetailPageConfig> = registerConfigs()

export function getDetailPageConfig(slug: string, kind: 'module' | 'industry'): DetailPageConfig {
  const resolved = SLUG_ALIASES[slug] ?? slug
  return detailPageConfig[slug] ?? detailPageConfig[resolved] ?? buildConfig(resolved, kind)
}

export function slugImagePath(slug: string, slot: DetailPhotoSlot): string {
  const file =
    slot === 'heroTeam'
      ? 'hero'
      : slot === 'teamMeeting'
        ? 'meeting'
        : slot === 'financialReports'
          ? 'reports'
          : slot === 'ledgerOffice'
            ? 'ledger'
            : 'dashboard'
  return `/software-images/${slug}/${file}.jpg`
}

export function resolveSlugPhoto(paths: PremiumPhotoPaths, slot: DetailPhotoSlot, slug: string): string {
  return paths[slot] || slugImagePath(slug, slot)
}

export function slugPhotoFallbackChain(slug: string, slots: DetailPhotoSlot[]): string[] {
  return slots.map((slot) => slugImagePath(slug, slot))
}

/** @deprecated use DetailPageConfig */
export type DetailPageSlugConfig = DetailPageConfig & {
  kind: 'module' | 'industry'
  overviewImage: DetailPhotoSlot
  dashboardImage: DetailPhotoSlot
}

export function asLegacyConfig(config: DetailPageConfig): DetailPageSlugConfig {
  return {
    ...config,
    kind: config.type,
    overviewImage: config.overviewScreenshot,
    dashboardImage: config.dashboardScreenshot,
  }
}
