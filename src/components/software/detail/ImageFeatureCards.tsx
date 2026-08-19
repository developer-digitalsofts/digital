import { useState, type ReactNode } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { CmsLink } from '../../CmsLink'
import type { DetailImageFeaturesModel } from '../../../types/detailPageSections'
import { DetailPageImage } from './DetailPageImage'
import { detailShellClass } from './detailConstants'

type Props = {
  model: DetailImageFeaturesModel
}

function FeatureCardLink({
  to,
  children,
}: {
  to?: string
  children: ReactNode
}) {
  if (!to) return <article className="accounts-proto-card-feature">{children}</article>
  if (to.startsWith('http') || to.startsWith('/contact')) {
    return (
      <a href={to} className="accounts-proto-card-feature">
        {children}
      </a>
    )
  }
  return (
    <CmsLink to={to} className="accounts-proto-card-feature">
      {children}
    </CmsLink>
  )
}

export function ImageFeatureCards({ model }: Props) {
  const [expanded, setExpanded] = useState(false)
  const extra = model.extraCards ?? []

  if (model.cards.length === 0) return null

  return (
    <section className="accounts-proto__section accounts-proto__section--pale">
      <div className={detailShellClass}>
        <header className="accounts-proto__header-center">
          <h2 className="accounts-proto__h2">{model.heading}</h2>
          {model.lead ? <p className="accounts-proto__lead">{model.lead}</p> : null}
        </header>

        <div className="accounts-proto-card-feature__grid">
          {model.cards.map((card) => (
            <FeatureCardLink key={card.title} to={card.to}>
              <figure className="accounts-proto-card-feature__photo">
                <DetailPageImage src={card.image} alt={card.imageAlt} />
              </figure>
              <div className="accounts-proto-card-feature__body">
                <h3>{card.title}</h3>
                {card.description ? <p>{card.description}</p> : null}
                {card.to ? (
                  <span className="accounts-proto-card-feature__link">
                    Learn more
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                ) : null}
              </div>
            </FeatureCardLink>
          ))}
        </div>

        {extra.length > 0 ? (
          <div className="accounts-proto-card-feature__more">
            <button
              type="button"
              className="accounts-proto-features__toggle"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              View all
              <ChevronDown className={`size-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            {expanded ? (
              <div className="accounts-proto-card-feature__grid accounts-proto-card-feature__grid--extra">
                {extra.map((card) => (
                  <FeatureCardLink key={card.title} to={card.to}>
                    <figure className="accounts-proto-card-feature__photo">
                      <DetailPageImage src={card.image} alt={card.imageAlt} />
                    </figure>
                    <div className="accounts-proto-card-feature__body">
                      <h3>{card.title}</h3>
                      {card.description ? <p>{card.description}</p> : null}
                    </div>
                  </FeatureCardLink>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
