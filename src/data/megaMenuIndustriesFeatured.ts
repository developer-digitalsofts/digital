import { softwarePath } from '../utils/slug'
import { getIndustryHeroImageConfig } from './softwareDetail/industryHeroImages'
import type { MegaMenuFeaturedColumn, MegaMenuFeaturedItem } from './megaMenuFeaturedTypes'

const IMAGE_OVERRIDES: Record<string, string> = {
  'cloud-erp-software-for-textile-industries':
    '/software-images/cloud-erp-software-for-textile-industries/hero.jpg',
}

function featuredItem(
  id: string,
  slug: string,
  labelEn: string,
): MegaMenuFeaturedItem {
  const mapped = getIndustryHeroImageConfig(slug, labelEn)
  return {
    id,
    slug,
    to: softwarePath('industry', slug),
    image: IMAGE_OVERRIDES[slug] ?? mapped.src,
    imageAlt: mapped.alt,
  }
}

/** Curated industry links for the desktop mega menu — 3 columns × 3 items. */
export const megaMenuIndustryColumns: MegaMenuFeaturedColumn[] = [
  {
    id: 'retailCommerce',
    items: [
      featuredItem('retailPos', 'retail-management-software', 'Retail POS'),
      featuredItem('supermarket', 'grocery-store-management-software', 'Supermarket Software'),
      featuredItem('pharmacy', 'pharmacy-business-management-software', 'Pharmacy Management'),
    ],
  },
  {
    id: 'manufacturing',
    items: [
      featuredItem('manufacturingErp', 'garments-manufacturing-software', 'Manufacturing ERP'),
      featuredItem('textileGarments', 'cloud-erp-software-for-textile-industries', 'Textile & Garments'),
      featuredItem('warehouse', 'hardware-sanitary-store-software', 'Warehouse Management'),
    ],
  },
  {
    id: 'specialized',
    items: [
      featuredItem('petrolStation', 'petrol-pump-software', 'Petrol Station Software'),
      featuredItem('lpg', 'lpg-business-software', 'LPG Business Software'),
      featuredItem('poultryAgri', 'poultry-control-shed-management-software', 'Poultry & Agriculture'),
    ],
  },
]
