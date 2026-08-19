import type { IndustryTestimonialModel } from '../../../types/industryDetailPage'
import { DetailPageImage } from '../detail/DetailPageImage'
import { industryShellClass } from './industryConstants'

type Props = { model: IndustryTestimonialModel }

export function IndustryTestimonial({ model }: Props) {
  return (
    <section className="ind-testimonial" aria-label="Customer testimonial">
      <div className={industryShellClass}>
        <div className="ind-testimonial__grid">
          {model.kpis.length > 0 ? (
            <ul className="ind-testimonial__kpis">
              {model.kpis.map((kpi) => (
                <li key={kpi.label}>
                  <p className="ind-testimonial__kpi-value">{kpi.value}</p>
                  <p className="ind-testimonial__kpi-label">{kpi.label}</p>
                </li>
              ))}
            </ul>
          ) : null}
          <blockquote className="ind-testimonial__quote">
            <p>&ldquo;{model.quote}&rdquo;</p>
            <footer>
              <div className="ind-testimonial__person">
                {model.image ? (
                  <figure className="ind-testimonial__avatar">
                    <DetailPageImage src={model.image} alt={model.imageAlt ?? model.attribution} />
                  </figure>
                ) : null}
                <div>
                  <cite>{model.attribution}</cite>
                  {model.role ? <span>{model.role}</span> : null}
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
