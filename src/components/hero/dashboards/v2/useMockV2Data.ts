import { useMemo } from 'react'
import { pick } from '../../../../cms/pick'
import { useI18n } from '../../../../i18n/I18nProvider'
import type { HeroModuleType } from '../../../../types/heroCarousel'
import type { Bilingual } from '../../../../cms/types'
import type { HeroMockupSlideOverrides } from '../../../../types/heroMockup'
import { useDashboardRegionalData } from '../useDashboardRegionalData'
import { getMockV2Defaults, type MockV2Kpi, type MockV2ModuleData } from './data/moduleDefaults'

function mapTone(tone?: string): MockV2Kpi['tone'] {
  if (!tone) return 'neutral'
  if (tone === 'positive' || tone === 'up') return 'positive'
  if (tone === 'critical' || tone === 'down' || tone === 'negative') return 'negative'
  if (tone === 'warning' || tone === 'warn') return 'warning'
  return 'neutral'
}

export function mergeMockV2Overrides(
  base: MockV2ModuleData,
  overrides?: HeroMockupSlideOverrides | null,
  lang: 'en' | 'ar' = 'en',
): MockV2ModuleData {
  if (!overrides) return base

  const pickB = (b?: Bilingual) => (b ? pick(b, lang) || b.en || '' : undefined)

  return {
    ...base,
    title: pickB(overrides.title) || base.title,
    subtitle: pickB(overrides.subtitle) || base.subtitle,
    kpis: overrides.kpis?.length
      ? overrides.kpis.map((k, i) => ({
          label: pickB(k.label) || base.kpis[i]?.label || '',
          value: k.value || base.kpis[i]?.value || '',
          trend: k.comparison || pickB(k.hint) || base.kpis[i]?.trend || '',
          tone: mapTone(k.tone ?? base.kpis[i]?.tone),
          sparkline: base.kpis[i]?.sparkline,
        }))
      : base.kpis,
  }
}

export function useMockV2Data(moduleType: HeroModuleType, overrides?: HeroMockupSlideOverrides | null) {
  const regional = useDashboardRegionalData()
  const { lang } = useI18n()

  return useMemo(() => {
    const base = getMockV2Defaults(moduleType, regional)
    return mergeMockV2Overrides(base, overrides, lang)
  }, [moduleType, regional, overrides, lang])
}
