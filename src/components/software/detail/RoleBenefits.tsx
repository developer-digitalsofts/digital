import { DetailIcon } from './DetailIcon'
import type { DetailRoleModel } from '../../../types/detailPageSections'
import { detailShellClass } from './detailConstants'

type Props = {
  heading: string
  items: DetailRoleModel[]
}

export function RoleBenefits({ heading, items }: Props) {
  if (items.length === 0) return null

  return (
    <section className="accounts-proto__section">
      <div className={detailShellClass}>
        <header className="accounts-proto__header-center">
          <h2 className="accounts-proto__h2">{heading}</h2>
        </header>
        <div className="accounts-proto-roles">
          {items.map((role) => (
            <article key={role.title} className="accounts-proto-roles__item">
              <DetailIcon label={role.title} iconHint={role.icon} className="mx-auto mb-3" />
              <h3>{role.title}</h3>
              <p>{role.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
