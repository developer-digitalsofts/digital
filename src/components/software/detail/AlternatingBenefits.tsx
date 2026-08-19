import type { DetailAlternatingBenefitModel } from '../../../types/detailPageSections'
import { DetailPageImage } from './DetailPageImage'
import { DetailSoftwareMockup } from './DetailSoftwareMockup'
import { detailShellClass } from './detailConstants'

type Props = {
  items: DetailAlternatingBenefitModel[]
}

export function AlternatingBenefits({ items }: Props) {
  if (items.length === 0) return null

  return (
    <section className="accounts-proto__section accounts-proto__section--pale">
      <div className={detailShellClass}>
        <div className="accounts-proto-alt">
          {items.map((row, idx) => (
            <article
              key={row.title}
              className={`accounts-proto-alt__row ${idx % 2 === 1 ? 'accounts-proto-alt__row--reverse' : ''}`}
            >
              {row.visual === 'mockup' ? (
                <div className="accounts-proto-alt__mockup">
                  <DetailSoftwareMockup variant={row.mockupVariant ?? 'generic-module'} title={row.title} />
                </div>
              ) : (
                <figure className="accounts-proto-alt__photo">
                  <DetailPageImage src={row.image ?? ''} alt={row.imageAlt ?? row.title} />
                </figure>
              )}
              <div className="accounts-proto-alt__copy">
                <h3>{row.title}</h3>
                {row.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {row.bullets && row.bullets.length > 0 ? (
                  <ul>
                    {row.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
