import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { CmsLink } from './CmsLink'
import { CTA_BANNER_IMAGES, HomeCtaBanner, resolveCtaBackgroundUrl } from './HomeCtaBanner'
import { btnCtaLg } from '../ui/saas'

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
  const backgroundUrl = resolveCtaBackgroundUrl(wf?.background, CTA_BANNER_IMAGES.workflow)

  return (
    <HomeCtaBanner
      id="workflow"
      backgroundUrl={backgroundUrl}
      title={title}
      body={body}
      overlay="45"
    >
      <CmsLink to={href} className={btnCtaLg}>
        {cta}
      </CmsLink>
    </HomeCtaBanner>
  )
}
