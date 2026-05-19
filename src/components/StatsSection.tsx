import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { LucideByName } from '../utils/lucideFromName'
import { ScrollReveal } from './ScrollReveal'
import { StatValue } from './StatValue'
import { pageShellClass } from '../ui/pageShell'
import { iconBox, iconGlyph, sectionContentTop, sectionMuted, sectionPad, sectionTitle, statCard } from '../ui/saas'

const statKeys = ['l1', 'l2', 'l3', 'l4'] as const
const statValues = ['500+', '75+', '10+', '2K+'] as const

type StatItem = {
  id: string
  value: string
  label?: Bilingual
  icon?: string
  sortOrder?: number
  active?: boolean
}

type StatsCms = {
  title?: Bilingual
  items?: StatItem[]
}

export function StatsSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const stats = data?.stats as StatsCms | undefined

  const title = stats?.title ? pick(stats.title, lang) : t('stats.title')
  const items = stats?.items
    ? [...stats.items]
        .filter((s) => s.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : null

  return (
    <section className={`${sectionMuted} ${sectionPad}`}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
        aria-hidden
      />
      <div className={pageShellClass}>
        <ScrollReveal>
          <h2 className={`${sectionTitle} mx-auto max-w-4xl`}>{title}</h2>
        </ScrollReveal>
        <div className={`${sectionContentTop} grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5`}>
          {items && items.length > 0
            ? items.map((s, i) => (
                <ScrollReveal key={s.id} delayMs={i * 80}>
                  <div className={statCard}>
                    {s.icon ? (
                      <div className={`${iconBox} mb-3`}>
                        <LucideByName name={s.icon} className={`size-5 ${iconGlyph}`} strokeWidth={2} />
                      </div>
                    ) : null}
                    <StatValue value={s.value} />
                    <p className="mt-2 text-sm font-medium leading-[1.5] text-slate-600">
                      {s.label ? pick(s.label, lang) : ''}
                    </p>
                  </div>
                </ScrollReveal>
              ))
            : statKeys.map((key, i) => (
                <ScrollReveal key={key} delayMs={i * 80}>
                  <div className={statCard}>
                    <StatValue value={statValues[i]} />
                    <p className="mt-2 text-sm font-medium leading-[1.5] text-slate-600">{t(`stats.${key}`)}</p>
                  </div>
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  )
}
