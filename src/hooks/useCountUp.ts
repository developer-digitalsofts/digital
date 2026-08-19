import { useEffect, useState } from 'react'

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

/** Parses display stat strings like "500+", "99%", "2K+" for count-up animation. */
export function parseStatValue(raw: string): { target: number; prefix: string; suffix: string } | null {
  const s = raw.trim()
  if (/^\d+\/\d+$/.test(s)) return null

  const pct = s.match(/^(\d+(?:\.\d+)?)(%)$/)
  if (pct) return { target: Number(pct[1]), prefix: '', suffix: '%' }

  const m = s.match(/^(\d+(?:\.\d+)?)([KkMm])?(\+?)$/)
  if (!m) return null
  let n = Number(m[1])
  const mult = m[2]?.toUpperCase()
  if (mult === 'K') n *= 1000
  if (mult === 'M') n *= 1_000_000
  const suffix = `${m[2] ? m[2].toUpperCase() : ''}${m[3] ?? ''}`
  return { target: n, prefix: '', suffix }
}

export function formatStatCount(n: number, parsed: { target: number; prefix: string; suffix: string }) {
  if (parsed.suffix === '%') return `${Math.round(n)}%`
  const hasK = parsed.suffix.toUpperCase().includes('K')
  const hasPlus = parsed.suffix.includes('+')
  if (hasK) {
    const k = Math.round(n / 1000)
    return `${k}K${hasPlus ? '+' : ''}`
  }
  return `${Math.round(n)}${hasPlus ? parsed.suffix.replace(/K/i, '') : parsed.suffix}`
}

export function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active || target <= 0) {
      if (active) setValue(target)
      return
    }
    setValue(0)
    let start: number | null = null
    let frame = 0

    const tick = (ts: number) => {
      if (start == null) start = ts
      const t = Math.min(1, (ts - start) / durationMs)
      setValue(target * easeOutCubic(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, durationMs])

  return value
}
