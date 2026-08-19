import { Check } from 'lucide-react'
import type { ModuleAlternatingSectionModel } from '../../../types/moduleDetailPage'
import { DetailPageImage } from '../detail/DetailPageImage'
import { ModuleDashboardMockup } from './ModuleDashboardMockup'
import { moduleShellClass } from './moduleConstants'

type Props = {
  items: ModuleAlternatingSectionModel[]
  slug: string
}

export function ModuleAlternatingSections({ items, slug }: Props) {
  if (!items.length) return null

  return (
    <>
      {items.map((item, idx) => {
        const reverse = item.reverse ?? idx % 2 === 1
        return (
          <section
            key={item.title}
            className={`mod-section ${idx % 2 === 0 ? 'mod-section--pale' : 'mod-section--muted'}`}
          >
            <div className={moduleShellClass}>
              <div className={`mod-alt ${reverse ? 'mod-alt--reverse' : ''}`}>
                <div className="mod-alt__visual">
                  {item.visual === 'photo' && item.image ? (
                    <figure className="mod-alt__photo">
                      <DetailPageImage src={item.image} alt={item.imageAlt ?? item.title} />
                    </figure>
                  ) : (
                    <ModuleDashboardMockup
                      slug={slug}
                      variant={item.mockupVariant ?? 'generic-module'}
                      size={item.mockupSize ?? 'compact'}
                    />
                  )}
                </div>
                <div className="mod-alt__copy">
                  <h2 className="mod-h2">{item.title}</h2>
                  {item.paragraphs.map((p) => (
                    <p key={p} className="mod-lead">
                      {p}
                    </p>
                  ))}
                  {item.bullets.length > 0 ? (
                    <ul className="mod-checklist">
                      {item.bullets.map((b) => (
                        <li key={b}>
                          <Check className="mod-checklist__icon" aria-hidden />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
