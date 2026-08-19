import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ModuleRolesModel } from '../../../types/moduleDetailPage'
import { resolveDetailIconName } from '../detail/detailIconMap'
import { moduleShellClass } from './moduleConstants'

function RoleIcon({ title, hint }: { title: string; hint?: string }) {
  const name = resolveDetailIconName(title, hint)
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.User
  return <Cmp className="mod-roles__icon" strokeWidth={2} aria-hidden />
}

type Props = {
  model: ModuleRolesModel
}

export function ModuleRoleCards({ model }: Props) {
  return (
    <section className="mod-section">
      <div className={moduleShellClass}>
        <header className="mod-header-center">
          <h2 className="mod-h2">{model.heading}</h2>
        </header>
        <ul className="mod-roles">
          {model.cards.map((card) => (
            <li key={card.title}>
              <article className="mod-roles__card">
                <span className="mod-roles__icon-wrap">
                  <RoleIcon title={card.title} hint={card.icon} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
