import { ArrowRight } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { CmsLink } from './CmsLink'
import { ScrollReveal } from './ScrollReveal'
import { pageShellClass } from '../ui/pageShell'
import { btnPrimary, sectionPad, sectionWhite } from '../ui/saas'

type Wf = {
  title?: Bilingual
  paragraph?: Bilingual
  sub?: Bilingual
  cta?: Bilingual
  ctaHref?: string
}

export function WorkflowCTASection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const wf = data?.workflow as Wf | undefined

  const title = wf?.title ? pick(wf.title, lang) : t('workflow.title')
  const bodyB = wf?.sub ?? wf?.paragraph
  const body = bodyB ? pick(bodyB, lang) : t('workflow.sub')
  const cta = wf?.cta ? pick(wf.cta, lang) : t('workflow.cta')
  const href = wf?.ctaHref?.trim() || '/contact#contact-form'

  return (
    <section id="workflow" className={`scroll-mt-28 ${sectionWhite} ${sectionPad}`}>
      <div className={pageShellClass}>
        <ScrollReveal>
          <div className="workflow-story-panel overflow-hidden rounded-2xl border border-[rgba(15,23,42,0.12)]">
            <div className="grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:px-12 lg:py-14">
              <div className="min-w-0 text-center lg:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                  {t('workflow.eyebrow')}
                </p>
                <h2 className="mt-2 font-heading text-[1.75rem] font-bold leading-[1.14] tracking-tight text-white sm:text-[2rem] lg:text-[2.125rem]">
                  {title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-[1.68] text-white/90 lg:mx-0">{body}</p>
                <CmsLink
                  to={href}
                  className={`${btnPrimary} mt-7 inline-flex gap-2 sm:mt-8`}
                >
                  {cta}
                  <ArrowRight className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
                </CmsLink>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {(['finance', 'inventory', 'branches', 'reports'] as const).map((key) => (
                  <div
                    key={key}
                    className="rounded-xl border border-white/15 bg-white/[0.07] px-4 py-4 text-center backdrop-blur-[2px] sm:px-5 sm:py-5"
                  >
                    <p className="font-heading text-lg font-bold text-white sm:text-xl">
                      {t(`workflow.highlights.${key}.value`)}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/75 sm:text-xs">
                      {t(`workflow.highlights.${key}.label`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
