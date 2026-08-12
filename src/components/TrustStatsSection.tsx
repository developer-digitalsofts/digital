import { useMemo } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { pageShellClass } from '../ui/pageShell'
import { ScrollReveal } from './ScrollReveal'
import { sectionContentTop, sectionPadCompact, sectionTitle, sectionWhite } from '../ui/saas'

const fallbackKeys = ['experience', 'softwares', 'clients', 'satisfaction', 'multibranch'] as const

type StatItem = {
  id: string
  value: string
  label?: Bilingual
  sortOrder?: number
  active?: boolean
}

type StatsCms = {
  title?: Bilingual
  items?: StatItem[]
}

/** Trust-bar visual (existing design) fed by published CMS stats when available. */
export function TrustStatsSection() {
  const { t, lang } = useI18n()
  const { data, loading } = useCms()
  const stats = data?.stats as StatsCms | undefined

  const title = stats?.title ? pick(stats.title, lang) : t('trustStats.title')
  const items = useMemo(() => {
    if (!stats?.items?.length) return null
    return [...stats.items]
      .filter((s) => s.active !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }, [stats?.items])

  return (
    <section
      id="trust-stats"
      className={`scroll-mt-28 border-b border-slate-200/60 ${sectionWhite} ${sectionPadCompact}`}
      aria-busy={loading && !data}
    >
      <div className={pageShellClass}>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className={`${sectionTitle} ${loading && !data ? 'animate-pulse text-slate-400' : ''}`}>{title}</h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <div
            className={`${sectionContentTop} trust-stat-bar overflow-hidden rounded-xl border border-[rgba(15,23,42,0.12)] bg-[#f8fafc]`}
          >
            <div className="grid grid-cols-2 divide-x divide-y divide-[rgba(15,23,42,0.1)] sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
              {items && items.length > 0
                ? items.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col items-center justify-center px-4 py-5 text-center sm:px-5 sm:py-6"
                    >
                      <p className="font-heading text-[1.375rem] font-bold leading-none tracking-tight text-brand-deep sm:text-2xl">
                        {s.value}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 sm:text-xs sm:tracking-wide">
                        {s.label ? pick(s.label, lang) : ''}
                      </p>
                    </div>
                  ))
                : fallbackKeys.map((key) => (
                    <div
                      key={key}
                      className="flex flex-col items-center justify-center px-4 py-5 text-center sm:px-5 sm:py-6"
                    >
                      <p className="font-heading text-[1.375rem] font-bold leading-none tracking-tight text-brand-deep sm:text-2xl">
                        {t(`about.statsBar.${key}.value`)}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 sm:text-xs sm:tracking-wide">
                        {t(`about.statsBar.${key}.label`)}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
