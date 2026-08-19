import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DetailMetricModel } from '../../../types/detailPageSections'
import { moduleShellClass } from './moduleConstants'

function MetricIcon({ name }: { name?: string }) {
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name ?? ''] ?? Icons.Award
  return <Cmp className="mod-trust__icon" strokeWidth={2} aria-hidden />
}

type Props = {
  metrics: DetailMetricModel[]
}

export function ModuleTrustMetrics({ metrics }: Props) {
  if (!metrics.length) return null

  return (
    <section className="mod-trust" aria-label="Trust metrics">
      <div className={moduleShellClass}>
        <ul className="mod-trust__row">
          {metrics.map((m) => (
            <li key={`${m.label}-${m.value}`} className="mod-trust__item">
              <MetricIcon name={m.icon} />
              <div>
                <p className="mod-trust__value">{m.value}</p>
                <p className="mod-trust__label">{m.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
