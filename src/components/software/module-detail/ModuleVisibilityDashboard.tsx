import type { ModuleMockupSize, ModuleVisibilityModel } from '../../../types/moduleDetailPage'
import { DetailPageImage } from '../detail/DetailPageImage'
import { ModuleDashboardMockup } from './ModuleDashboardMockup'
import { moduleShellClass } from './moduleConstants'

/** Marker positions for numbered callouts on large dashboard mockups. */
const MARKER_POSITIONS = [
  { top: '14%', left: '18%' },
  { top: '14%', left: '52%' },
  { top: '14%', left: '82%' },
  { top: '58%', left: '28%' },
  { top: '58%', left: '72%' },
]

type Props = {
  model: ModuleVisibilityModel
  slug: string
}

export function ModuleVisibilityDashboard({ model, slug }: Props) {
  const useMockup = model.preferMockup || !model.screenshot
  const mockupSize: ModuleMockupSize = model.mockupSize ?? 'compact'

  return (
    <section className="mod-section mod-section--muted mod-visibility-section">
      <div className={moduleShellClass}>
        <div className="mod-visibility">
          <div className="mod-visibility__copy">
            <h2 className="mod-h2">{model.heading}</h2>
            <ol className="mod-visibility__list">
              {model.points.map((point, idx) => (
                <li key={point.title}>
                  <span className="mod-visibility__num">{idx + 1}</span>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="mod-visibility__visual">
            {useMockup ? (
              <div className="mod-visibility__mockup-wrap">
                <ModuleDashboardMockup slug={slug} variant={model.mockupVariant} size={mockupSize} />
                {model.showMarkers ? (
                  <div className="mod-visibility__markers" aria-hidden>
                    {model.points.slice(0, MARKER_POSITIONS.length).map((point, idx) => (
                      <span
                        key={point.title}
                        className="mod-visibility__marker"
                        style={MARKER_POSITIONS[idx]}
                      >
                        {idx + 1}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <figure className="mod-visibility__shot">
                <DetailPageImage src={model.screenshot!} alt={model.screenshotAlt ?? model.heading} />
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
