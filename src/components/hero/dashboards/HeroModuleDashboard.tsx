import { memo } from 'react'

import { pick } from '../../../cms/pick'

import { useI18n } from '../../../i18n/I18nProvider'

import type { HeroModuleType } from '../../../types/heroCarousel'

import type { HeroMockupCmsFields } from '../../../types/heroMockup'

import {
  ErpMockupV2,
  FinanceMockupV2,
  HrMockupV2,
  InventoryMockupV2,
  PosMockupV2,
} from './v2'

type Props = HeroMockupCmsFields & {
  moduleType: HeroModuleType
  animate?: boolean
  preview?: boolean
}

function HeroMockupImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="dm-hero__mockup-wrap">
      <div className="dm-hero__mockup-glow" aria-hidden />
      <div className="dm-hero__dashboard-frame dm-hero__dashboard-frame--v2">
        <img src={src} alt={alt} className="dm-hero__mockup-image" />
      </div>
    </div>
  )
}

export const HeroModuleDashboard = memo(function HeroModuleDashboard({
  moduleType,
  animate = false,
  mockupMode = 'component',
  mockupModule,
  mockupData,
  mockupImage,
  mockupAltText,
  mockupVisible = true,
}: Props) {
  const { lang } = useI18n()

  if (mockupVisible === false) return null

  const imageSrc = mockupImage?.trim() || ''
  if (mockupMode === 'image' && imageSrc) {
    const alt = mockupAltText ? pick(mockupAltText, lang) : `${moduleType} dashboard preview`
    return <HeroMockupImage src={imageSrc} alt={alt} />
  }

  const resolvedModule = mockupModule ?? moduleType
  const shared = { animate, mockupData }

  const mockup = (() => {
    switch (resolvedModule) {
      case 'finance':
        return <FinanceMockupV2 {...shared} />
      case 'inventory':
        return <InventoryMockupV2 {...shared} />
      case 'pos':
        return <PosMockupV2 {...shared} />
      case 'hr':
        return <HrMockupV2 {...shared} />
      default:
        return <ErpMockupV2 {...shared} />
    }
  })()

  return <div className={`dm-hero__mockup-wrap ${animate ? 'dm-hero__mockup-wrap--animate' : ''}`}>{mockup}</div>
})

export function HeroDashboardCardLabel(moduleType: HeroModuleType): string {
  switch (moduleType) {
    case 'finance':
      return 'Finance Overview'
    case 'inventory':
      return 'Inventory Overview'
    case 'pos':
      return 'POS Overview'
    case 'hr':
      return 'HR & Payroll Overview'
    default:
      return 'ERP Overview'
  }
}
