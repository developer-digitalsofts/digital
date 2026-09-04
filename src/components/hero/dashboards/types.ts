import type { HeroModuleType } from '../../../types/heroCarousel'

export type BadgeTone = 'positive' | 'info' | 'warning' | 'critical' | 'neutral' | 'purple'

export type KpiItem = {
  label: string
  value: string
  hint?: string
  tone?: BadgeTone
  sparkline?: number[]
}

export type TableColumn = { key: string; label: string; align?: 'left' | 'right' }

export type TableRow = Record<string, string | { text: string; tone?: BadgeTone }>

export type DonutSegment = { label: string; value: number; color: string }

export type DashboardFrameProps = {
  title: string
  subtitle?: string
  moduleType?: HeroModuleType
  children: React.ReactNode
}

export type ProductRow = { name: string; qty: string; icon?: string }

export type BranchRow = { branch: string; inStock: string; low: string; out: string }

import type { HeroMockupSlideOverrides } from '../../../types/heroMockup'

export type DashboardMockupProps = {
  animate?: boolean
  /** Side carousel card — simplified readable layout */
  preview?: boolean
  mockupData?: HeroMockupSlideOverrides | null
}
