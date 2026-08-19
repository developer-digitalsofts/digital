import { useState } from 'react'
import type { DetailCapabilitiesModel } from '../../../types/detailPageSections'
import { DetailIcon } from './DetailIcon'
import { detailShellClass } from './detailConstants'

type Props = {
  model: DetailCapabilitiesModel
}

export function DetailCapabilitiesTabs({ model }: Props) {
  const [tab, setTab] = useState(model.tabs[0]?.id ?? 'problems')
  const active = model.tabs.find((t) => t.id === tab) ?? model.tabs[0]

  if (!active) return null

  return (
    <section className="accounts-proto__section accounts-proto__section--tabs">
      <div className={detailShellClass}>
        <header className="accounts-proto__header-center">
          <h2 className="accounts-proto__h2">{model.heading}</h2>
          {model.lead ? <p className="accounts-proto__lead">{model.lead}</p> : null}
        </header>

        <div className="accounts-proto-tabs">
          <div className="accounts-proto-tabs__bar" role="tablist" aria-label="Capabilities">
            {model.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`accounts-proto-tabs__btn ${tab === t.id ? 'accounts-proto-tabs__btn--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="accounts-proto-tabs__panel" role="tabpanel">
            <h3>{active.heading}</h3>
            {active.intro ? <p>{active.intro}</p> : null}
            {active.listLead ? <p className="accounts-proto-tabs__lead-em">{active.listLead}</p> : null}

            {active.bullets && active.bullets.length > 0 ? (
              <ul className="accounts-proto-tabs__bullets">
                {active.bullets.map((item) => (
                  <li key={item}>
                    <DetailIcon label={item} size="sm" className="mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {active.items && active.items.length > 0 ? (
              <ul className="accounts-proto-tabs__txn-grid">
                {active.items.map((item) => (
                  <li key={item.name} className="accounts-proto-tabs__txn">
                    <DetailIcon label={item.name} iconHint={item.description} size="sm" className="shrink-0" />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {model.solutionHeading && model.solutionParagraphs && model.solutionParagraphs.length > 0 ? (
          <div className="accounts-proto-solution">
            <p className="accounts-proto-solution__label">Solution</p>
            <h3>{model.solutionHeading}</h3>
            <div className="accounts-proto-solution__grid">
              {model.solutionParagraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
