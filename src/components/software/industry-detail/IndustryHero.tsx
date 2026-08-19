import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../../i18n/I18nProvider'
import { CmsLink } from '../../CmsLink'
import type { IndustryHeroModel } from '../../../types/industryDetailPage'
import { IndustryHeroMedia } from './IndustryHeroMedia'

type Props = {
  model: IndustryHeroModel
  breadcrumb?: { home: string; mid: string; current: string }
  slug?: string
}

export function IndustryHero({ model, breadcrumb, slug }: Props) {
  const { lang } = useI18n()
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight
  const [introOpen, setIntroOpen] = useState(false)

  return (
    <section className="ind-hero">
      <div className="ind-hero__shell mx-auto w-full">
        {breadcrumb ? (
          <nav className="ind-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{breadcrumb.home}</Link>
            <span aria-hidden> / </span>
            <span>{breadcrumb.mid}</span>
            <span aria-hidden> / </span>
            <span>{breadcrumb.current}</span>
          </nav>
        ) : null}

        <div
          className="industryHeroGrid ind-hero__grid"
        >
          <div className="ind-hero__copy">
            {model.eyebrow ? <p className="ind-eyebrow">{model.eyebrow}</p> : null}
            <h1 className="ind-h1">{model.headline}</h1>
            <p className="ind-subhead">{model.subhead}</p>
            <div className="ind-body">
              {model.introLead ? <p>{model.introLead}</p> : null}
              {model.introMore.length > 0 ? (
                <>
                  <div className={`ind-hero__more ${introOpen ? 'is-open' : ''}`} hidden={!introOpen}>
                    {model.introMore.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                  <button type="button" className="ind-link-btn" aria-expanded={introOpen} onClick={() => setIntroOpen((v) => !v)}>
                    {introOpen ? 'Read less' : 'Read more'}
                  </button>
                </>
              ) : null}
            </div>
            <div className="ind-hero__actions">
              <CmsLink to={model.ctaPrimary.to} className="ind-btn ind-btn--primary">
                {model.ctaPrimary.label}
                <ChevronFwd className="size-4" aria-hidden />
              </CmsLink>
              <a href={model.ctaSecondary.to} target="_blank" rel="noopener noreferrer" className="ind-btn ind-btn--whatsapp">
                {model.ctaSecondary.label}
              </a>
            </div>
            {model.benefits.length > 0 ? (
              <ul className="ind-hero__benefits">
                {model.benefits.map((item) => (
                  <li key={item}>
                    <Check className="ind-hero__check" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <figure
            className="industryHeroMedia ind-hero__photo"
            style={{ ['--hero-position' as string]: model.objectPosition ?? 'center' }}
          >
            <IndustryHeroMedia
              src={model.heroImage}
              alt={model.heroImageAlt}
              objectPosition={model.objectPosition}
              fallbacks={model.heroImageFallbacks}
              slug={slug}
            />
          </figure>
        </div>
      </div>
    </section>
  )
}
