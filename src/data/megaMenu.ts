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

/** Mega + mobile nav — soft tile, strong orange glyph */
export const megaMenuBrandIcon =
  'border border-[#ffd8cc] bg-[#fff3ed] text-[#ea6a45] [&_svg]:text-[#ea6a45]'

/** Software by module — exactly 8 links (flat `/software/...` routes). */
export const moduleMegaItems: ModuleMegaItem[] = [
  {
    ...mod('Accounts Management Software', 'accounts-management-software', '/software/accounts-management-software'),
    icon: Landmark,
    iconWrap: megaMenuBrandIcon,
  },
  {
    ...mod('Production Management Software', 'production-management-software', '/software/production-management-software'),
    icon: Factory,
    iconWrap: megaMenuBrandIcon,
  },
  {
    ...mod('Point of Sale Management Software', 'point-of-sale-management-software', '/software/point-of-sale-software'),
    icon: TabletSmartphone,
    iconWrap: megaMenuBrandIcon,
  },
  {
    ...mod('FBR (POS) Integration Software', 'fbr-pos-integration-software', '/software/fbr-pos-integration-software'),
    icon: FileText,
    iconWrap: megaMenuBrandIcon,
  },
  {
    ...mod('Inventory Management Software', 'inventory-management-software', '/software/inventory-management-software'),
    icon: Package,
    iconWrap: megaMenuBrandIcon,
  },
  {
    ...mod('Payroll Management Software', 'payroll-management-software', '/software/payroll-management-software'),
    icon: Banknote,
    iconWrap: megaMenuBrandIcon,
  },
  {
    ...mod('Integration System', 'integration-system', '/software/sms-integration-system'),
    icon: Cpu,
    iconWrap: megaMenuBrandIcon,
  },
  {
    ...mod('CRM Software', 'crm-software', '/software/crm-software'),
    icon: Users,
    iconWrap: megaMenuBrandIcon,
  },
]

/** “Software by industries” — approved categories only (accordion), Oil & Gas default open. */
export const industryCategories: IndustryCategory[] = [
  {
    id: 'oil-gas',
    titleEn: 'Oil & Gas',
    icon: Fuel,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Petrol Pump Software'),
      ind('Petrol & Gas Filling Station Software'),
      ind('LPG Business Software'),
      ind('LPG Transport Management Software'),
      ind('LPG Bowser Supply Chain Software'),
      ind('Fleet Fuel Management Software'),
      ind('Petrol Depot Management Software', 'petrol-depot-management-software'),
      ind('Fuel Tank Lorry Management Software', 'fuel-tank-lorry-management-software'),
    ],
  },
  {
    id: 'textile',
    titleEn: 'Textile',
    icon: Store,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Cloud ERP Software for Textile Industries'),
      ind('Knitting & Dyeing Industry Software'),
      ind('Fabric Store Management Software'),
    ],
  },
  {
    id: 'manufacturing',
    titleEn: 'Manufacturing',
    icon: Factory,
    iconWrap: megaMenuBrandIcon,
    links: [ind('Garments Manufacturing Software'), ind('Candy and Confectionery Manufacturing Software')],
  },
  {
    id: 'retail',
    titleEn: 'Retail Industry',
    icon: ShoppingBag,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Retail Management Software'),
      ind('Luggage & Bags Store Software'),
      ind('Toy Shop Management Software'),
      ind('Crockery Store Management Software'),
      ind('Grocery Store Management Software'),
    ],
  },
  {
    id: 'smb',
    titleEn: 'Small & Medium Businesses',
    icon: Briefcase,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Cloud ERP Software For Services Business'),
      ind('Small & Medium Businesses Software', 'small-and-medium-business-erp-software'),
      ind('Installment Management Software'),
    ],
  },
  {
    id: 'medical',
    titleEn: 'Medical',
    icon: HeartPulse,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Pharmacy Business Management Software'),
      ind('Homeopathic Business Management Software'),
    ],
  },
  {
    id: 'hospitality',
    titleEn: 'Hospitality',
    icon: Hotel,
    iconWrap: megaMenuBrandIcon,
    links: [ind('Hotel Management Software'), ind('Tuc Shop Management Software')],
  },
  {
    id: 'logistics',
    titleEn: 'Logistics & Transportation',
    icon: Truck,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Logistics & Transportation Software'),
      ind('Motor Market Management Software'),
      ind('Auto Parts Business Software'),
    ],
  },
  {
    id: 'poultry',
    titleEn: 'Poultry Business',
    icon: Bird,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Poultry Control Shed Management Software'),
      ind('Poultry Chicken Supply Management Software'),
      ind('Poultry Waste Management Software'),
      ind('Poultry Arhat Software'),
    ],
  },
  {
    id: 'agriculture',
    titleEn: 'Agriculture Business',
    icon: Wheat,
    iconWrap: megaMenuBrandIcon,
    links: [ind('Cloud ERP Software for Agriculture Business'), ind('Dairy Farm Management Software')],
  },
  {
    id: 'construction',
    titleEn: 'Construction',
    icon: HardHat,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Marble and Granite Factory Software'),
      ind('Plastic Pipes & Fitting Industry Software'),
      ind('Ceiling and Wall Paneling Software', 'ceiling-and-wall-paneling-store-software'),
      ind('Tiles and Ceramics Store Software'),
      ind('Hardware & Sanitary Store Software'),
    ],
  },
  {
    id: 'real-estate',
    titleEn: 'Real Estate',
    icon: Building2,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('ERP Software for Real Estate Business'),
      ind('ERP Software for Construction Business'),
    ],
  },
  {
    id: 'visa',
    titleEn: 'Visa Consultancy',
    icon: Plane,
    iconWrap: megaMenuBrandIcon,
    links: [ind('Software for Visa & Immigration Consultants')],
  },
  {
    id: 'electronics',
    titleEn: 'Electronics',
    icon: Laptop,
    iconWrap: megaMenuBrandIcon,
    links: [
      ind('Computers & Laptop Business Software'),
      ind('Electronics Management Software'),
      ind('Electric Store Business Software', 'electric-store-management-software'),
      ind('Mobile Accessories Business Software'),
      ind('Vehicle Charging Station Software', 'ev-charging-station-management-software'),
    ],
  },
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

