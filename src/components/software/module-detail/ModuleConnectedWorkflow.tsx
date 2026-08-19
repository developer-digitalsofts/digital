import type { ModuleWorkflowModel } from '../../../types/moduleDetailPage'
import { MODULE_SECTION_IDS, moduleShellClass } from './moduleConstants'

type Props = {
  model: ModuleWorkflowModel
}

export function ModuleConnectedWorkflow({ model }: Props) {
  if (model.steps.length < 2) return null

  return (
    <section className="mod-section mod-section--muted" id={MODULE_SECTION_IDS.workflow}>
      <div className={moduleShellClass}>
        <header className="mod-header-center">
          <h2 className="mod-h2">{model.heading}</h2>
        </header>
        <ol className="mod-workflow">
          {model.steps.map((step, idx) => (
            <li key={step.label} className="mod-workflow__step">
              <article className="mod-workflow__card">
                <span className="mod-workflow__num">{idx + 1}</span>
                <h3 className="mod-workflow__label">{step.label}</h3>
                <p className="mod-workflow__desc">{step.description}</p>
              </article>
              {idx < model.steps.length - 1 ? (
                <span className="mod-workflow__line" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
