import { useI18n } from '../../../i18n/I18nProvider'
import { DetailIcon } from './DetailIcon'
import type { DetailImplementationModel } from '../../../types/detailPageSections'
import { detailShellClass } from './detailConstants'

type Props = {
  model: DetailImplementationModel
}

export function ImplementationSteps({ model }: Props) {
  const { t } = useI18n()

  return (
    <section className="accounts-proto__section accounts-proto__section--muted">
      <div className={detailShellClass}>
        <header className="accounts-proto__header-center">
          <h2 className="accounts-proto__h2">{model.heading}</h2>
          {model.lead ? <p className="accounts-proto__lead">{model.lead}</p> : null}
        </header>
        <ol className="accounts-proto-impl__steps">
          {model.steps.map((step, idx) => (
            <li key={step.title} className="accounts-proto-impl__step">
              <DetailIcon label={step.title} iconHint={step.icon} className="mb-4" />
              <p className="accounts-proto-impl__step-num">
                {t('softwareDetail.stepLabel')} {idx + 1}
              </p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
