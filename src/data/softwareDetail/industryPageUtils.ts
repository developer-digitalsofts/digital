import { industryCategories } from '../megaMenu'

/** Returns mega-menu category id (e.g. `textile`, `oil-gas`) or null for module pages. */
export function getIndustryCategoryId(slug: string): string | null {
  for (const cat of industryCategories) {
    if (cat.links.some((l) => l.slug === slug)) return cat.id
  }
  return null
}

export function isIndustrySoftwareSlug(slug: string): boolean {
  return getIndustryCategoryId(slug) !== null
}
