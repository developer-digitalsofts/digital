import type { IndustryDashboardShowcaseModel } from '../../../types/industryDetailPage'
import { DetailIcon } from '../detail/DetailIcon'
import { IndustryDashboardMockup } from './IndustryDashboardMockup'
import { industryShellClass } from './industryConstants'

type Props = { model: IndustryDashboardShowcaseModel; slug: string }

export function IndustryDashboardShowcase({ model, slug }: Props) {
  return (
    <section className="ind-section ind-section--pale">
      <div className={industryShellClass}>
        <header className="ind-header-center">
          <h2 className="ind-h2">{model.heading}</h2>
          {model.lead ? <p className="ind-lead">{model.lead}</p> : null}
        </header>
        <div className="ind-dashboard-showcase">
          <div className="ind-dashboard-showcase__visual">
            <IndustryDashboardMockup slug={slug} variant={model.mockupVariant} size="showcase" />
          </div>
          <div className="ind-dashboard-showcase__rows">
            {model.capabilities.map((row) => (
              <article key={row.title} className="ind-cap-row">
                <DetailIcon label={row.title} iconHint={row.icon} className="ind-cap-row__icon" />
                <div>
                  <h3>{row.title}</h3>
                  <p>{row.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
