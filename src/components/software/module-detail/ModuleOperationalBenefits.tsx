import { Check } from 'lucide-react'
import type { ModuleOperationalModel } from '../../../types/moduleDetailPage'
import { DetailPageImage } from '../detail/DetailPageImage'
import { MODULE_SECTION_IDS, moduleShellClass } from './moduleConstants'

type Props = {
  model: ModuleOperationalModel
}

export function ModuleOperationalBenefits({ model }: Props) {
  return (
    <section className="mod-section mod-section--pale" id={MODULE_SECTION_IDS.overview}>
      <div className={moduleShellClass}>
        <div className="mod-operational">
          <figure className="mod-operational__photo">
            <DetailPageImage src={model.image} alt={model.imageAlt} />
          </figure>
          <div className="mod-operational__copy">
            <h2 className="mod-h2">{model.heading}</h2>
            <p className="mod-lead">{model.intro}</p>
            <ul className="mod-checklist">
              {model.benefits.map((item) => (
                <li key={item}>
                  <Check className="mod-checklist__icon" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
