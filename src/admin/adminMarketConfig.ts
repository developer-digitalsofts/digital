import { MARKET_SLUG } from '../market/pakistanConfig'
import type { AdminNavItem } from './adminNavConfig'

/** Pakistan-only CMS: hide multi-country UI while keeping locale architecture intact. */
export const ADMIN_PK_ONLY = true

export const ADMIN_FIXED_COUNTRY = MARKET_SLUG
export const ADMIN_FIXED_LANG = 'en' as const
export const ADMIN_WEBSITE_CONTENT_LABEL = 'Pakistan Website Content'

const HIDDEN_NAV_IDS = new Set(['countries', 'country-setup'])

export function isAdminPkOnlyMode(): boolean {
  return ADMIN_PK_ONLY
}

export function filterAdminNavItems(items: AdminNavItem[]): AdminNavItem[] {
  if (!ADMIN_PK_ONLY) return items
  return items.filter((item) => !HIDDEN_NAV_IDS.has(item.id))
}

export function isAdminCityCmsPath(pathname: string): boolean {
  return pathname.startsWith('/admin/content/cities')
}
