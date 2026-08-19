import type { Bilingual } from '../cms/types'
import { pick } from '../cms/pick'
import type { Lang } from '../i18n/messages'
import { megaIndustryCatTitle, megaIndustryLabel } from '../i18n/megaLabels'
import {
  homeIndustryShowcaseCards,
  industryImageFromHref,
  industryShowcaseCards,
} from './industryShowcaseCards'
import { industryCategories } from './megaMenu'
import { getIndustryHeroImageConfig } from './softwareDetail/industryHeroImages'

export type IndustrySoftwareLink = {
  slug: string
  label: string
  href: string
  priority?: number
}

export type HomeIndustryCardData = IndustryListingCardData

export type IndustryFilterCategory =
  | 'all'
  | 'retail-commerce'
  | 'manufacturing'
  | 'energy'
  | 'services'
  | 'agriculture'
  | 'logistics'
  | 'construction'

export type IndustryListingCardData = {
  id: string
  slug: string
  label: string
  title: string
  description: string
  image: string
  imageAlt: string
  viewAllHref: string
  solutions: IndustrySoftwareLink[]
  filterCategory: Exclude<IndustryFilterCategory, 'all'>
}

export type IndustryCardData = {
  id: string
  title: string
  description: string
  href: string
  image: string
  imageAlt: string
  useCmsLink: boolean
  softwareLinks?: IndustrySoftwareLink[]
}

type CmsIndustryItem = {
  id: string
  title?: Bilingual
  description?: Bilingual
  href?: string
  imageUrl?: string
  sortOrder?: number
  active?: boolean
}

export type IndustriesCmsBlock = {
  title?: Bilingual
  subtitle?: Bilingual
  eyebrow?: Bilingual
  viewAllLabel?: Bilingual
  items?: CmsIndustryItem[]
}

const HOME_PRIORITY_SLUGS = [
  'retail-management-software',
  'petrol-pump-software',
  'cloud-erp-software-for-textile-industries',
  'production-management-software',
  'supply-chain-management-software',
  'cloud-erp-software-for-services-business',
] as const

/** Approved homepage image overrides for inconsistent industry visuals. */
const INDUSTRY_IMAGE_OVERRIDES: Record<string, string> = {
  'cloud-erp-software-for-textile-industries':
    '/software-images/garments-manufacturing-software/hero.jpg',
  'cloud-erp-software-for-services-business':
    '/software-images/cloud-erp-software-for-services-business/meeting.jpg',
}

function resolveIndustryImage(href: string, imageUrl?: string): string {
  const slug = slugFromIndustryHref(href)
  if (slug && INDUSTRY_IMAGE_OVERRIDES[slug]) return INDUSTRY_IMAGE_OVERRIDES[slug]
  if (imageUrl?.trim()) return imageUrl.trim()
  return industryImageFromHref(href)
}

const ALT_BY_SLUG: Record<string, string> = {
  'retail-management-software': 'Retail management software',
  'petrol-pump-software': 'Petrol and gas station management software',
  'cloud-erp-software-for-textile-industries': 'Textile production and garment manufacturing',
  'production-management-software': 'Manufacturing ERP software',
  'supply-chain-management-software': 'Supply chain management software',
  'cloud-erp-software-for-services-business': 'Professional services and business management',
  'knitting-dyeing-industry-software': 'Knitting and dyeing industry software',
  'education-institute-management-software': 'Education institute management software',
  'cloud-erp-software-for-agriculture-business': 'Agriculture business ERP software',
  'hotel-management-software': 'Hotel and hospitality management software',
  'poultry-control-shed-management-software': 'Poultry management software',
  'logistics-transportation-software': 'Logistics and transportation software',
}

export function slugFromIndustryHref(href: string): string | null {
  return href.match(/\/software\/(?:industry\/)?([^/?#]+)/)?.[1] ?? null
}

export function industryImageAlt(title: string, href: string): string {
  const slug = slugFromIndustryHref(href)
  if (slug && ALT_BY_SLUG[slug]) return ALT_BY_SLUG[slug]
  return `${title} management software`
}

function cardFromFallback(
  card: (typeof industryShowcaseCards)[number],
  t: (key: string) => string,
): IndustryCardData {
  const title = t(`industryShowcase.card.${card.titleKey}.title`)
  const description = t(`industryShowcase.card.${card.descKey}.desc`)
  return {
    id: card.id,
    title,
    description,
    href: card.href,
    image: card.image,
    imageAlt: industryImageAlt(title, card.href),
    useCmsLink: false,
  }
}

export function getPublishedIndustries(
  block: IndustriesCmsBlock | undefined,
  lang: 'en' | 'ar',
  t: (key: string) => string,
): IndustryCardData[] {
  const cmsItems = block?.items
    ? [...block.items]
        .filter((x) => x.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  if (cmsItems.length > 0) {
    return cmsItems.map((item) => {
      const href = item.href?.trim() || '/'
      const title = item.title ? pick(item.title, lang) : ''
      const description = item.description ? pick(item.description, lang) : ''
      return {
        id: item.id,
        title,
        description,
        href,
        image: resolveIndustryImage(href, item.imageUrl),
        imageAlt: industryImageAlt(title, href),
        useCmsLink: true,
      }
    })
  }

  return industryShowcaseCards.map((card) => cardFromFallback(card, t))
}

export function formatIndustrySoftwareCount(count: number, t: (key: string) => string): string {
  return t('industryShowcase.softwareCount').replace('{{count}}', String(count))
}

export function formatMoreSolutionsLabel(count: number, t: (key: string) => string): string {
  const key = count === 1 ? 'industryShowcase.moreSolution' : 'industryShowcase.moreSolutions'
  return t(key).replace('{{count}}', String(count))
}

const HOME_CATEGORY_IDS = [
  'retail',
  'oil-gas',
  'textile',
  'manufacturing',
  'logistics',
  'smb',
] as const

/** Homepage card titles/images aligned with approved showcase reference. */
const HOME_CATEGORY_TITLE_KEYS: Record<(typeof HOME_CATEGORY_IDS)[number], string> = {
  retail: 'retail',
  'oil-gas': 'petrol',
  textile: 'textile',
  manufacturing: 'manufacturing',
  logistics: 'transportation',
  smb: 'services',
}

const HOME_CATEGORY_IMAGE_SLUGS: Record<(typeof HOME_CATEGORY_IDS)[number], string> = {
  retail: 'retail-management-software',
  'oil-gas': 'petrol-pump-software',
  textile: 'cloud-erp-software-for-textile-industries',
  manufacturing: 'production-management-software',
  logistics: 'logistics-transportation-software',
  smb: 'cloud-erp-software-for-services-business',
}

const LISTING_IMAGE_SLUGS: Record<string, string> = {
  'oil-gas': 'petrol-pump-software',
  textile: 'cloud-erp-software-for-textile-industries',
  manufacturing: 'garments-manufacturing-software',
  retail: 'retail-management-software',
  smb: 'cloud-erp-software-for-services-business',
  medical: 'pharmacy-business-management-software',
  hospitality: 'hotel-management-software',
  logistics: 'logistics-transportation-software',
  poultry: 'poultry-control-shed-management-software',
  agriculture: 'cloud-erp-software-for-agriculture-business',
  construction: 'marble-and-granite-factory-software',
  'real-estate': 'erp-software-for-real-estate-business',
  visa: 'software-for-visa-immigration-consultants',
  electronics: 'computers-laptop-business-software',
}

const CATEGORY_FILTER: Record<string, Exclude<IndustryFilterCategory, 'all'>> = {
  'oil-gas': 'energy',
  textile: 'retail-commerce',
  manufacturing: 'manufacturing',
  retail: 'retail-commerce',
  smb: 'services',
  medical: 'services',
  hospitality: 'services',
  logistics: 'logistics',
  poultry: 'agriculture',
  agriculture: 'agriculture',
  construction: 'construction',
  'real-estate': 'construction',
  visa: 'services',
  electronics: 'retail-commerce',
}

export const INDUSTRY_FILTER_GROUPS: Record<
  Exclude<IndustryFilterCategory, 'all'>,
  readonly string[]
> = {
  'retail-commerce': ['retail', 'electronics', 'textile'],
  manufacturing: ['manufacturing'],
  energy: ['oil-gas'],
  services: ['smb', 'medical', 'hospitality', 'visa'],
  agriculture: ['agriculture', 'poultry'],
  logistics: ['logistics'],
  construction: ['construction', 'real-estate'],
}

export const INDUSTRY_FILTER_ORDER: Exclude<IndustryFilterCategory, 'all'>[] = [
  'retail-commerce',
  'manufacturing',
  'energy',
  'services',
  'agriculture',
  'logistics',
  'construction',
]

function findCmsItemForListingCategory(
  block: IndustriesCmsBlock | undefined,
  catId: string,
  primarySlug: string,
): CmsIndustryItem | undefined {
  const items = block?.items?.filter((x) => x.active !== false) ?? []
  const byPrimary = items.find(
    (item) => slugFromIndustryHref(item.href?.trim() || '') === primarySlug,
  )
  if (byPrimary) return byPrimary

  const cat = industryCategories.find((c) => c.id === catId)
  if (!cat) return undefined
  const slugs = new Set(cat.links.map((l) => l.slug))
  return items.find((item) => {
    const slug = slugFromIndustryHref(item.href?.trim() || '')
    return slug ? slugs.has(slug) : false
  })
}

function buildListingCardData(
  cat: (typeof industryCategories)[number],
  lang: Lang,
  t: (key: string) => string,
  block?: IndustriesCmsBlock,
): IndustryListingCardData {
  const imageSlug = LISTING_IMAGE_SLUGS[cat.id] ?? cat.links[0].slug
  const imageLink = cat.links.find((l) => l.slug === imageSlug) ?? cat.links[0]
  const hero = getIndustryHeroImageConfig(imageSlug, imageLink.labelEn)
  const cmsItem = findCmsItemForListingCategory(block, cat.id, imageSlug)

  const title = cmsItem?.title
    ? pick(cmsItem.title, lang)
    : megaIndustryCatTitle(lang, cat.id, cat.titleEn)
  const description = cmsItem?.description
    ? pick(cmsItem.description, lang)
    : t(`industryListing.categories.${cat.id}.desc`)
  const label = t(`industryListing.categories.${cat.id}.label`)
  const cmsHref = cmsItem?.href?.trim()
  const image = cmsItem
    ? resolveIndustryImage(cmsHref || hero.src, cmsItem.imageUrl)
    : hero.src

  return {
    id: cat.id,
    slug: cat.id,
    label,
    title,
    description,
    image,
    imageAlt: industryImageAlt(title, cmsHref || imageLink.to),
    viewAllHref: `/industries#${cat.id}`,
    solutions: solutionsFromCategory(cat, lang),
    filterCategory: CATEGORY_FILTER[cat.id] ?? 'services',
  }
}

/** All industry categories for the /industries listing page. */
export function getIndustryListingCards(
  block: IndustriesCmsBlock | undefined,
  lang: Lang,
  t: (key: string) => string,
): IndustryListingCardData[] {
  return industryCategories.map((cat) => buildListingCardData(cat, lang, t, block))
}

function solutionsFromCategory(
  cat: (typeof industryCategories)[number],
  lang: Lang,
): IndustrySoftwareLink[] {
  return cat.links.map((link, index) => ({
    slug: link.slug,
    label: megaIndustryLabel(lang, link.slug, link.labelEn),
    href: link.to,
    priority: index,
  }))
}

function findCmsItemForHomeCategory(
  block: IndustriesCmsBlock | undefined,
  catId: (typeof HOME_CATEGORY_IDS)[number],
): CmsIndustryItem | undefined {
  const primarySlug = HOME_CATEGORY_IMAGE_SLUGS[catId]
  return findCmsItemForListingCategory(block, catId, primarySlug)
}

/** Homepage “Built for Your Industry” cards — three priority links + footer action. */
export function getHomepageShowcaseCards(
  block: IndustriesCmsBlock | undefined,
  lang: Lang,
  t: (key: string) => string,
): IndustryListingCardData[] {
  return HOME_CATEGORY_IDS.map((catId) => {
    const cat = industryCategories.find((c) => c.id === catId)
    if (!cat) throw new Error(`Missing industry category: ${catId}`)

    const titleKey = HOME_CATEGORY_TITLE_KEYS[catId]
    const cmsItem = findCmsItemForHomeCategory(block, catId)
    const imageSlug = HOME_CATEGORY_IMAGE_SLUGS[catId]
    const imageLink = cat.links.find((l) => l.slug === imageSlug) ?? cat.links[0]
    const hero = getIndustryHeroImageConfig(imageSlug, imageLink.labelEn)

    const title = cmsItem?.title
      ? pick(cmsItem.title, lang)
      : t(`industryShowcase.card.${titleKey}.title`)
    const description = cmsItem?.description
      ? pick(cmsItem.description, lang)
      : t(`industryShowcase.homeCard.${titleKey}.desc`)
    const label = t(`industryShowcase.homeCard.${titleKey}.label`)
    const cmsHref = cmsItem?.href?.trim()
    const image = cmsItem
      ? resolveIndustryImage(cmsHref || hero.src, cmsItem.imageUrl)
      : hero.src

    return {
      id: catId,
      slug: catId,
      label,
      title,
      description,
      image,
      imageAlt: industryImageAlt(title, cmsHref || imageLink.to),
      viewAllHref: `/industries#${catId}`,
      solutions: solutionsFromCategory(cat, lang),
      filterCategory: CATEGORY_FILTER[catId] ?? 'services',
    }
  })
}

function categoryToCardData(
  cat: (typeof industryCategories)[number],
  lang: Lang,
  options?: { title?: string; imageSlug?: string },
): IndustryCardData {
  const imageSlug = options?.imageSlug ?? cat.links[0].slug
  const imageLink = cat.links.find((l) => l.slug === imageSlug) ?? cat.links[0]
  const hero = getIndustryHeroImageConfig(imageSlug, imageLink.labelEn)
  const title = options?.title ?? megaIndustryCatTitle(lang, cat.id, cat.titleEn)

  return {
    id: cat.id,
    title,
    description: '',
    softwareLinks: cat.links.map((link) => ({
      slug: link.slug,
      label: megaIndustryLabel(lang, link.slug, link.labelEn),
      href: link.to,
    })),
    href: `/industries#${cat.id}`,
    image: hero.src,
    imageAlt: hero.alt,
    useCmsLink: false,
  }
}

/** Six priority mega-menu categories for the homepage industry grid. */
export function getHomepageCategoryCards(
  lang: Lang,
  t: (key: string) => string,
): IndustryCardData[] {
  return HOME_CATEGORY_IDS.map((catId) => {
    const cat = industryCategories.find((c) => c.id === catId)
    if (!cat) throw new Error(`Missing industry category: ${catId}`)
    const titleKey = HOME_CATEGORY_TITLE_KEYS[catId]
    const title = t(`industryShowcase.card.${titleKey}.title`)
    const imageSlug = HOME_CATEGORY_IMAGE_SLUGS[catId]
    return categoryToCardData(cat, lang, { title, imageSlug })
  })
}

/** Mega-menu industry categories for the /industries page. */
export function getIndustryCategoryCards(lang: Lang): IndustryCardData[] {
  return industryCategories.map((cat) => categoryToCardData(cat, lang))
}

export function getHomepageIndustries(
  allIndustries: IndustryCardData[],
  t: (key: string) => string,
): IndustryCardData[] {
  const bySlug = new Map<string, IndustryCardData>()
  for (const item of allIndustries) {
    const slug = slugFromIndustryHref(item.href)
    if (slug) bySlug.set(slug, item)
  }

  const priority = HOME_PRIORITY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (item): item is IndustryCardData => Boolean(item),
  )

  if (priority.length >= 6) return priority.slice(0, 6)
  if (priority.length > 0) return priority

  return homeIndustryShowcaseCards().map((card) => cardFromFallback(card, t))
}
