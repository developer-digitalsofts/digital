import { useCallback, useEffect, useState } from 'react'
import { adminFetch } from './adminApi'
import { useAdminLocale } from './AdminLocaleContext'
import { countrySlugToCode } from '../locale/localeConfig'
import type { LocaleContentRecord, LocaleResolutionMeta } from '../types/localeContent'

type ResolveResponse = {
  record: LocaleContentRecord | null
  meta: LocaleResolutionMeta
  publicView?: unknown
}

type Snapshot = {
  key: string
  data: ResolveResponse | null
  error: string | null
}

export function useAdminLocaleRecord(contentType: string, globalIdentity: string, slug?: string) {
  const { country, lang } = useAdminLocale()
  const [fetchGen, setFetchGen] = useState(0)
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)

  const queryKey = `${country}:${lang}:${contentType}:${globalIdentity}:${slug ?? ''}:${fetchGen}`

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({
      country: countrySlugToCode(country),
      lang,
      contentType,
      globalIdentity,
    })
    if (slug) params.set('slug', slug)

    void (async () => {
      try {
        const res = await adminFetch<ResolveResponse>(`/api/admin/locale/resolve?${params}`)
        if (!cancelled) setSnapshot({ key: queryKey, data: res, error: null })
      } catch (e) {
        if (!cancelled) {
          setSnapshot({
            key: queryKey,
            data: null,
            error: e instanceof Error ? e.message : 'Failed to load locale record',
          })
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [queryKey, country, lang, contentType, globalIdentity, slug])

  const reload = useCallback(() => setFetchGen((g) => g + 1), [])

  const loading = !snapshot || snapshot.key !== queryKey
  const data = snapshot?.key === queryKey ? snapshot.data : null
  const error = snapshot?.key === queryKey ? snapshot.error : null

  const exactRecord = data?.record
  const meta = data?.meta
  const isDefault = country === 'ae' && lang === 'en'
  const customized = exactRecord?.inheritanceMode === 'override' || meta?.customized
  const inherited = !customized && !isDefault && (meta?.inherited || exactRecord?.inheritanceMode === 'inherit')
  const status = exactRecord?.translationStatus || meta?.translationStatus || (isDefault ? 'published' : 'missing')

  return {
    loading,
    error,
    reload,
    record: exactRecord,
    meta,
    isDefault,
    customized,
    inherited,
    status,
    recordId: exactRecord?.id,
  }
}
