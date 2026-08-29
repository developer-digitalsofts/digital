import { useMemo } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { useLocale } from '../locale/LocaleContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { LucideByName } from '../utils/lucideFromName'
import { TrustStatValue } from './TrustStatValue'
import './trust-stats.css'

const fallbackKeys = ['experience', 'softwares', 'clients', 'satisfaction', 'branches'] as const

const fallbackIcons: Record<(typeof fallbackKeys)[number], string> = {
  experience: 'Award',
  softwares: 'Layers',
  clients: 'Users',
  satisfaction: 'HeartHandshake',
  branches: 'GitBranch',
}

type StatItem = {
  id: string
  value: string
  label?: Bilingual
  icon?: string
  sortOrder?: number
  active?: boolean
}

type StatsCms = {
  eyebrow?: Bilingual
  title?: Bilingual
  subheading?: Bilingual
  items?: StatItem[]
}

/** Premium trust statistics bar below hero. */
export function TrustStatsSection() {
  const { t, lang } = useI18n()
  const { data, loading } = useCms()
  const { activeCountry } = useLocale()
  const stats = data?.stats as StatsCms | undefined
  const { ref, visible } = useInViewOnce<HTMLDivElement>()

  const countryName = activeCountry?.name || 'Pakistan'
  const defaultHeadingTemplate = t('trustStats.defaultHeading')
  const eyebrow = stats?.eyebrow?.en || stats?.eyebrow?.ar ? pick(stats.eyebrow, lang) : t('trustStats.eyebrow')
  const heading =
    stats?.title?.en || stats?.title?.ar
      ? pick(stats.title, lang)
      : defaultHeadingTemplate.replace('{{country}}', countryName)
  const items = useMemo(() => {
    if (!stats?.items?.length) return null
    return [...stats.items]
      .filter((s) => s.active !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }, [stats?.items])

  const statCells =
    items && items.length > 0
      ? items.map((s, index) => ({
          key: s.id,
          value: s.value,
          label: s.label ? pick(s.label, lang) : '',
          icon: s.icon || fallbackIcons[fallbackKeys[index] ?? 'experience'] || 'Award',
        }))
      : fallbackKeys.map((key) => ({
          key,
          value: t(`trustStats.items.${key}.value`),
          label: t(`trustStats.items.${key}.label`),
          icon: fallbackIcons[key],
        }))

  const animate = visible && !loading

  return (
    <section
      id="trust-stats"
      className={`dm-trust-stats scroll-mt-28 bg-white home-section home-section--trust-stats`}
      aria-busy={loading && !data}
    >
      <div className="industries-section__container">
        <div
          ref={ref}
          className={`dm-trust-stats__bar ${loading && !data ? 'dm-trust-stats__bar--loading' : ''}`}
          aria-label={`${eyebrow}. ${heading}`}
        >
          <div className="dm-trust-stats__bar-inner">
            <div className="dm-trust-stats__intro">
              <p className="dm-trust-stats__eyebrow">{eyebrow}</p>
              <h2 className="dm-trust-stats__heading">{heading}</h2>
            </div>

            <div className="dm-trust-stats__grid" role="list">
              {statCells.map((cell) => (
                <div key={cell.key} className="dm-trust-stats__stat" role="listitem">
                  <div className="dm-trust-stats__icon">
                    <LucideByName name={cell.icon} className="dm-trust-stats__icon-svg" strokeWidth={2} />
                  </div>
                  <TrustStatValue
                    value={cell.value}
                    animate={animate}
                    durationMs={1200}
                    className="dm-trust-stats__value"
                  />
                  <span className="dm-trust-stats__accent" aria-hidden />
                  <p className="dm-trust-stats__label">{cell.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
