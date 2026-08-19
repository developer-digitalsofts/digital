import { formatStatCount, parseStatValue, useCountUp } from '../hooks/useCountUp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type Props = {
  value: string
  animate: boolean
  durationMs?: number
  className?: string
}

export function TrustStatValue({ value, animate, durationMs = 1200, className = 'trust-stat-bar__value' }: Props) {
  const reducedMotion = usePrefersReducedMotion()
  const parsed = parseStatValue(value)
  const shouldAnimate = animate && !reducedMotion && parsed != null
  const count = useCountUp(parsed?.target ?? 0, shouldAnimate, durationMs)

  const display = parsed
    ? shouldAnimate
      ? formatStatCount(count, parsed)
      : formatStatCount(parsed.target, parsed)
    : value

  return (
    <p className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </p>
  )
}
