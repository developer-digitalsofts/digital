import type { HeroModuleType } from '../../../types/heroCarousel'
import type { ModuleMockupSize } from '../../../types/moduleDetailPage'
import { HeroModuleDashboard } from '../../hero/dashboards/HeroModuleDashboard'
import { DetailSoftwareMockup } from '../detail/DetailSoftwareMockup'
import { heroModuleTypeForSlug } from '../../../data/softwareDetail/moduleDetailConfig'
import type { DetailMockupVariant } from '../../../types/detailPageSections'
import '../../hero/dm-hero.css'
import '../accounts/accounts-prototype.css'

type Props = {
  slug: string
  variant: DetailMockupVariant
  className?: string
  size?: ModuleMockupSize
}

function heroTypeFromVariant(variant: DetailMockupVariant): HeroModuleType {
  const map: Partial<Record<DetailMockupVariant, HeroModuleType>> = {
    accounts: 'finance',
    inventory: 'inventory',
    pos: 'pos',
    payroll: 'hr',
  }
  return map[variant] ?? 'erp'
}

function sizeClass(size: ModuleMockupSize): string {
  if (size === 'hero') return 'mod-dash--hero'
  if (size === 'showcase') return 'mod-dash--showcase'
  return 'mod-dash--compact'
}

export function ModuleDashboardMockup({ slug, variant, className = '', size = 'compact' }: Props) {
  if (size === 'hero' || size === 'showcase') {
    const moduleType = heroModuleTypeForSlug(slug) ?? heroTypeFromVariant(variant)
    return (
      <div className={`mod-dash ${sizeClass(size)} ${className}`.trim()} data-mockup-size={size}>
        <div className="mod-dash__frame">
          <HeroModuleDashboard moduleType={moduleType} preview />
        </div>
      </div>
    )
  }

  return (
    <div className={`mod-dash mod-dash--compact ${className}`.trim()} data-mockup-size={size}>
      <DetailSoftwareMockup variant={variant} />
    </div>
  )
}
