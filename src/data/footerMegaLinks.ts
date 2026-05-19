import { findSoftwareBySlug, moduleMegaItems } from './megaMenu'
import { softwarePath } from '../utils/slug'

/** Footer product column — same modules & flat URLs as navbar mega menu. */
export const footerProductModules = [
  'accounts-management-software',
  'inventory-management-software',
  'point-of-sale-management-software',
  'payroll-management-software',
  'crm-software',
] as const

export function getFooterProductModules() {
  return footerProductModules.map((slug) => {
    const item = moduleMegaItems.find((m) => m.slug === slug)
    if (!item) throw new Error(`Footer product slug missing from mega menu: ${slug}`)
    return item
  })
}

/** Footer industry column — labels/routes aligned with mega menu entries. */
export const footerIndustryLinks = [
  { slug: 'petrol-pump-software', labelEn: 'Petrol Pump Software' },
  { slug: 'garments-manufacturing-software', labelEn: 'Garments Manufacturing Software' },
  { slug: 'grocery-store-management-software', labelEn: 'Grocery Store Management Software' },
  { slug: 'erp-software-for-real-estate-business', labelEn: 'ERP Software for Real Estate Business' },
  { slug: 'education-institute-management-software', labelEn: 'Education Institute Management Software' },
] as const

export function resolveFooterIndustryLinks() {
  return footerIndustryLinks.map((row) => {
    const hit = findSoftwareBySlug(row.slug, 'industry')
    return {
      slug: row.slug,
      labelEn: hit?.labelEn ?? row.labelEn,
      to: hit?.to ?? softwarePath('industry', row.slug),
    }
  })
}
