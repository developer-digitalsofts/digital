import type { IndustryRoleCardModel } from '../../../types/industryDetailPage'
import { DetailIcon } from '../detail/DetailIcon'
import { industryShellClass } from './industryConstants'

type Props = { model: { heading: string; cards: IndustryRoleCardModel[] } }

export function IndustryRoles({ model }: Props) {
  if (!model.cards.length) return null
  return (
    <section className="ind-section">
      <div className={industryShellClass}>
        <header className="ind-header-center">
          <h2 className="ind-h2">{model.heading}</h2>
        </header>
        <div className="ind-roles">
          {model.cards.map((role) => (
            <article key={role.title} className="ind-role">
              <DetailIcon label={role.title} iconHint={role.icon} className="ind-role__icon" />
              <h3>{role.title}</h3>
              <p>{role.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
