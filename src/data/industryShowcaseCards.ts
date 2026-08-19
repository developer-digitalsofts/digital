import { softwarePath } from '../utils/slug'

export type IndustryShowcaseCard = {
  id: string
  titleKey: string
  descKey: string
  href: string
  image: string
}

const img = (slug: string) => `/software-images/${slug}/hero.jpg`

/** Fallback homepage industry grid — matches reference layout (12 cards). */
export const industryShowcaseCards: IndustryShowcaseCard[] = [
  {
    id: 'retail',
    titleKey: 'retail',
    descKey: 'retail',
    href: softwarePath('industry', 'retail-management-software'),
    image: img('retail-management-software'),
  },
  {
    id: 'petrol',
    titleKey: 'petrol',
    descKey: 'petrol',
    href: softwarePath('industry', 'petrol-pump-software'),
    image: img('petrol-pump-software'),
  },
  {
    id: 'knitting',
    titleKey: 'knitting',
    descKey: 'knitting',
    href: softwarePath('industry', 'knitting-dyeing-industry-software'),
    image: img('knitting-dyeing-industry-software'),
  },
  {
    id: 'supply',
    titleKey: 'supply',
    descKey: 'supply',
    href: softwarePath('industry', 'supply-chain-management-software'),
    image: img('inventory-management-software'),
  },
  {
    id: 'textile',
    titleKey: 'textile',
    descKey: 'textile',
    href: softwarePath('industry', 'cloud-erp-software-for-textile-industries'),
    image: '/software-images/cloud-erp-software-for-textile-industries/hero.jpg',
  },
  {
    id: 'education',
    titleKey: 'education',
    descKey: 'education',
    href: softwarePath('industry', 'education-institute-management-software'),
    image: img('education-institute-management-software'),
  },
  {
    id: 'agriculture',
    titleKey: 'agriculture',
    descKey: 'agriculture',
    href: softwarePath('industry', 'cloud-erp-software-for-agriculture-business'),
    image: img('cloud-erp-software-for-agriculture-business'),
  },
  {
    id: 'services',
    titleKey: 'services',
    descKey: 'services',
    href: softwarePath('industry', 'cloud-erp-software-for-services-business'),
    image: '/software-images/cloud-erp-software-for-services-business/dashboard.jpg',
  },
  {
    id: 'hospitality',
    titleKey: 'hospitality',
    descKey: 'hospitality',
    href: softwarePath('industry', 'hotel-management-software'),
    image: img('hotel-management-software'),
  },
  {
    id: 'poultry',
    titleKey: 'poultry',
    descKey: 'poultry',
    href: softwarePath('industry', 'poultry-control-shed-management-software'),
    image: img('poultry-control-shed-management-software'),
  },
  {
    id: 'manufacturing',
    titleKey: 'manufacturing',
    descKey: 'manufacturing',
    href: softwarePath('industry', 'production-management-software'),
    image: img('production-management-software'),
  },
  {
    id: 'transportation',
    titleKey: 'transportation',
    descKey: 'transportation',
    href: softwarePath('industry', 'logistics-transportation-software'),
    image: img('logistics-transportation-software'),
  },
]

/** Six priority industries for the homepage grid. */
export const HOME_PRIORITY_INDUSTRY_IDS = [
  'retail',
  'petrol',
  'textile',
  'manufacturing',
  'supply',
  'services',
] as const

export function homeIndustryShowcaseCards(): IndustryShowcaseCard[] {
  const byId = new Map(industryShowcaseCards.map((card) => [card.id, card]))
  return HOME_PRIORITY_INDUSTRY_IDS.map((id) => byId.get(id)).filter(
    (card): card is IndustryShowcaseCard => Boolean(card),
  )
}

export function industryImageFromHref(href: string): string {
  const slug = href.match(/\/software\/(?:industry|module)\/([^/?#]+)/)?.[1]
  if (!slug) return img('retail-management-software')
  if (slug === 'education-institute-management-software') return img('education-institute-management-software')
  if (slug === 'supply-chain-management-software') return img('inventory-management-software')
  return img(slug)
}
