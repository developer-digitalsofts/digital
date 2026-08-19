import type { LucideIcon } from 'lucide-react'
import {
  Folder,
  Landmark,
  Package,
  PieChart,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import { moduleExplorerCards } from './moduleExplorerCards'

export type PowerfulModuleCardDef = {
  key: string
  slug: string
  icon: LucideIcon
  number: string
}

/** Six editorial cards — Option A order; links resolve from CMS or moduleExplorerCards. */
export const powerfulModulesCards: PowerfulModuleCardDef[] = [
  { key: 'sales', slug: 'crm-software', icon: ShoppingBag, number: '01' },
  { key: 'inventory', slug: 'inventory-management-software', icon: Package, number: '02' },
  { key: 'finance', slug: 'accounts-management-software', icon: Landmark, number: '03' },
  { key: 'hr', slug: 'payroll-management-software', icon: UserRound, number: '04' },
  { key: 'project', slug: 'production-management-software', icon: Folder, number: '05' },
  { key: 'reports', slug: 'fbr-pos-integration-software', icon: PieChart, number: '06' },
]

const explorerBySlug = new Map(moduleExplorerCards.map((card) => [card.slug, card]))

export function resolvePowerfulModuleHref(
  slug: string,
  cmsHrefBySlug: Map<string, string>,
): string {
  return cmsHrefBySlug.get(slug) ?? explorerBySlug.get(slug)?.to ?? '/'
}

export function slugFromModuleHref(href: string): string {
  const path = href.split('?')[0]?.split('#')[0] ?? ''
  const segment = path.replace(/^\/software\//, '').replace(/\/$/, '')
  if (!segment) return ''

  const direct = explorerBySlug.get(segment)
  if (direct) return direct.slug

  for (const card of moduleExplorerCards) {
    if (card.to === path || card.to.endsWith(`/${segment}`)) return card.slug
  }

  return segment
}
