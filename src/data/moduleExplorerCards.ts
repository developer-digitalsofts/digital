import type { LucideIcon } from 'lucide-react'
import { moduleMegaItems } from './megaMenu'

export type ModuleExplorerCard = {
  slug: string
  labelEn: string
  /** Same `to` as navbar “Software by module” links */
  to: string
  icon: LucideIcon
  badge: 'core' | 'popular'
}

const badgeBySlug: Record<string, 'core' | 'popular'> = {
  'accounts-management-software': 'core',
  'production-management-software': 'core',
  'point-of-sale-management-software': 'popular',
  'fbr-pos-integration-software': 'popular',
  'inventory-management-software': 'core',
  'payroll-management-software': 'core',
  'integration-system': 'core',
  'crm-software': 'popular',
}

/** Home “ERP Module Ecosystem” grid — mirrors `moduleMegaItems` (navbar) exactly. */
export const moduleExplorerCards: ModuleExplorerCard[] = moduleMegaItems.map((item) => ({
  slug: item.slug,
  labelEn: item.labelEn,
  to: item.to,
  icon: item.icon,
  badge: badgeBySlug[item.slug] ?? 'core',
}))
