import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { CmsLink } from './CmsLink'
import { ScrollReveal } from './ScrollReveal'
import { pageShellClass } from '../ui/pageShell'
import { btnPrimary, sectionPad, sectionSubCenter, sectionTitle, workflowCtaPanel } from '../ui/saas'

type Wf = {
  title?: Bilingual
  paragraph?: Bilingual
  sub?: Bilingual
  cta?: Bilingual
  ctaHref?: string
  background?: string
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

  const bgClass =
    wf?.background === 'gradient-strong'
      ? 'border-y border-slate-100/90 bg-gradient-to-b from-orange-50/40 via-slate-50/80 to-slate-50'
      : 'border-y border-slate-100/90 bg-gradient-to-b from-slate-50/90 via-white to-slate-50/80'

  return (
    <section id="workflow" className={`relative overflow-hidden ${sectionPad} ${bgClass}`}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-brand/[0.04] to-transparent"
        aria-hidden
      />
      <div className={pageShellClass}>
        <ScrollReveal className={workflowCtaPanel}>
          <h2 className={sectionTitle}>{title}</h2>
          <p className={sectionSubCenter}>{body}</p>
          <CmsLink to={href} className={`relative mt-6 ${btnPrimary}`}>
            {cta}
          </CmsLink>
        </ScrollReveal>
      </div>
    </section>
  )
}
