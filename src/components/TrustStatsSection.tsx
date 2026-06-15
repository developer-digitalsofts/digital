import { useI18n } from '../i18n/I18nProvider'
import { pageShellClass } from '../ui/pageShell'
import { ScrollReveal } from './ScrollReveal'
import { sectionContentTop, sectionPadCompact, sectionTitle, sectionWhite } from '../ui/saas'

const statKeys = ['experience', 'softwares', 'clients', 'satisfaction', 'multibranch'] as const

export function TrustStatsSection() {
  const { t } = useI18n()

  return (
    <section
      id="trust-stats"
      className={`scroll-mt-28 border-b border-slate-200/60 ${sectionWhite} ${sectionPadCompact}`}
    >
      <div className={pageShellClass}>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className={sectionTitle}>{t('trustStats.title')}</h2>
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <div
            className={`${sectionContentTop} trust-stat-bar overflow-hidden rounded-xl border border-[rgba(15,23,42,0.12)] bg-[#f8fafc]`}
          >
            <div className="grid grid-cols-2 divide-x divide-y divide-[rgba(15,23,42,0.1)] sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
              {statKeys.map((key) => (
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
