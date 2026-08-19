import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DetailImplementationModel } from '../../../types/detailPageSections'
import { resolveDetailIconName } from '../detail/detailIconMap'
import { moduleShellClass } from './moduleConstants'

function StepIcon({ title, hint }: { title: string; hint?: string }) {
  const name = resolveDetailIconName(title, hint)
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Circle
  return <Cmp className="mod-impl__icon" strokeWidth={2} aria-hidden />
}

type Props = {
  model: DetailImplementationModel
}

export function ModuleImplementationSteps({ model }: Props) {
  return (
    <section className="mod-section mod-section--pale">
      <div className={moduleShellClass}>
        <header className="mod-header-center">
          <h2 className="mod-h2">{model.heading}</h2>
          {model.lead ? <p className="mod-lead">{model.lead}</p> : null}
        </header>
        <ol className="mod-impl">
          {model.steps.map((step, idx) => (
            <li key={step.title} className="mod-impl__step">
              <article className="mod-impl__card">
                <span className="mod-impl__num">{idx + 1}</span>
                <StepIcon title={step.title} hint={step.icon} />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
              {idx < model.steps.length - 1 ? <span className="mod-impl__line" aria-hidden /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
