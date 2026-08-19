import { memo } from 'react'
import type { HeroModuleType } from '../../../types/heroCarousel'
import { ErpDashboardMockup } from './mockups/ErpDashboardMockup'
import { FinanceDashboardMockup } from './mockups/FinanceDashboardMockup'
import { HrDashboardMockup } from './mockups/HrDashboardMockup'
import { InventoryDashboardMockup } from './mockups/InventoryDashboardMockup'
import { PosDashboardMockup } from './mockups/PosDashboardMockup'

type Props = {
  moduleType: HeroModuleType
  animate?: boolean
  preview?: boolean
}

export const HeroModuleDashboard = memo(function HeroModuleDashboard({ moduleType, animate = false, preview = false }: Props) {
  switch (moduleType) {
    case 'finance':
      return <FinanceDashboardMockup animate={animate} preview={preview} />
    case 'inventory':
      return <InventoryDashboardMockup animate={animate} preview={preview} />
    case 'pos':
      return <PosDashboardMockup animate={animate} preview={preview} />
    case 'hr':
      return <HrDashboardMockup animate={animate} preview={preview} />
    default:
      return <ErpDashboardMockup animate={animate} preview={preview} />
  }
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
      return 'HR Overview'
    default:
      return 'ERP Overview'
  }
}
