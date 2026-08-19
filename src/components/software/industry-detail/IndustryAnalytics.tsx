import type { IndustryAnalyticsModel } from '../../../types/industryDetailPage'
import { IndustryDashboardMockup } from './IndustryDashboardMockup'
import { industryShellClass } from './industryConstants'

type Props = { model: IndustryAnalyticsModel; slug: string }

export function IndustryAnalytics({ model, slug }: Props) {
  return (
    <section className="ind-section">
      <div className={industryShellClass}>
        <div className="ind-analytics">
          <div className="ind-analytics__visual">
            <IndustryDashboardMockup slug={slug} variant={model.mockupVariant} size="analytics" />
          </div>
          <div className="ind-analytics__copy">
            <h2 className="ind-h2">{model.heading}</h2>
            <ol className="ind-analytics__list">
              {model.benefits.map((item, idx) => (
                <li key={item.title}>
                  <span className="ind-analytics__num">{idx + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
