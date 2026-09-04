import type { Bilingual } from '../cms/types'
import type { BadgeTone } from '../components/hero/dashboards/types'
import type { HeroModuleType } from './heroCarousel'

export type HeroMockupKpiOverride = {
  label?: Bilingual
  value?: string
  comparison?: string
  hint?: Bilingual
  tone?: BadgeTone | 'up' | 'down' | 'muted' | 'warn'
}

export type HeroMockupSlideOverrides = {
  title?: Bilingual
  subtitle?: Bilingual
  kpis?: HeroMockupKpiOverride[]
  visible?: boolean
  chartLabels?: Bilingual[]
  tableRows?: Record<string, string>[]
}

export type HeroMockupModuleData = {
  title: string
  subtitle: string
  kpis?: {
    label: string
    value: string
    hint?: string
    tone?: BadgeTone | 'up' | 'down' | 'muted' | 'warn'
  }[]
  visible?: boolean
}

export type HeroMockupMode = 'component' | 'image'

export type HeroMockupCmsFields = {
  mockupMode?: HeroMockupMode
  mockupModule?: HeroModuleType
  mockupData?: HeroMockupSlideOverrides
  mockupImage?: string
  mockupAltText?: Bilingual
  mockupVisible?: boolean
}
