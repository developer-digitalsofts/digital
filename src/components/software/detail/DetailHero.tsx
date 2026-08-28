import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../../i18n/I18nProvider'
import { useLocale } from '../../../locale/LocaleContext'
import { CmsLink } from '../../CmsLink'
import type { DetailHeroModel } from '../../../types/detailPageSections'
import { getUniqueHeading } from '../../../data/softwareDetail/detailHeadingUtils'
import { DetailPageImage } from './DetailPageImage'
import { detailShellClass } from './detailConstants'
import '../accounts/accounts-prototype.css'

function HeroSecondaryCta({ label, to }: { label: string; to: string }) {
  if (to.startsWith('http')) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="accounts-proto-btn-secondary">
        {label}
      </a>
    )
  }
  return (
    <CmsLink to={to} className="accounts-proto-btn-secondary">
      {label}
    </CmsLink>
  )
}

type Props = {
  model: DetailHeroModel
  breadcrumb?: { home: string; mid: string; current: string }
}

export function DetailHero({ model, breadcrumb }: Props) {
  const { lang } = useI18n()
  const { href: localeHref } = useLocale()
  const homeHref = localeHref('/')
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight
  const [introOpen, setIntroOpen] = useState(false)

  const { eyebrow, title: headline } = getUniqueHeading(model.eyebrow, model.headline)
  const introLead = model.introParagraphs[0] ?? ''
  const introMore = model.introParagraphs.slice(1)

  return (
    <section className="accounts-proto-hero">
      <div className="accounts-proto-hero__blob accounts-proto-hero__blob--a" aria-hidden />
      <div className="accounts-proto-hero__blob accounts-proto-hero__blob--b" aria-hidden />

      <div className={`accounts-proto-hero__wrap ${detailShellClass}`}>
        {breadcrumb ? (
          <nav className="accounts-proto-breadcrumb" aria-label="Breadcrumb">
            <Link to={homeHref}>{breadcrumb.home}</Link>
            <span aria-hidden> / </span>
            <span>{breadcrumb.mid}</span>
            <span aria-hidden> / </span>
            <span>{breadcrumb.current}</span>
          </nav>
        ) : null}

        <div className="accounts-proto-hero__grid">
          <div className="accounts-proto-hero__copy">
            {eyebrow ? <p className="accounts-proto__eyebrow">{eyebrow}</p> : null}
            <h1 className="accounts-proto__h1">{headline ?? model.headline}</h1>
            <p className="accounts-proto__subhead">{model.subhead}</p>
            <div className="accounts-proto__body accounts-proto-hero__intro">
              {introLead ? <p>{introLead}</p> : null}
              {introMore.length > 0 ? (
                <>
                  <div
                    id="hero-intro-more"
                    className={`accounts-proto-hero__intro-more ${introOpen ? 'is-open' : ''}`}
                    hidden={!introOpen}
                  >
                    {introMore.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="accounts-proto-hero__read-more"
                    aria-expanded={introOpen}
                    aria-controls="hero-intro-more"
                    onClick={() => setIntroOpen((v) => !v)}
                  >
                    {introOpen ? 'Read less' : 'Read more'}
                  </button>
                </>
              ) : null}
            </div>
            <div className="accounts-proto-hero__actions">
              <CmsLink to={model.ctaPrimary.to} className="accounts-proto-btn-primary">
                {model.ctaPrimary.label}
                <ChevronFwd className="size-4" aria-hidden />
              </CmsLink>
              <HeroSecondaryCta label={model.ctaSecondary.label} to={model.ctaSecondary.to} />
            </div>
          </div>

          <div className="accounts-proto-hero__visual">
            <figure className="accounts-proto-hero__photo">
              <DetailPageImage
                src={model.heroImage}
                alt={model.heroImageAlt}
                priority
                fallbacks={model.heroImageFallbacks}
              />
            </figure>
            {model.statusPanel && model.statusPanel.length > 0 ? (
              <div className="accounts-proto-hero__status" aria-label="Summary">
                {model.statusPanel.map((chip) => (
                  <div key={chip.label} className="accounts-proto-hero__status-item">
                    <p className="accounts-proto-hero__status-label">{chip.label}</p>
                    <p className="accounts-proto-hero__status-value">{chip.value}</p>
                    <p className="accounts-proto-hero__status-hint">{chip.hint}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
