import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { IndustryWorkflowModel } from '../../../types/industryDetailPage'
import { resolveDetailIconName } from '../detail/detailIconMap'
import { industryShellClass } from './industryConstants'

function StepIcon({ label, hint }: { label: string; hint?: string }) {
  const name = resolveDetailIconName(label, hint)
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Circle
  return <Cmp className="ind-workflow__glyph" strokeWidth={2} aria-hidden />
}

type Props = { model: IndustryWorkflowModel }

export function IndustryWorkflow({ model }: Props) {
  if (model.steps.length < 2) return null
  return (
    <section className="ind-section ind-section--muted">
      <div className={industryShellClass}>
        <header className="ind-header-center">
          <h2 className="ind-h2">{model.heading}</h2>
        </header>
        <ol className="ind-workflow">
          {model.steps.map((step, idx) => (
            <li key={step.label} className="ind-workflow__step">
              <article className="ind-workflow__card">
                <span className="ind-workflow__num">{idx + 1}</span>
                <span className="ind-workflow__icon">
                  <StepIcon label={step.label} hint={step.icon} />
                </span>
                <h3 className="ind-workflow__label">{step.label}</h3>
                <p className="ind-workflow__desc">{step.description}</p>
              </article>
              {idx < model.steps.length - 1 ? <span className="ind-workflow__line" aria-hidden /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
