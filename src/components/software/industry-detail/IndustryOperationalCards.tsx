import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { IndustryOperationalCardModel } from '../../../types/industryDetailPage'
import { DetailPageImage } from '../detail/DetailPageImage'
import { resolveDetailIconName } from '../detail/detailIconMap'
import { industryShellClass } from './industryConstants'

function CardIcon({ title, hint }: { title: string; hint?: string }) {
  const name = resolveDetailIconName(title, hint)
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Sparkles
  return <Cmp className="size-4" strokeWidth={2} aria-hidden />
}

type Props = { cards: IndustryOperationalCardModel[] }

export function IndustryOperationalCards({ cards }: Props) {
  if (!cards.length) return null
  return (
    <section className="ind-section">
      <div className={industryShellClass}>
        <header className="ind-header-center">
          <h2 className="ind-h2">Real Operational Use Cases</h2>
        </header>
        <div className="ind-op-cards">
          {cards.map((card) => (
            <article key={card.title} className="ind-op-card">
              <figure className="ind-op-card__photo">
                <DetailPageImage src={card.image} alt={card.imageAlt} />
                <span className="ind-op-card__badge">
                  <CardIcon title={card.title} hint={card.icon} />
                </span>
              </figure>
              <div className="ind-op-card__body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
