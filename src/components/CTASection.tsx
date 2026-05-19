import { WHATSAPP_URL } from '../constants'
import { WhatsAppIcon } from './WhatsAppIcon'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { CmsLink } from './CmsLink'
import { ScrollReveal } from './ScrollReveal'
import { pageShellClass } from '../ui/pageShell'
import { btnPrimary, btnSecondary, ctaPanel, sectionPad, sectionSub, sectionTitle } from '../ui/saas'

type CtaCms = {
  title?: Bilingual
  paragraph?: Bilingual
  sub?: Bilingual
  primary?: { label?: Bilingual; href?: string }
  secondary?: { label?: Bilingual; href?: string }
  whatsapp?: { label?: Bilingual; href?: string }
}

export function CTASection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const c = data?.cta as CtaCms | undefined

  const title = c?.title ? pick(c.title, lang) : t('cta.title')
  const body = c?.paragraph ? pick(c.paragraph, lang) : c?.sub ? pick(c.sub, lang) : t('cta.sub')
  const p1 = c?.primary?.label ? pick(c.primary.label, lang) : t('cta.demo')
  const p1h = c?.primary?.href?.trim() || '/contact'
  const p2 = c?.secondary?.label ? pick(c.secondary.label, lang) : t('cta.expert')
  const p2h = c?.secondary?.href?.trim() || '/contact'
  const wa = c?.whatsapp?.label ? pick(c.whatsapp.label, lang) : t('cta.wa')
  const waHref = c?.whatsapp?.href?.trim() || WHATSAPP_URL

  return (
    <section id="final-cta" className={`relative overflow-hidden border-t border-slate-200/40 bg-gradient-to-b from-white to-slate-50/80 ${sectionPad}`}>
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[min(100%,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.07] blur-3xl"
        aria-hidden
      />
      <div className={pageShellClass}>
        <ScrollReveal>
        <div className={`${ctaPanel} relative`}>
          <h2 className={sectionTitle}>{title}</h2>
          <p className={`${sectionSub} mx-auto mt-2.5 max-w-xl text-center`}>{body}</p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
            <CmsLink to={p1h} className={btnPrimary}>
              {p1}
            </CmsLink>
            <CmsLink to={p2h} className={btnSecondary}>
              {p2}
            </CmsLink>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg border border-[#25D366]/40 bg-white/90 px-5 py-2.5 text-sm font-semibold text-[#128C7E] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:border-[#25D366] hover:bg-emerald-50/70 motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
            >
              <WhatsAppIcon className="size-5" />
              {wa}
            </a>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
