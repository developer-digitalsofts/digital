import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { fetchHomepage } from './api'
import type { HomepagePayload } from './types'

type CmsState = {
  data: HomepagePayload | null
  loading: boolean
  error: string | null
  reload: () => void
}

const CmsContext = createContext<CmsState | null>(null)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HomepagePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const lastFetchAt = useRef(0)

  const reload = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchHomepage<HomepagePayload>()
      .then((payload) => {
        if (!cancelled) {
          setData(payload)
          lastFetchAt.current = Date.now()
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load site content')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  // Refetch when tab visible — debounced to avoid hammering API
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastFetchAt.current < 30_000) return
      reload()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [reload])

  const value = useMemo(
    () => ({ data, loading, error, reload }),
    [data, loading, error, reload],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
