import type { DetailTestimonialModel } from '../../../types/detailPageSections'
import { DetailPageImage } from './DetailPageImage'
import { detailShellClass } from './detailConstants'

type Props = {
  model: DetailTestimonialModel
}

export function TestimonialResults({ model }: Props) {
  return (
    <section className="accounts-proto__section accounts-proto__section--testimonial">
      <div className={detailShellClass}>
        <div className="accounts-proto-testimonial">
          <figure className="accounts-proto-testimonial__photo">
            <DetailPageImage src={model.image} alt={model.imageAlt} />
          </figure>
          <blockquote className="accounts-proto-testimonial__quote">
            <p>{model.quote}</p>
            <footer>{model.attribution}</footer>
          </blockquote>
          {model.results.length > 0 ? (
            <ul className="accounts-proto-testimonial__results">
              {model.results.map((r) => (
                <li key={r.label}>
                  <p className="accounts-proto-testimonial__result-value">{r.value}</p>
                  <p className="accounts-proto-testimonial__result-label">{r.label}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
