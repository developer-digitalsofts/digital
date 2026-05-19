import { formatStatCount, parseStatValue, useCountUp } from '../hooks/useCountUp'
import { useInViewOnce } from '../hooks/useInViewOnce'

export function StatValue({ value }: { value: string }) {
  const { ref, visible } = useInViewOnce<HTMLParagraphElement>()
  const parsed = parseStatValue(value)

  const count = useCountUp(parsed?.target ?? 0, visible && parsed != null)

  if (!parsed) {
    return (
      <p ref={ref} className="font-heading text-3xl font-bold tabular-nums tracking-tight text-brand sm:text-[2.5rem]">
        {value}
      </p>
    )
  }

  return (
    <p ref={ref} className="font-heading text-3xl font-bold tabular-nums tracking-tight text-brand sm:text-[2.5rem]">
      {formatStatCount(count, parsed)}
    </p>
  )
}
