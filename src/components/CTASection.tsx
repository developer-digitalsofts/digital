import { WHATSAPP_URL } from '../constants'
import { WhatsAppIcon } from './WhatsAppIcon'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { CmsLink } from './CmsLink'
import { CTA_BANNER_IMAGES, HomeCtaBanner, resolveCtaBackgroundUrl } from './HomeCtaBanner'
import { btnPrimary } from '../ui/saas'

type CtaCms = {
  title?: Bilingual
  paragraph?: Bilingual
  sub?: Bilingual
  background?: string
  primary?: { label?: Bilingual; href?: string }
  secondary?: { label?: Bilingual; href?: string }
  whatsapp?: { label?: Bilingual; href?: string }
}

const ctaBtnBase =
  'inline-flex min-h-[42px] w-full items-center justify-center rounded-lg px-5 py-2.5 text-[0.9375rem] font-semibold transition-[background-color,border-color,color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6'

export function CTASection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const c = data?.cta as CtaCms | undefined

  const title = c?.title ? pick(c.title, lang) : t('cta.title')
  const body = c?.paragraph ? pick(c.paragraph, lang) : c?.sub ? pick(c.sub, lang) : t('cta.sub')
  const trustLine = t('cta.trustLine')
  const p1 = c?.primary?.label ? pick(c.primary.label, lang) : t('cta.demo')
  const p1h = c?.primary?.href?.trim() || '/contact'
  const p2 = c?.secondary?.label ? pick(c.secondary.label, lang) : t('cta.expert')
  const p2h = c?.secondary?.href?.trim() || '/contact'
  const wa = c?.whatsapp?.label ? pick(c.whatsapp.label, lang) : t('cta.wa')
  const waHref = c?.whatsapp?.href?.trim() || WHATSAPP_URL
  const backgroundUrl = resolveCtaBackgroundUrl(c?.background, CTA_BANNER_IMAGES.final)

  const ctaBtnPrimary = `${btnPrimary} ${ctaBtnBase}`
  const ctaBtnOutline = `${ctaBtnBase} border-2 border-white bg-transparent text-white hover:bg-white/10 focus-visible:outline-white`
  const ctaBtnWhatsApp = `${ctaBtnBase} gap-2 border border-[#25D366] bg-[#25D366] text-white hover:border-[#20bd5a] hover:bg-[#20bd5a] focus-visible:outline-white`

  return (
    <HomeCtaBanner
      id="final-cta"
      backgroundUrl={backgroundUrl}
      title={title}
      body={body}
      trustLine={trustLine}
      variant="final"
      trustAfterActions
    >
      <CmsLink to={p1h} className={ctaBtnPrimary}>
        {p1}
      </CmsLink>
      <CmsLink to={p2h} className={ctaBtnOutline}>
        {p2}
      </CmsLink>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className={ctaBtnWhatsApp}
      >
        <WhatsAppIcon className="size-[1.125rem] shrink-0" />
        {wa}
      </a>
    </HomeCtaBanner>
  )
}
