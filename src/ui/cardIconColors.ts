/** Shared icon accent colors (hex) — homepage, mega menu, listings, detail pages. */

import type { LucideIcon } from 'lucide-react'
import { industryCategories, moduleMegaItems } from '../data/megaMenu'
import { industryProgrammeCards } from '../data/industryProgrammeCards'

export type CardIconStyle = {
  accent: string
}

const DEFAULT_HEX = '#ff7a45'

function style(hex: string): CardIconStyle {
  return { accent: hex }
}

const moduleSlugAliases: Record<string, string> = {
  'point-of-sale-software': 'point-of-sale-management-software',
  'sms-integration-system': 'integration-system',
}

const moduleCardIcons: Record<string, string> = {
  'accounts-management-software': '#ff7a45',
  'inventory-management-software': '#16a34a',
  'production-management-software': '#2563eb',
  'payroll-management-software': '#991b1b',
  'point-of-sale-management-software': '#7c3aed',
  'integration-system': '#84cc16',
  'fbr-pos-integration-software': '#ef233c',
  'crm-software': '#db2777',
  'reports-bi-software': '#f59e0b',
}

/** Mega menu industry category → accent (aligned with homepage + GCC ERP palette). */
export const industryCategoryAccentHex: Record<string, string> = {
  'oil-gas': '#f97316',
  retail: '#10b981',
  textile: '#ec4899',
  manufacturing: '#2563eb',
  smb: '#0ea5e9',
  medical: '#7c3aed',
  hospitality: '#1e3a5f',
  logistics: '#f97316',
  poultry: '#ec4899',
  agriculture: '#06b6d4',
  construction: '#84cc16',
  'real-estate': '#14b8a6',
  visa: '#db2777',
  electronics: '#1e293b',
}

const industryCardIcons: Record<string, string> = {
  petrol: '#f97316',
  general: '#10b981',
  retail: '#10b981',
  fbr: '#ef4444',
  poultry: '#ec4899',
  dairy: '#06b6d4',
  lpg: '#f59e0b',
  installment: '#14b8a6',
  manuf: '#2563eb',
  trading: '#f97316',
  water: '#8b5cf6',
  workshop: '#0f766e',
  school: '#f97316',
  realestate: '#14b8a6',
  service: '#84cc16',
}

const valueChainCardIcons: CardIconStyle[] = [
  style('#ff7a45'),
  style('#2563eb'),
  style('#10b981'),
  style('#db2777'),
  style('#16a34a'),
  style('#f59e0b'),
]

const moduleFallbackOrder = Object.values(moduleCardIcons).map((hex) => style(hex))
const industryFallbackOrder = Object.values(industryCardIcons).map((hex) => style(hex))

function normalizeModuleSlug(slug?: string): string | undefined {
  if (!slug) return undefined
  return moduleSlugAliases[slug] ?? slug
}

function slugFromHref(href?: string): string | undefined {
  if (!href) return undefined
  const match = href.match(/\/software\/(?:industry\/)?([^/?#]+)/)
  return match?.[1]
}

export function findIndustryCategoryId(slug: string): string | undefined {
  for (const cat of industryCategories) {
    if (cat.links.some((l) => l.slug === slug)) return cat.id
  }
  return undefined
}

function industryCardKeyFromSlug(slug: string): string | undefined {
  const hit = industryProgrammeCards.find(
    (c) => c.exploreTo === slug || c.exploreTo.endsWith(`/${slug}`) || c.exploreTo.includes(slug),
  )
  return hit?.cardKey
}

export type SoftwareIconAccentOpts = {
  slug?: string
  kind?: 'module' | 'industry'
  cardKey?: string
  categoryId?: string
  index?: number
}

/** Single resolver for icon accent across homepage, listings, and detail pages. */
export function softwareIconAccent(opts: SoftwareIconAccentOpts): string {
  const { slug, kind, cardKey, categoryId, index = 0 } = opts

  if (cardKey && industryCardIcons[cardKey]) return industryCardIcons[cardKey]

  if (categoryId && industryCategoryAccentHex[categoryId]) {
    return industryCategoryAccentHex[categoryId]
  }

  if (slug) {
    const moduleSlug = normalizeModuleSlug(slug)
    const isModule =
      kind === 'module' ||
      (kind !== 'industry' && moduleMegaItems.some((m) => m.slug === moduleSlug || m.slug === slug))

    if (isModule && moduleSlug && moduleCardIcons[moduleSlug]) {
      return moduleCardIcons[moduleSlug]
    }

    const catId = findIndustryCategoryId(slug)
    if (catId && industryCategoryAccentHex[catId]) {
      return industryCategoryAccentHex[catId]
    }

    const fromCardKey = industryCardKeyFromSlug(slug)
    if (fromCardKey && industryCardIcons[fromCardKey]) {
      return industryCardIcons[fromCardKey]
    }
  }

  if (kind === 'industry') {
    return industryFallbackOrder[index % industryFallbackOrder.length]?.accent ?? DEFAULT_HEX
  }

  return moduleFallbackOrder[index % moduleFallbackOrder.length]?.accent ?? DEFAULT_HEX
}

export function moduleCardIconStyle(slugOrHref?: string, index = 0): CardIconStyle {
  const raw = slugOrHref?.includes('/') ? slugFromHref(slugOrHref) ?? slugOrHref : slugOrHref
  const slug = normalizeModuleSlug(raw)
  const accent = softwareIconAccent({ slug, kind: 'module', index })
  return style(accent)
}

export function industryCardIconStyle(cardKey?: string, index = 0): CardIconStyle {
  const accent = softwareIconAccent({ cardKey, kind: 'industry', index })
  return style(accent)
}

export function valueChainCardIconStyle(index: number): CardIconStyle {
  return valueChainCardIcons[index % valueChainCardIcons.length] ?? style(DEFAULT_HEX)
}

/** Rotating high-contrast palette for detail-page card icons (features, steps, stats). */
export const DETAIL_ICON_PALETTE = [
  '#ff7448',
  '#2563eb',
  '#16a34a',
  '#0f9f9a',
  '#7c3aed',
  '#db2777',
  '#dc2626',
  '#f59e0b',
  '#06b6d4',
  '#0f172a',
] as const

export function detailCardIconAccent(index: number): string {
  return DETAIL_ICON_PALETTE[index % DETAIL_ICON_PALETTE.length] ?? DETAIL_ICON_PALETTE[0]
}

export function isModuleSlug(slug: string): boolean {
  const normalized = normalizeModuleSlug(slug)
  return moduleMegaItems.some((m) => m.slug === normalized || m.slug === slug)
}

function lucideComponentName(icon: LucideIcon): string {
  const name = (icon as LucideIcon & { displayName?: string }).displayName
  return name && name !== 'default' ? name : 'Circle'
}

/** Lucide icon name for detail-page hero badges (module, category, or programme card). */
export function softwarePageIconName(slug: string, kind?: 'module' | 'industry'): string {
  const moduleSlug = normalizeModuleSlug(slug)
  const asModule = kind === 'module' || (kind !== 'industry' && isModuleSlug(slug))

  if (asModule) {
    const mod = moduleMegaItems.find((m) => m.slug === moduleSlug || m.to === `/software/${slug}`)
    if (mod) return lucideComponentName(mod.icon)
  }

  const catId = findIndustryCategoryId(slug)
  if (catId) {
    const cat = industryCategories.find((c) => c.id === catId)
    if (cat) return lucideComponentName(cat.icon)
  }

  const cardKey = industryCardKeyFromSlug(slug)
  if (cardKey) {
    const card = industryProgrammeCards.find((c) => c.cardKey === cardKey)
    if (card) return lucideComponentName(card.icon)
  }

  return 'Circle'
}
