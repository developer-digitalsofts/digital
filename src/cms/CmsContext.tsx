import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchHomepage, apiUrl } from './api'
import { normalizeHomepagePayload, unknownHomeSectionIds, type NormalizedHomepagePayload } from './normalizeHomepage'
import type { HomepagePayload } from './types'
import { parseLocalePath } from '../locale/localePaths'
import { countrySlugToCode } from '../locale/localeConfig'

type CmsState = {
  data: NormalizedHomepagePayload | null
  loading: boolean
  error: string | null
  reload: (opts?: { bustCache?: boolean }) => void
  localeMeta: {
    countryCode: string
    lang: string
    fallbackUsed: boolean
    noIndex: boolean
  } | null
}

const CmsContext = createContext<CmsState | null>(null)

export function CmsProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const parsed = useMemo(() => parseLocalePath(location.pathname), [location.pathname])
  const countryCode = countrySlugToCode(parsed.country)
  const lang = parsed.lang

  const [data, setData] = useState<NormalizedHomepagePayload | null>(null)
  const [localeMeta, setLocaleMeta] = useState<CmsState['localeMeta']>(null)
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

    fetchHomepage<HomepagePayload & { meta?: NormalizedHomepagePayload['meta'] & { locale?: Record<string, unknown> } }>({
      bustCache: bust,
      countryCode,
      lang,
    })
      .then((payload) => {
        if (cancelled) return
        const normalized = normalizeHomepagePayload(payload)
        const locale = payload.meta?.locale
        setLocaleMeta(
          locale && typeof locale === 'object'
            ? {
                countryCode: String(locale.countryCode || countryCode),
                lang: String(locale.lang || lang),
                fallbackUsed: locale.fallbackUsed === true,
                noIndex: locale.noIndex === true,
              }
            : {
                countryCode,
                lang,
                fallbackUsed: countryCode !== 'PK',
                noIndex: countryCode !== 'PK',
              },
        )

        if (import.meta.env.DEV) {
          console.log('PUBLIC_PAGE_ENDPOINT', apiUrl(`/api/homepage${bust ? `?v=${Date.now()}` : ''}`))
          console.log('PUBLIC_PAGE_RESPONSE', payload)
          console.log('NORMALIZED_PAGE_DATA', normalized)
          if (locale?.fallbackUsed === true) {
            console.info(
              `[cms] Locale fallback active for ${String(locale.countryCode || countryCode)}/${String(locale.lang || lang)} — public site shows Pakistan baseline.`,
            )
          }
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
  }, [tick, countryCode, lang])

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
    () => ({ data, loading, error, reload, localeMeta }),
    [data, loading, error, reload, localeMeta],
  )

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
