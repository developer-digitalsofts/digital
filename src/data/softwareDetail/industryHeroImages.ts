import { industryCategories } from '../megaMenu'
import { resolvePublicMediaUrl } from '../../cms/publicMediaUrl'
import type { SoftwareDetailPageData } from './types'
import { getPremiumPhotoPaths, type PremiumPhotoPaths } from './premiumImagePacks'
import { resolveSlugPhoto, slugImagePath, type DetailPhotoSlot } from './detailPageConfig'

export type IndustryHeroImageConfig = {
  src: string
  alt: string
  objectPosition: string
}

/** Neutral business fallback — never reuse logistics/inventory warehouse art. */
export const INDUSTRY_HERO_NEUTRAL_FALLBACK = '/software-images/small-and-medium-business-erp-software/hero.jpg'

const LANDSCAPE_SLOTS: DetailPhotoSlot[] = [
  'heroTeam',
  'teamMeeting',
  'financialReports',
  'ledgerOffice',
  'dashboard',
]

/**
 * Slugs whose default hero.jpg is portrait or poorly cropped — use a landscape slot instead.
 * Values verified against public/software-images/* assets (1600px wide minimum).
 */
const HERO_SLOT_OVERRIDES: Partial<Record<string, DetailPhotoSlot>> = {
  'fleet-fuel-management-software': 'teamMeeting',
  'fabric-store-management-software': 'financialReports',
  'installment-management-software': 'teamMeeting',
  'logistics-transportation-software': 'teamMeeting',
  'motor-market-management-software': 'dashboard',
  'poultry-control-shed-management-software': 'teamMeeting',
  'plastic-pipes-fitting-industry-software': 'teamMeeting',
  'ceiling-and-wall-paneling-store-software': 'teamMeeting',
  'tiles-and-ceramics-store-software': 'teamMeeting',
  'computers-laptop-business-software': 'financialReports',
  'electric-store-management-software': 'teamMeeting',
  'mobile-accessories-business-software': 'ledgerOffice',
}

const CATEGORY_POSITION: Record<string, string> = {
  'oil-gas': 'center 42%',
  textile: 'center 40%',
  manufacturing: 'center 45%',
  retail: 'center 38%',
  smb: 'center center',
  medical: 'center 35%',
  hospitality: 'center 40%',
  logistics: 'center 45%',
  poultry: 'center 42%',
  agriculture: 'center 40%',
  construction: 'center 45%',
  'real-estate': 'center 40%',
  visa: 'center 35%',
  electronics: 'center 40%',
}

const CATEGORY_ALT: Record<string, string> = {
  'oil-gas': 'Operational petrol, CNG or fuel station',
  textile: 'Textile machinery and fabric production line',
  manufacturing: 'Active factory production floor',
  retail: 'Modern retail or supermarket operation',
  smb: 'Professional business team at work',
  medical: 'Pharmacy or healthcare operation',
  hospitality: 'Hotel reception or restaurant service',
  logistics: 'Trucks, loading hub or distribution centre',
  poultry: 'Commercial poultry farm operation',
  agriculture: 'Active farm, crops or agricultural machinery',
  construction: 'Active construction project site',
  'real-estate': 'Commercial property and real-estate operations',
  visa: 'Professional visa consultation office',
  electronics: 'Electronics retail or assembly operation',
}

const SLUG_ALT: Partial<Record<string, string>> = {
  'petrol-pump-software': 'Modern petrol station forecourt operations',
  'petrol-gas-filling-station-software': 'Petrol and CNG filling station operations',
  'logistics-transportation-software': 'Logistics fleet, loading and distribution operations',
  'garments-manufacturing-software': 'Garments manufacturing production floor',
  'cloud-erp-software-for-textile-industries': 'Textile production and fabric processing',
  'poultry-control-shed-management-software': 'Commercial poultry control shed operation',
  'software-for-visa-immigration-consultants': 'Visa and immigration consultancy office',
}

const SLUG_POSITION: Partial<Record<string, string>> = {
  'petrol-gas-filling-station-software': 'center 38%',
  'petrol-pump-software': 'center 38%',
  'logistics-transportation-software': 'center 42%',
  'garments-manufacturing-software': 'center 45%',
  'erp-software-for-construction-business': 'center 40%',
}

const slugCategory = new Map<string, string>()

for (const cat of industryCategories) {
  for (const link of cat.links) {
    slugCategory.set(link.slug, cat.id)
  }
}

export function industryCategoryForSlug(slug: string): string {
  return slugCategory.get(slug) ?? 'smb'
}

function altForSlug(slug: string, productLabel: string): string {
  return SLUG_ALT[slug] ?? CATEGORY_ALT[industryCategoryForSlug(slug)] ?? `${productLabel} operations`
}

function objectPositionForSlug(slug: string): string {
  return SLUG_POSITION[slug] ?? CATEGORY_POSITION[industryCategoryForSlug(slug)] ?? 'center'
}

function heroSlotForSlug(slug: string): DetailPhotoSlot {
  return HERO_SLOT_OVERRIDES[slug] ?? 'heroTeam'
}

function landscapeFallbackChain(
  paths: PremiumPhotoPaths,
  slug: string,
  primary: string,
): string[] {
  const chain: string[] = []
  for (const slot of LANDSCAPE_SLOTS) {
    const candidate = resolveSlugPhoto(paths, slot, slug)
    if (candidate !== primary && !chain.includes(candidate)) {
      chain.push(candidate)
    }
  }
  if (!chain.includes(INDUSTRY_HERO_NEUTRAL_FALLBACK) && primary !== INDUSTRY_HERO_NEUTRAL_FALLBACK) {
    chain.push(INDUSTRY_HERO_NEUTRAL_FALLBACK)
  }
  return chain
}

/** Explicit mapped hero image for an industry slug (before CMS override). */
export function getIndustryHeroImageConfig(slug: string, productLabel: string): IndustryHeroImageConfig {
  const paths = getPremiumPhotoPaths(slug)
  const slot = heroSlotForSlug(slug)
  const src = resolveSlugPhoto(paths, slot, slug)

  return {
    src,
    alt: altForSlug(slug, productLabel),
    objectPosition: objectPositionForSlug(slug),
  }
}

/** CMS hero wins; otherwise slug-mapped landscape image with safe fallbacks. */
export function resolveIndustryHeroImage(
  detail: SoftwareDetailPageData,
  slug: string,
  productLabel: string,
): IndustryHeroImageConfig & { fallbacks: string[] } {
  const mapped = getIndustryHeroImageConfig(slug, productLabel)
  const paths = getPremiumPhotoPaths(slug)
  const cms = detail.heroImageUrl?.trim()

  if (cms && !/dashboard|reports\.jpg|accounting-dashboard/i.test(cms)) {
    const cmsSrc = resolvePublicMediaUrl(cms)
    return {
      src: cmsSrc,
      alt: mapped.alt,
      objectPosition: mapped.objectPosition,
      fallbacks: landscapeFallbackChain(paths, slug, cmsSrc),
    }
  }

  return {
    ...mapped,
    fallbacks: landscapeFallbackChain(paths, slug, mapped.src),
  }
}

/** All configured industry slugs from the mega menu. */
export function allIndustryHeroSlugs(): string[] {
  return industryCategories.flatMap((cat) => cat.links.map((link) => link.slug))
}

/** Dev helper — returns mapped hero path for audit scripts. */
export function mappedHeroPath(slug: string): string {
  const slot = heroSlotForSlug(slug)
  return slugImagePath(slug, slot)
}
