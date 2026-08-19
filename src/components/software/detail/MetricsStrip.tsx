import { DetailIcon } from './DetailIcon'
import type { DetailMetricModel } from '../../../types/detailPageSections'
import { detailShellClass } from './detailConstants'

type Props = {
  metrics: DetailMetricModel[]
}

export function MetricsStrip({ metrics }: Props) {
  if (metrics.length === 0) return null

  return (
    <div className="accounts-proto-trust">
      <div className={detailShellClass}>
        <ul className="accounts-proto-trust__row">
          {metrics.map((stat) => (
            <li key={stat.label} className="accounts-proto-trust__item">
              {stat.icon ? (
                <DetailIcon label={stat.label} iconHint={stat.icon} className="mx-auto" />
              ) : null}
              <p className="accounts-proto-trust__value">{stat.value}</p>
              <p className="accounts-proto-trust__label">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
