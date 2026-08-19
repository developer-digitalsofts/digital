import { memo } from 'react'

type Props = {
  values: number[]
  color?: string
  className?: string
}

export const MiniSparkline = memo(function MiniSparkline({ values, color = '#f47c4d', className = '' }: Props) {
  if (values.length < 2) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 48
  const h = 16
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 2) - 1
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-4 w-12 shrink-0 ${className}`} aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  )
})
