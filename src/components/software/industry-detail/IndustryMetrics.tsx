import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { DetailMetricModel } from '../../../types/detailPageSections'
import { industryShellClass } from './industryConstants'

function MetricIcon({ name }: { name?: string }) {
  const Cmp = (Icons as unknown as Record<string, LucideIcon | undefined>)[name ?? ''] ?? Icons.Award
  return <Cmp className="ind-metrics__icon" strokeWidth={2} aria-hidden />
}

type Props = { metrics: DetailMetricModel[] }

export function IndustryMetrics({ metrics }: Props) {
  if (!metrics.length) return null
  return (
    <section className="ind-metrics" aria-label="Industry metrics">
      <div className={industryShellClass}>
        <ul className="ind-metrics__row">
          {metrics.map((m) => (
            <li key={`${m.label}-${m.value}`} className="ind-metrics__item">
              <MetricIcon name={m.icon} />
              <div>
                <p className="ind-metrics__value">{m.value}</p>
                <p className="ind-metrics__label">{m.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
