import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { IndustryImplementationModel } from '../../../types/industryDetailPage'
import { resolveDetailIconName } from '../detail/detailIconMap'
import { industryShellClass } from './industryConstants'

function StepIcon({ title, hint }: { title: string; hint?: string }) {
  const name = resolveDetailIconName(title, hint)
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Circle
  return <Cmp className="ind-impl__glyph" strokeWidth={2} aria-hidden />
}

type Props = { model: IndustryImplementationModel }

export function IndustryImplementation({ model }: Props) {
  return (
    <section className="ind-section">
      <div className={industryShellClass}>
        <header className="ind-header-center">
          <h2 className="ind-h2">{model.heading}</h2>
        </header>
        <ol className="ind-impl">
          {model.steps.map((step, idx) => (
            <li key={step.title} className="ind-impl__step">
              <article className="ind-impl__card">
                <span className="ind-impl__num">{idx + 1}</span>
                <span className="ind-impl__icon">
                  <StepIcon title={step.title} hint={step.icon} />
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
              {idx < model.steps.length - 1 ? <span className="ind-impl__arrow" aria-hidden /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
