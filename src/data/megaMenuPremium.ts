import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Droplets,
  Factory,
  LayoutGrid,
  ShoppingBag,
  Wheat,
} from 'lucide-react'
import { industryCategories, moduleMegaItems, type MegaLink, type ModuleMegaItem } from './megaMenu'
import { getIndustryHeroImageConfig } from './softwareDetail/industryHeroImages'

/** Six primary modules shown simultaneously in the desktop mega menu (3×2). */
export const MODULE_MEGA_PRIMARY_SLUGS = [
  'accounts-management-software',
  'inventory-management-software',
  'point-of-sale-management-software',
  'payroll-management-software',
  'crm-software',
  'production-management-software',
] as const

const MODULE_SHORT_DESC: Record<string, string> = {
  'accounts-management-software': 'Ledgers, vouchers, cash flow and bank control',
  'inventory-management-software': 'Stock levels, transfers and warehouse control',
  'point-of-sale-management-software': 'Fast checkout, billing and retail sales',
  'payroll-management-software': 'Salaries, attendance and workforce payroll',
  'crm-software': 'Leads, follow-ups and customer pipeline',
  'production-management-software': 'Work orders, BOM and shop-floor visibility',
}

export type ModuleMegaCard = ModuleMegaItem & { description: string }

export function getPrimaryModuleMegaCards(): ModuleMegaCard[] {
  return MODULE_MEGA_PRIMARY_SLUGS.map((slug) => {
    const item = moduleMegaItems.find((m) => m.slug === slug)
    if (!item) return null
    return {
      ...item,
      description: MODULE_SHORT_DESC[slug] ?? item.labelEn,
    }
  }).filter(Boolean) as ModuleMegaCard[]
}

export type IndustryMegaGroup = {
  id: string
  title: string
  icon: LucideIcon
  /** Source category ids from `industryCategories` */
  categoryIds: string[]
  featured: {
    badge: string
    heading: string
    benefits: [string, string]
    ctaLabel: string
    ctaTo: string
    imageAlt: string
  }
}

/** Desktop industry sidebar groups — built from real `industryCategories` links. */
export const industryMegaGroups: IndustryMegaGroup[] = [
  {
    id: 'retail-distribution',
    title: 'Retail & Distribution',
    icon: ShoppingBag,
    categoryIds: ['retail', 'logistics'],
    featured: {
      badge: 'FEATURED SOLUTION',
      heading: 'Retail operations in one place',
      benefits: [
        'POS, inventory and purchasing connected in real time.',
        'Multi-branch stock and sales visibility for every store.',
      ],
      ctaLabel: 'Explore Retail Software',
      ctaTo: '/software/industry/retail-management-software',
      imageAlt: 'Retail store management software',
    },
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    icon: Factory,
    categoryIds: ['manufacturing', 'textile'],
    featured: {
      badge: 'FEATURED SOLUTION',
      heading: 'Production built for manufacturers',
      benefits: [
        'BOM, work orders and shop-floor tracking in one system.',
        'Link production output to inventory and accounts.',
      ],
      ctaLabel: 'Explore Manufacturing Software',
      ctaTo: '/software/industry/garments-manufacturing-software',
      imageAlt: 'Manufacturing ERP software',
    },
  },
  {
    id: 'energy-fuel',
    title: 'Energy & Fuel',
    icon: Droplets,
    categoryIds: ['oil-gas'],
    featured: {
      badge: 'FEATURED SOLUTION',
      heading: 'Complete control for every litre',
      benefits: [
        'Real-time monitoring of tanks, nozzles and sales.',
        'Accurate accounts, inventory and compliance in one place.',
      ],
      ctaLabel: 'Explore Petrol Software',
      ctaTo: '/software/industry/petrol-pump-software',
      imageAlt: 'Petrol station management software',
    },
  },
  {
    id: 'services',
    title: 'Services',
    icon: Briefcase,
    categoryIds: ['smb', 'medical', 'hospitality', 'visa'],
    featured: {
      badge: 'FEATURED SOLUTION',
      heading: 'Service businesses, simplified',
      benefits: [
        'Manage jobs, billing and customers from one workspace.',
        'Built for professional services and growing SMEs.',
      ],
      ctaLabel: 'Explore Services Software',
      ctaTo: '/software/industry/cloud-erp-software-for-services-business',
      imageAlt: 'Services business ERP software',
    },
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    icon: Wheat,
    categoryIds: ['agriculture', 'poultry'],
    featured: {
      badge: 'FEATURED SOLUTION',
      heading: 'Farm-to-ledger visibility',
      benefits: [
        'Track livestock, feed, harvest and inventory together.',
        'Keep costs and sales aligned across farm operations.',
      ],
      ctaLabel: 'Explore Agriculture Software',
      ctaTo: '/software/industry/cloud-erp-software-for-agriculture-business',
      imageAlt: 'Agriculture business management software',
    },
  },
]

export const industryMegaAllLink = {
  id: 'all-industries',
  title: 'All Industries',
  icon: LayoutGrid,
  to: '/industries',
} as const

const SOLUTION_DESC_FALLBACK =
  'Purpose-built ERP tools for daily operations, inventory and reporting.'

function shortSolutionDesc(labelEn: string): string {
  const cleaned = labelEn.replace(/\s+Software$/i, '').trim()
  return `${cleaned} software tailored for your industry workflows.`
}

export function getIndustryGroupSolutions(groupId: string, limit = 4): (MegaLink & { description: string })[] {
  const group = industryMegaGroups.find((g) => g.id === groupId)
  if (!group) return []
  const links: MegaLink[] = []
  for (const catId of group.categoryIds) {
    const cat = industryCategories.find((c) => c.id === catId)
    if (!cat) continue
    for (const link of cat.links) links.push(link)
  }
  return links.slice(0, limit).map((link) => ({
    ...link,
    description: shortSolutionDesc(link.labelEn) || SOLUTION_DESC_FALLBACK,
  }))
}

export function getIndustryGroupFeaturedImage(groupId: string): { src: string; alt: string } {
  const group = industryMegaGroups.find((g) => g.id === groupId)
  const first = getIndustryGroupSolutions(groupId, 1)[0]
  if (!first) {
    return { src: '', alt: group?.featured.imageAlt ?? 'Industry solution' }
  }
  const mapped = getIndustryHeroImageConfig(first.slug, first.labelEn)
  return {
    src: mapped.src,
    alt: group?.featured.imageAlt || mapped.alt,
  }
}
