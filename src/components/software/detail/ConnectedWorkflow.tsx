import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DetailWorkflowStepModel } from '../../../types/detailPageSections'
import { resolveDetailIconName } from './detailIconMap'
import { detailShellClass } from './detailConstants'

function StepIcon({ label, hint }: { label: string; hint?: string }) {
  const name = resolveDetailIconName(label, hint)
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Sparkles
  return <Cmp className="accounts-proto-workflow__glyph" strokeWidth={2} aria-hidden />
}

type Props = {
  heading: string
  steps: DetailWorkflowStepModel[]
}

export function ConnectedWorkflow({ heading, steps }: Props) {
  if (steps.length < 2) return null

  return (
    <section className="accounts-proto__section accounts-proto__section--muted accounts-proto__section--workflow">
      <div className={detailShellClass}>
        <header className="accounts-proto__header-center accounts-proto-workflow__header">
          <h2 className="accounts-proto__h2">{heading}</h2>
        </header>
        <ol className="accounts-proto-workflow">
          {steps.map((step, idx) => (
            <li key={step.label} className="accounts-proto-workflow__step">
              <article className="accounts-proto-workflow__card">
                <span className="accounts-proto-workflow__icon">
                  <StepIcon label={step.label} hint={step.icon} />
                </span>
                <h3 className="accounts-proto-workflow__label">{step.label}</h3>
                {step.description ? (
                  <p className="accounts-proto-workflow__desc">{step.description}</p>
                ) : null}
              </article>
              {idx < steps.length - 1 ? (
                <span className="accounts-proto-workflow__connector" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" className="accounts-proto-workflow__arrow">
                    <path
                      d="M5 12h12m0 0-4-4m4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
