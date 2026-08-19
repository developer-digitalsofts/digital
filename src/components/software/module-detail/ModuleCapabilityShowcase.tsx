import { ArrowRight } from 'lucide-react'
import { CmsLink } from '../../CmsLink'
import type { ModuleCapabilitiesModel, ModuleMockupSize } from '../../../types/moduleDetailPage'
import { DetailIcon } from '../detail/DetailIcon'
import { DetailPageImage } from '../detail/DetailPageImage'
import { ModuleDashboardMockup } from './ModuleDashboardMockup'
import { MODULE_SECTION_IDS, moduleShellClass } from './moduleConstants'

type Props = {
  model: ModuleCapabilitiesModel
  slug: string
}

export function ModuleCapabilityShowcase({ model, slug }: Props) {
  const useMockup = model.preferMockup || !model.screenshot
  const mockupSize: ModuleMockupSize = model.mockupSize ?? 'compact'

  return (
    <section className="mod-section" id={MODULE_SECTION_IDS.features}>
      <div className={moduleShellClass}>
        <header className="mod-header-center">
          <h2 className="mod-h2">{model.heading}</h2>
          {model.lead ? <p className="mod-lead">{model.lead}</p> : null}
        </header>

        <div className="mod-capabilities">
          <div className="mod-capabilities__visual">
            {useMockup ? (
              <ModuleDashboardMockup slug={slug} variant={model.mockupVariant} size={mockupSize} />
            ) : (
              <figure className="mod-capabilities__shot">
                <DetailPageImage src={model.screenshot!} alt={model.screenshotAlt ?? model.heading} />
              </figure>
            )}
          </div>

          <div className="mod-capabilities__cards">
            {model.cards.map((card) => (
              <article key={card.title} className="mod-capability-card">
                <DetailIcon label={card.title} iconHint={card.icon} className="mod-capability-card__icon" />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                {card.linkTo ? (
                  <CmsLink to={card.linkTo} className="mod-capability-card__link">
                    {card.linkLabel}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </CmsLink>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
