import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { DetailOverviewModel } from '../../../types/detailPageSections'
import { DetailPageImage } from './DetailPageImage'
import { DetailIcon } from './DetailIcon'
import { detailShellClass } from './detailConstants'

type Props = {
  model: DetailOverviewModel
}

function FeatureItem({
  title,
  description,
  icon,
  compact = false,
}: {
  title: string
  description: string
  icon: string
  compact?: boolean
}) {
  return (
    <article className={`accounts-proto-features__item ${compact ? 'accounts-proto-features__item--compact' : ''}`}>
      <DetailIcon label={title} iconHint={icon} className="accounts-proto-features__item-icon shrink-0" />
      <div className="min-w-0 flex-1">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {!compact ? <ChevronRight className="accounts-proto-features__chevron size-5" aria-hidden /> : null}
    </article>
  )
}

export function ProductOverview({ model }: Props) {
  const [expanded, setExpanded] = useState(false)
  const extra = model.extraCapabilities ?? []
  const hasExtra = extra.length > 0

  return (
    <section className="accounts-proto__section">
      <div className={detailShellClass}>
        <header className="accounts-proto__header-center">
          <h2 className="accounts-proto__h2">{model.heading}</h2>
          <p className="accounts-proto__lead">{model.lead}</p>
        </header>

        <div className="accounts-proto-features">
          <div className="accounts-proto-features__columns">
            <figure className="accounts-proto-features__media">
              <DetailPageImage
                src={model.screenshot}
                alt={model.screenshotAlt}
                fallbacks={model.screenshotFallbacks}
              />
            </figure>

            <div className="accounts-proto-features__card">
              {model.capabilities.map((feature) => (
                <FeatureItem
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}

              {hasExtra ? (
                <button
                  type="button"
                  className="accounts-proto-features__toggle"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((v) => !v)}
                >
                  {expanded ? 'Show Less' : 'View All Features'}
                  <ChevronDown
                    className={`size-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
              ) : null}
            </div>
          </div>

          {hasExtra ? (
            <div className={`accounts-proto-features__expanded ${expanded ? 'is-open' : ''}`}>
              <div className="accounts-proto-features__expanded-inner">
                <div className="accounts-proto-features__expanded-grid">
                  {extra.map((feature) => (
                    <FeatureItem
                      key={feature.title}
                      title={feature.title}
                      description={feature.description}
                      icon={feature.icon}
                      compact
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
