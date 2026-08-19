import type { DetailAnnotatedViewModel } from '../../../types/detailPageSections'
import { DetailPageImage } from './DetailPageImage'
import { detailShellClass } from './detailConstants'

type Props = {
  model: DetailAnnotatedViewModel
}

export function AnnotatedProductView({ model }: Props) {
  if (model.callouts.length === 0) return null

  return (
    <section className="accounts-proto__section accounts-proto__section--muted">
      <div className={detailShellClass}>
        <header className="accounts-proto__header-center">
          <h2 className="accounts-proto__h2">{model.heading}</h2>
          {model.lead ? <p className="accounts-proto__lead">{model.lead}</p> : null}
        </header>

        <div className="accounts-proto-annotated">
          <figure className="accounts-proto-annotated__screen">
            <DetailPageImage
              src={model.screenshot}
              alt={model.screenshotAlt}
              fallbacks={model.screenshotFallbacks}
            />
            {model.callouts.map((callout) => (
              <div
                key={callout.title}
                className={`accounts-proto-annotated__callout accounts-proto-annotated__callout--${callout.position}`}
              >
                <p className="accounts-proto-annotated__callout-title">{callout.title}</p>
                {callout.description ? (
                  <p className="accounts-proto-annotated__callout-desc">{callout.description}</p>
                ) : null}
              </div>
            ))}
          </figure>
        </div>
      </div>
    </section>
  )
}
