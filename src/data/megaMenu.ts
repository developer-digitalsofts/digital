import type { LucideIcon } from 'lucide-react'
import {
  Bird,
  Briefcase,
  Building2,
  Cpu,
  Factory,
  FileText,
  Fuel,
  HardHat,
  HeartPulse,
  Hotel,
  Landmark,
  Laptop,
  Package,
  Banknote,
  Plane,
  ShoppingBag,
  Store,
  TabletSmartphone,
  Truck,
  Users,
  Wheat,
} from 'lucide-react'
import { slugify, softwarePath } from '../utils/slug'
import { industryIconBgClass, moduleIconBgClass } from '../ui/megaMenuColors'

/** `labelEn` is the canonical English name (used for EN UI + search); Arabic uses i18n by slug. */
export type MegaLink = { labelEn: string; slug: string; to: string }

export type ModuleMegaItem = MegaLink & {
  icon: LucideIcon
  /** Tailwind classes for circular icon wrapper */
  iconWrap: string
}

export type IndustryCategory = {
  id: string
  titleEn: string
  icon: LucideIcon
  iconWrap: string
  links: MegaLink[]
}

/** Module mega menu uses flat `/software/:segment` URLs; `slug` stays the canonical key for data + i18n. */
const mod = (labelEn: string, slug: string, to: string): MegaLink => ({ labelEn, slug, to })

/** Industry link; optional `slug` when canonical route differs from slugify(label). */
const ind = (labelEn: string, slug?: string): MegaLink => {
  const resolved = slug ?? slugify(labelEn)
  return { labelEn, slug: resolved, to: softwarePath('industry', resolved) }
}

const industryCat = (
  id: string,
  titleEn: string,
  icon: LucideIcon,
  links: MegaLink[],
): IndustryCategory => ({
  id,
  titleEn,
  icon,
  iconWrap: industryIconBgClass(id),
  links,
})

/** Software by module — exactly 8 links (flat `/software/...` routes). */
export const moduleMegaItems: ModuleMegaItem[] = [
  {
    ...mod('Accounts Management Software', 'accounts-management-software', '/software/accounts-management-software'),
    icon: Landmark,
    iconWrap: moduleIconBgClass('accounts-management-software'),
  },
  {
    ...mod('Production Management Software', 'production-management-software', '/software/production-management-software'),
    icon: Factory,
    iconWrap: moduleIconBgClass('production-management-software'),
  },
  {
    ...mod('Point of Sale Management Software', 'point-of-sale-management-software', '/software/point-of-sale-software'),
    icon: TabletSmartphone,
    iconWrap: moduleIconBgClass('point-of-sale-management-software'),
  },
  {
    ...mod('Pakistan Sales Tax & Compliance Software', 'fbr-pos-integration-software', '/software/fbr-pos-integration-software'),
    icon: FileText,
    iconWrap: moduleIconBgClass('fbr-pos-integration-software'),
  },
  {
    ...mod('Inventory Management Software', 'inventory-management-software', '/software/inventory-management-software'),
    icon: Package,
    iconWrap: moduleIconBgClass('inventory-management-software'),
  },
  {
    ...mod('Payroll Management Software', 'payroll-management-software', '/software/payroll-management-software'),
    icon: Banknote,
    iconWrap: moduleIconBgClass('payroll-management-software'),
  },
  {
    ...mod('Integration System', 'integration-system', '/software/sms-integration-system'),
    icon: Cpu,
    iconWrap: moduleIconBgClass('integration-system'),
  },
  {
    ...mod('CRM Software', 'crm-software', '/software/crm-software'),
    icon: Users,
    iconWrap: moduleIconBgClass('crm-software'),
  },
]

/** “Software by industries” — approved categories only (accordion), Oil & Gas default open. */
export const industryCategories: IndustryCategory[] = [
  industryCat('oil-gas', 'Oil & Gas', Fuel, [
      ind('Petrol Pump Software'),
      ind('Petrol & Gas Filling Station Software'),
      ind('LPG Business Software'),
      ind('LPG Transport Management Software'),
      ind('LPG Bowser Supply Chain Software'),
      ind('Fleet Fuel Management Software'),
      ind('Petrol Depot Management Software', 'petrol-depot-management-software'),
      ind('Fuel Tank Lorry Management Software', 'fuel-tank-lorry-management-software'),
  ]),
  industryCat('textile', 'Textile', Store, [
      ind('Cloud ERP Software for Textile Industries'),
      ind('Knitting & Dyeing Industry Software'),
      ind('Fabric Store Management Software'),
  ]),
  industryCat('manufacturing', 'Manufacturing', Factory, [
    ind('Garments Manufacturing Software'),
    ind('Candy and Confectionery Manufacturing Software'),
  ]),
  industryCat('retail', 'Retail Industry', ShoppingBag, [
      ind('Retail Management Software'),
      ind('Luggage & Bags Store Software'),
      ind('Toy Shop Management Software'),
      ind('Crockery Store Management Software'),
      ind('Grocery Store Management Software'),
  ]),
  industryCat('smb', 'Small & Medium Businesses', Briefcase, [
      ind('Cloud ERP Software For Services Business'),
      ind('Small & Medium Businesses Software', 'small-and-medium-business-erp-software'),
      ind('Installment Management Software'),
  ]),
  industryCat('medical', 'Medical', HeartPulse, [
      ind('Pharmacy Business Management Software'),
      ind('Homeopathic Business Management Software'),
  ]),
  industryCat('hospitality', 'Hospitality', Hotel, [
    ind('Hotel Management Software'),
    ind('Tuc Shop Management Software'),
  ]),
  industryCat('logistics', 'Logistics & Transportation', Truck, [
      ind('Logistics & Transportation Software'),
      ind('Motor Market Management Software'),
      ind('Auto Parts Business Software'),
  ]),
  industryCat('poultry', 'Poultry Business', Bird, [
      ind('Poultry Control Shed Management Software'),
      ind('Poultry Chicken Supply Management Software'),
      ind('Poultry Waste Management Software'),
      ind('Poultry Arhat Software'),
  ]),
  industryCat('agriculture', 'Agriculture Business', Wheat, [
    ind('Cloud ERP Software for Agriculture Business'),
    ind('Dairy Farm Management Software'),
  ]),
  industryCat('construction', 'Construction', HardHat, [
      ind('Marble and Granite Factory Software'),
      ind('Plastic Pipes & Fitting Industry Software'),
      ind('Ceiling and Wall Paneling Software', 'ceiling-and-wall-paneling-store-software'),
      ind('Tiles and Ceramics Store Software'),
      ind('Hardware & Sanitary Store Software'),
  ]),
  industryCat('real-estate', 'Real Estate', Building2, [
      ind('ERP Software for Real Estate Business'),
      ind('ERP Software for Construction Business'),
  ]),
  industryCat('visa', 'Visa Consultancy', Plane, [
    ind('Software for Visa & Immigration Consultants'),
  ]),
  industryCat('electronics', 'Electronics', Laptop, [
      ind('Computers & Laptop Business Software'),
      ind('Electronics Management Software'),
      ind('Electric Store Business Software', 'electric-store-management-software'),
      ind('Mobile Accessories Business Software'),
      ind('Vehicle Charging Station Software', 'ev-charging-station-management-software'),
  ]),
]

/** Legacy export shape for any old imports — flattened module links. */
export const moduleMegaColumns = [
  {
    title: 'All modules',
    icon: Package,
    links: moduleMegaItems.map(({ icon: _i, iconWrap: _w, ...rest }) => rest),
  },
]

export const industryMegaColumns = industryCategories.map((c) => ({
  title: c.titleEn,
  icon: c.icon,
  links: c.links,
}))

export type MegaSearchRowMeta =
  | { kind: 'module'; slug: string; to: string; labelEn: string }
  | { kind: 'industry'; slug: string; to: string; labelEn: string; catId: string }

export function flattenMegaSearchMeta(): MegaSearchRowMeta[] {
  const out: MegaSearchRowMeta[] = []
  for (const item of moduleMegaItems) {
    out.push({ kind: 'module', slug: item.slug, to: item.to, labelEn: item.labelEn })
  }
  for (const cat of industryCategories) {
    for (const link of cat.links) {
      out.push({
        kind: 'industry',
        slug: link.slug,
        to: link.to,
        labelEn: link.labelEn,
        catId: cat.id,
      })
    }
  }
  return out
}

export function industryCategoryTitleEn(catId: string): string {
  return industryCategories.find((c) => c.id === catId)?.titleEn ?? catId
}

export function findSoftwareBySlug(
  slug: string | undefined,
  kind?: 'module' | 'industry',
): MegaLink | undefined {
  if (!slug) return undefined
  const searchModule = !kind || kind === 'module'
  const searchIndustry = !kind || kind === 'industry'
  if (searchModule) {
    const hit = moduleMegaItems.find((l) => l.slug === slug || l.to === `/software/${slug}`)
    if (hit) return hit
  }
  if (searchIndustry) {
    for (const cat of industryCategories) {
      const hit = cat.links.find((l) => l.slug === slug)
      if (hit) return hit
    }
  }
  return undefined
}

/** Detail-page “related” pill target — flat module URLs where applicable. */
export function linkForSoftwareRelated(r: { kind: 'module' | 'industry'; slug: string }): string {
  if (r.kind === 'module') {
    const mod = moduleMegaItems.find((m) => m.slug === r.slug)
    if (mod) return mod.to
  }
  return softwarePath(r.kind, r.slug)
}

