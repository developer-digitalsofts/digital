import { Check } from 'lucide-react'
import type { IndustryBenefitRowModel } from '../../../types/industryDetailPage'

function rowDescription(row: IndustryBenefitRowModel): string {
  return row.paragraphs.filter(Boolean).join(' ')
}
import { DetailPageImage } from '../detail/DetailPageImage'
import { industryShellClass } from './industryConstants'

type Props = { rows: IndustryBenefitRowModel[] }

export function IndustryAlternatingBenefits({ rows }: Props) {
  if (!rows.length) return null
  return (
    <section className="ind-section ind-section--pale">
      <div className={industryShellClass}>
        <div className="ind-benefit-rows">
          {rows.map((row, idx) => (
            <article
              key={row.title}
              className={`ind-benefit-row ${row.reverse || idx % 2 === 1 ? 'ind-benefit-row--reverse' : ''}`}
            >
              <figure className="ind-benefit-row__photo">
                <DetailPageImage src={row.image} alt={row.imageAlt} />
              </figure>
              <div className="ind-benefit-row__copy">
                <h2 className="ind-h2">{row.title}</h2>
                {rowDescription(row) ? <p className="ind-lead">{rowDescription(row)}</p> : null}
                {row.bullets.length > 0 ? (
                  <ul className="ind-benefit-row__points">
                    {row.bullets.map((point) => (
                      <li key={point}>
                        <Check className="ind-benefit-row__check" aria-hidden />
                        <span>{point}</span>
                      </li>
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
