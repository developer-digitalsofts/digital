import { WHATSAPP_URL } from '../constants'
import { WhatsAppIcon } from './WhatsAppIcon'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { CmsLink } from './CmsLink'
import { CTA_BANNER_IMAGES, HomeCtaBanner, resolveCtaBackgroundUrl } from './HomeCtaBanner'
import { btnCtaLg, btnOnDarkLg } from '../ui/saas'

type CtaCms = {
  title?: Bilingual
  paragraph?: Bilingual
  sub?: Bilingual
  background?: string
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
  const backgroundUrl = resolveCtaBackgroundUrl(c?.background, CTA_BANNER_IMAGES.final)

  return (
    <HomeCtaBanner
      id="final-cta"
      backgroundUrl={backgroundUrl}
      title={title}
      body={body}
      overlay="40"
    >
      <CmsLink to={p1h} className={btnCtaLg}>
        {p1}
      </CmsLink>
      <CmsLink to={p2h} className={btnOnDarkLg}>
        {p2}
      </CmsLink>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-7 py-3 text-[0.9375rem] font-semibold text-white backdrop-blur-[2px] transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#25D366]/60 hover:bg-emerald-500/15 motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <WhatsAppIcon className="size-5" />
        {wa}
      </a>
    </HomeCtaBanner>
  )
}
