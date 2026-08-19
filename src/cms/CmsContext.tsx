import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { fetchHomepage, apiUrl } from './api'
import { normalizeHomepagePayload, unknownHomeSectionIds, type NormalizedHomepagePayload } from './normalizeHomepage'
import type { HomepagePayload } from './types'

type CmsState = {
  data: NormalizedHomepagePayload | null
  loading: boolean
  error: string | null
  reload: (opts?: { bustCache?: boolean }) => void
}

const CmsContext = createContext<CmsState | null>(null)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<NormalizedHomepagePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const bustCacheRef = useRef(false)

  const reload = useCallback((opts?: { bustCache?: boolean }) => {
    if (opts?.bustCache) bustCacheRef.current = true
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const bust = bustCacheRef.current
    bustCacheRef.current = false

    fetchHomepage<HomepagePayload & { meta?: NormalizedHomepagePayload['meta'] }>({ bustCache: bust })
      .then((payload) => {
        if (cancelled) return
        const normalized = normalizeHomepagePayload(payload)

        if (import.meta.env.DEV) {
          console.log('PUBLIC_PAGE_ENDPOINT', apiUrl(`/api/homepage${bust ? `?v=${Date.now()}` : ''}`))
          console.log('PUBLIC_PAGE_RESPONSE', payload)
          console.log('NORMALIZED_PAGE_DATA', normalized)
        }

        setData(normalized)

        if (import.meta.env.DEV) {
          const unknown = unknownHomeSectionIds(normalized.pageSections?.sections ?? [])
          if (unknown.length) {
            console.warn('[cms] Unknown homepage section ids in published payload:', unknown)
          }
          console.debug('[cms] homepage loaded', {
            publishedAt: normalized.meta.publishedAt,
            schemaVersion: normalized.meta.schemaVersion,
          })
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const message = e instanceof Error ? e.message : 'Failed to load site content'
        setError(message)
        if (import.meta.env.DEV) {
          console.error('[cms] homepage fetch failed — sections may show i18n fallbacks', message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [tick])

  // Refetch when the tab becomes visible again (e.g. after publishing in admin).
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState !== 'visible') return
      reload({ bustCache: true })
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
