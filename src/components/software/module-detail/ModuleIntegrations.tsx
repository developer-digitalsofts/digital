import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ModuleIntegrationsModel } from '../../../types/moduleDetailPage'
import { resolveDetailIconName } from '../detail/detailIconMap'
import { MODULE_SECTION_IDS, moduleShellClass } from './moduleConstants'

function NodeIcon({ label, hint }: { label: string; hint?: string }) {
  const name = resolveDetailIconName(label, hint)
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Layers
  return <Cmp className="mod-integrations__icon" strokeWidth={2} aria-hidden />
}

type Props = {
  model: ModuleIntegrationsModel
}

export function ModuleIntegrations({ model }: Props) {
  return (
    <section className="mod-section mod-section--muted" id={MODULE_SECTION_IDS.integrations}>
      <div className={moduleShellClass}>
        <header className="mod-header-center">
          <h2 className="mod-h2">{model.heading}</h2>
        </header>
        <div className="mod-integrations">
          <div className="mod-integrations__center">
            <span className="mod-integrations__hub">{model.centerLabel}</span>
          </div>
          <ul className="mod-integrations__nodes">
            {model.nodes.map((node) => (
              <li key={node.label} className="mod-integrations__node">
                <span className="mod-integrations__node-icon">
                  <NodeIcon label={node.label} hint={node.icon} />
                </span>
                <span>{node.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
