import type { IndustryBusinessTypeModel } from '../../../types/industryDetailPage'
import { DetailPageImage } from '../detail/DetailPageImage'
import { industryShellClass } from './industryConstants'

type Props = { model: { heading: string; cards: IndustryBusinessTypeModel[] } }

export function IndustryBusinessTypes({ model }: Props) {
  if (!model.cards.length) return null
  return (
    <section className="ind-section ind-section--muted">
      <div className={industryShellClass}>
        <header className="ind-header-center">
          <h2 className="ind-h2">{model.heading}</h2>
        </header>
        <div className="ind-biz-types">
          {model.cards.map((card) => (
            <article key={card.title} className="ind-biz-type">
              <figure className="ind-biz-type__photo">
                <DetailPageImage src={card.image} alt={card.imageAlt} />
                <figcaption>{card.title}</figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
