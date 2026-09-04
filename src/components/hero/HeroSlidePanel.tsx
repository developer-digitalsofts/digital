import { Check } from 'lucide-react'
import { pick } from '../../cms/pick'
import { useI18n } from '../../i18n/I18nProvider'
import { CmsLink } from '../CmsLink'
import { useGetDemo, isGetDemoHref } from '../../context/GetDemoContext'
import { resolveHeroTrustPoints } from './defaultHeroSlides'
import type { HeroCarouselSlide, HeroCmsPayload } from '../../types/heroCarousel'

type Props = {
  slide: HeroCarouselSlide
  slideIndex: number
  slideCount: number
  animKey: number
  reducedMotion: boolean
  hero?: HeroCmsPayload
}

function HeroCtaButton({
  href,
  label,
  variant,
}: {
  href: string
  label: string
  variant: 'primary' | 'secondary'
}) {
  const { openDemo } = useGetDemo()
  const className = variant === 'primary' ? 'dm-hero__btn dm-hero__btn--primary' : 'dm-hero__btn dm-hero__btn--secondary'

  if (isGetDemoHref(href)) {
    return (
      <button type="button" className={className} onClick={openDemo}>
        {label}
      </button>
    )
  }
  return (
    <CmsLink to={href} className={className}>
      {label}
    </CmsLink>
  )
}

export function HeroSlidePanel({ slide, slideIndex, slideCount, animKey, reducedMotion, hero }: Props) {
  const { lang } = useI18n()

  const trustPoints = resolveHeroTrustPoints(hero, lang)
  const pill = pick(slide.pill, lang)
  const titleBefore = pick(slide.titleBefore, lang)
  const titleAccent = pick(slide.titleAccent, lang)
  const titleLine2 = slide.titleLine2 ? pick(slide.titleLine2, lang) : ''
  const body = pick(slide.body, lang)
  const cta1 = pick(slide.ctaPrimary.label, lang)
  const cta1Href = slide.ctaPrimary.href?.trim() || '#get-demo'
  const cta2 = pick(slide.ctaSecondary.label, lang)
  const cta2Href = slide.ctaSecondary.href?.trim() || '/#modules'

  return (
    <div
      key={animKey}
      className={`dm-hero__copy-inner ${reducedMotion ? '' : 'dm-hero__slide-enter'}`}
      role="tabpanel"
      aria-roledescription="slide"
      aria-label={`${slideIndex + 1} of ${slideCount}`}
    >
      {pill ? <p className="dm-hero__pill">{pill}</p> : null}

      <h1
        className={`dm-hero__title${slide.controlledTitleWrap ? ' dm-hero__title--balanced' : ''}${
          slide.controlledTitleWrap && !titleLine2 ? ' dm-hero__title--two-phrase' : ''
        }`}
      >
        <span className="dm-hero__title-line">{titleBefore}</span>
        {titleLine2 ? <span className="dm-hero__title-line dm-hero__title-line--mid">{titleLine2}</span> : null}
        <span className="dm-hero__title-line dm-hero__title-line--accent">{titleAccent}</span>
      </h1>

      <p className="dm-hero__body">{body}</p>

      <div className="dm-hero__cta-row">
        <HeroCtaButton href={cta1Href} label={cta1} variant="primary" />
        <HeroCtaButton href={cta2Href} label={cta2} variant="secondary" />
      </div>

      {trustPoints.length > 0 ? (
        <ul className="dm-hero__trust" aria-label="Key benefits">
          {trustPoints.map((point) => (
            <li key={point} className="dm-hero__trust-item">
              <span className="dm-hero__trust-icon" aria-hidden>
                <Check strokeWidth={2.5} />
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
