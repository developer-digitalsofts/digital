import { useState } from 'react'
import type { DetailCapabilitiesModel } from '../../../types/detailPageSections'
import { DetailIcon } from '../detail/DetailIcon'
import { MODULE_SECTION_IDS, moduleShellClass } from './moduleConstants'

type Props = {
  model: DetailCapabilitiesModel
}

export function ModuleTransactionTabs({ model }: Props) {
  const [tab, setTab] = useState(model.tabs[0]?.id ?? 'transactions')
  const active = model.tabs.find((t) => t.id === tab) ?? model.tabs[0]
  if (!active) return null

  const sectionId = /report/i.test(active.label)
    ? MODULE_SECTION_IDS.reports
    : MODULE_SECTION_IDS.transactions

  return (
    <section className="mod-section" id={sectionId}>
      <div className={moduleShellClass}>
        <header className="mod-header-center">
          <h2 className="mod-h2">{model.heading}</h2>
          {model.lead ? <p className="mod-lead">{model.lead}</p> : null}
        </header>

        <div className="mod-tabs">
          <div className="mod-tabs__bar" role="tablist" aria-label="Transactions and reports">
            {model.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={`mod-tabs__btn ${tab === t.id ? 'is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mod-tabs__panel" role="tabpanel">
            <h3 className="mod-tabs__panel-title">{active.heading}</h3>
            {active.items && active.items.length > 0 ? (
              <ul className="mod-tabs__grid">
                {active.items.map((item) => (
                  <li key={item.name} className="mod-tabs__tile">
                    <DetailIcon label={item.name} iconHint={item.description} className="mod-tabs__tile-icon" />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
