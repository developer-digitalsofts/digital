import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../../../i18n/I18nProvider'
import { CmsLink } from '../../CmsLink'
import type { ModuleHeroModel } from '../../../types/moduleDetailPage'
import { ModuleDashboardMockup } from './ModuleDashboardMockup'
import './module-detail.css'

type Props = {
  model: ModuleHeroModel
  slug: string
  breadcrumb?: { home: string; mid: string; current: string }
}

export function ModuleHero({ model, slug, breadcrumb }: Props) {
  const { lang } = useI18n()
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight
  const [introOpen, setIntroOpen] = useState(false)

  return (
    <section className="mod-hero">
      <div className="mod-hero__shell mx-auto w-full">
        {breadcrumb ? (
          <nav className="mod-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{breadcrumb.home}</Link>
            <span aria-hidden> / </span>
            <span>{breadcrumb.mid}</span>
            <span aria-hidden> / </span>
            <span>{breadcrumb.current}</span>
          </nav>
        ) : null}

        <div className="mod-hero__grid">
          <div className="mod-hero__copy">
            {model.eyebrow ? <p className="mod-eyebrow">{model.eyebrow}</p> : null}
            <h1 className="mod-h1">{model.headline}</h1>
            <p className="mod-subhead">{model.subhead}</p>
            <div className="mod-body">
              {model.introLead ? <p>{model.introLead}</p> : null}
              {model.introMore.length > 0 ? (
                <>
                  <div className={`mod-hero__more ${introOpen ? 'is-open' : ''}`} hidden={!introOpen}>
                    {model.introMore.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mod-link-btn"
                    aria-expanded={introOpen}
                    onClick={() => setIntroOpen((v) => !v)}
                  >
                    {introOpen ? 'Read less' : 'Read more'}
                  </button>
                </>
              ) : null}
            </div>

            <div className="mod-hero__actions">
              <CmsLink to={model.ctaPrimary.to} className="mod-btn mod-btn--primary">
                {model.ctaPrimary.label}
                <ChevronFwd className="size-4" aria-hidden />
              </CmsLink>
              <a
                href={model.ctaSecondary.to}
                target="_blank"
                rel="noopener noreferrer"
                className="mod-btn mod-btn--whatsapp"
              >
                {model.ctaSecondary.label}
              </a>
            </div>

            {model.benefits.length > 0 ? (
              <ul className="mod-hero__benefits">
                {model.benefits.map((item) => (
                  <li key={item}>
                    <Check className="mod-hero__check" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="mod-hero__visual">
            <ModuleDashboardMockup slug={slug} variant={model.mockupVariant} size="hero" />
          </div>
        </div>
      </div>
    </section>
  )
}
