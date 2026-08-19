import { ArrowRight } from 'lucide-react'
import { CmsLink } from '../../CmsLink'
import type { ModuleFeatureStoryModel } from '../../../types/moduleDetailPage'
import { DetailPageImage } from '../detail/DetailPageImage'
import { moduleShellClass } from './moduleConstants'

type Props = {
  model: ModuleFeatureStoryModel
}

export function ModuleFeatureStories({ model }: Props) {
  if (!model.cards.length) return null

  return (
    <section className="mod-section">
      <div className={moduleShellClass}>
        <div className="mod-stories">
          {model.cards.map((card) => {
            const inner = (
              <>
                <figure className="mod-stories__photo">
                  <DetailPageImage src={card.image} alt={card.imageAlt} />
                </figure>
                <div className="mod-stories__body">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="mod-stories__link">
                    Explore
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </div>
              </>
            )

            return card.to ? (
              <CmsLink key={card.title} to={card.to} className="mod-stories__card">
                {inner}
              </CmsLink>
            ) : (
              <article key={card.title} className="mod-stories__card">
                {inner}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
