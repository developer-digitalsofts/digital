import type { DetailMockupVariant } from '../../../types/detailPageSections'
import { HeroModuleDashboard } from '../../hero/dashboards/HeroModuleDashboard'
import { DetailSoftwareMockup } from '../detail/DetailSoftwareMockup'
import { mockupVariantForIndustrySlug } from '../../../data/softwareDetail/industryDetailConfig'
import '../../hero/dm-hero.css'
import '../accounts/accounts-prototype.css'

type Props = {
  slug: string
  variant: DetailMockupVariant
  size?: 'showcase' | 'analytics'
}

const INDUSTRY_DETAIL_MOCKUPS: DetailMockupVariant[] = [
  'petrol',
  'textile',
  'poultry',
  'agriculture',
  'inventory',
  'production',
  'pos',
]

function heroTypeForVariant(variant: DetailMockupVariant): 'finance' | 'inventory' | 'pos' | 'hr' | 'erp' {
  if (variant === 'pos') return 'pos'
  if (variant === 'inventory') return 'inventory'
  return 'erp'
}

export function IndustryDashboardMockup({ slug, variant, size = 'showcase' }: Props) {
  const resolved = variant || mockupVariantForIndustrySlug(slug)
  const useHeroFrame = size === 'showcase' || size === 'analytics'

  if (useHeroFrame && INDUSTRY_DETAIL_MOCKUPS.includes(resolved)) {
    return (
      <div className={`ind-dash ind-dash--${size}`}>
        <div className="ind-dash__frame">
          <DetailSoftwareMockup variant={resolved} />
        </div>
      </div>
    )
  }

  if (useHeroFrame) {
    return (
      <div className={`ind-dash ind-dash--${size}`}>
        <div className="ind-dash__frame">
          <HeroModuleDashboard moduleType={heroTypeForVariant(resolved)} preview />
        </div>
      </div>
    )
  }

  return (
    <div className="ind-dash ind-dash--compact">
      <DetailSoftwareMockup variant={resolved} />
    </div>
  )
}
