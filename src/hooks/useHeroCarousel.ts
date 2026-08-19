import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

type Options = {
  slideCount: number
  autoplayEnabled: boolean
  durationMs: number
  paused?: boolean
}

export function useHeroCarousel({ slideCount, autoplayEnabled, durationMs, paused = false }: Options) {
  const reducedMotion = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [autoplayEpoch, setAutoplayEpoch] = useState(0)
  const indexRef = useRef(index)
  const pausedRef = useRef(paused)
  indexRef.current = index
  pausedRef.current = paused

  const bumpAutoplay = useCallback(() => setAutoplayEpoch((n) => n + 1), [])

  const goTo = useCallback(
    (next: number) => {
      if (slideCount <= 0) return
      setIndex(((next % slideCount) + slideCount) % slideCount)
    },
    [slideCount],
  )

  const next = useCallback(() => {
    goTo(indexRef.current + 1)
    bumpAutoplay()
  }, [goTo, bumpAutoplay])

  const prev = useCallback(() => {
    goTo(indexRef.current - 1)
    bumpAutoplay()
  }, [goTo, bumpAutoplay])

  const select = useCallback(
    (i: number) => {
      goTo(i)
      bumpAutoplay()
    },
    [goTo, bumpAutoplay],
  )

  useEffect(() => {
    setIndex((i) => (slideCount > 0 && i >= slideCount ? 0 : i))
  }, [slideCount])

  useEffect(() => {
    if (!autoplayEnabled || slideCount <= 1) return

    let timer: ReturnType<typeof setTimeout> | null = null
    let cancelled = false

    const schedule = (delay = durationMs) => {
      if (cancelled) return
      timer = setTimeout(run, delay)
    }

    const run = () => {
      if (cancelled) return

      if (document.hidden || pausedRef.current) {
        schedule(400)
        return
      }

      setIndex((i) => (i + 1) % slideCount)
      setAutoplayEpoch((n) => n + 1)
      schedule(durationMs)
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (timer) clearTimeout(timer)
        timer = null
      } else {
        schedule(reducedMotion ? durationMs : 800)
      }
    }

    schedule(reducedMotion ? durationMs : durationMs)

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [autoplayEnabled, slideCount, durationMs, reducedMotion])

  return {
    index,
    reducedMotion,
    autoplayEpoch,
    next,
    prev,
    select,
    goTo,
  }
}

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void, threshold = 48) {
  const start = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!start.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.current.x
      const dy = t.clientY - start.current.y
      start.current = null
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return
      if (dx < 0) onSwipeLeft()
      else onSwipeRight()
    },
    [onSwipeLeft, onSwipeRight, threshold],
  )

  return { onTouchStart, onTouchEnd }
}
