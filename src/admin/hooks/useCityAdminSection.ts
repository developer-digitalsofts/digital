import { useCallback, useEffect, useRef, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from '../adminApi'
import { useAdminLocale } from '../AdminLocaleContext'
import { useAdminCity } from '../AdminCityContext'
import { countrySlugToCode } from '../../locale/localeConfig'
import { ADMIN_SECTION_LOCALE, CITY_ADMIN_SECTIONS } from '../adminLocaleSections'
import type { PublishStatus } from './useAdminSection'

type ResolveResponse = {
  record: { id: string; payload?: Record<string, unknown>; seo?: Record<string, unknown>; inheritanceMode?: string } | null
  payload?: Record<string, unknown>
  publicView?: Record<string, unknown>
  meta?: { inherited?: boolean; customized?: boolean }
}

function sectionRef(section: string) {
  return CITY_ADMIN_SECTIONS[section] || ADMIN_SECTION_LOCALE[section]
}

function docFromResolve(section: string, res: ResolveResponse): Record<string, unknown> {
  if (section === 'seo' && res.record?.seo) {
    return res.record.seo as Record<string, unknown>
  }
  if (res.record?.payload && Object.keys(res.record.payload).length > 0) {
    const payload = { ...(res.record.payload as Record<string, unknown>) }
    delete payload._seedVersion
    delete payload._seedAt
    delete payload._citySlug
    delete payload._sectionKey
    return payload
  }
  return (res.payload || res.publicView || {}) as Record<string, unknown>
}

export function useCityAdminSection<T extends Record<string, unknown>>(section: string) {
  const { citySlug } = useAdminCity()
  const { country, lang, setDirty } = useAdminLocale()
  const localeRef = sectionRef(section)
  const countryCode = countrySlugToCode(country)

  const [data, setDataState] = useState<T | null>(null)
  const [recordId, setRecordId] = useState<string | null>(null)
  const [inherited, setInherited] = useState(true)
  const baselineRef = useRef('')

  const setData = useCallback(
    (next: T | null | ((prev: T | null) => T | null)) => {
      setDataState((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T | null) => T | null)(prev) : next
        if (resolved && baselineRef.current) {
          setDirty(JSON.stringify(resolved) !== baselineRef.current)
        }
        return resolved
      })
    },
    [setDirty],
  )

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [publishStatus, setPublishStatus] = useState<PublishStatus | null>(null)

  const reloadStatus = useCallback(async () => {
    if (!recordId) {
      setPublishStatus(null)
      return
    }
    try {
      const rec = await adminFetch<{ records: { id: string; publicationStatus?: string; updatedAt?: string; publishedAt?: string | null }[] }>(
        `/api/admin/locale/records?country=${countryCode}&lang=${lang}&contentType=${localeRef?.contentType || 'pageSection'}`,
      )
      const row = rec.records.find((r) => r.id === recordId)
      setPublishStatus({
        status: row?.publicationStatus || 'draft',
        lastSavedAt: row?.updatedAt || null,
        lastPublishedAt: row?.publishedAt || null,
        hasUnpublishedChanges: row?.publicationStatus !== 'published',
        hasPublished: row?.publicationStatus === 'published',
      })
    } catch {
      setPublishStatus(null)
    }
  }, [recordId, countryCode, lang, localeRef?.contentType])

  const reload = useCallback(() => {
    if (!localeRef || !citySlug) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({
      country: countryCode,
      lang,
      contentType: localeRef.contentType,
      globalIdentity: localeRef.globalIdentity,
      citySlug,
    })
    if (localeRef.slug) params.set('slug', localeRef.slug)

    adminFetch<ResolveResponse>(`/api/admin/locale/resolve?${params}`)
      .then((res) => {
        const doc = docFromResolve(section, res) as T
        setRecordId(res.record?.id || null)
        setInherited(res.record?.inheritanceMode !== 'override' && !res.meta?.customized)
        setDataState(doc)
        baselineRef.current = JSON.stringify(doc)
        setDirty(false)
      })
      .catch((e: Error) => setError(friendlyAdminApiMessage(e.message)))
      .finally(() => {
        setLoading(false)
        void reloadStatus()
      })
  }, [citySlug, countryCode, lang, localeRef, reloadStatus, section, setDirty])

  useEffect(() => {
    reload()
  }, [reload])

  const ensureRecord = useCallback(async () => {
    if (recordId) return recordId
    if (!localeRef || !citySlug) throw new Error('City not selected')
    const res = await adminFetch<{ record: { id: string } }>('/api/admin/locale/actions/customize', {
      method: 'POST',
      body: JSON.stringify({
        contentType: localeRef.contentType,
        globalIdentity: localeRef.globalIdentity,
        countryCode,
        lang,
        slug: localeRef.slug,
        citySlug,
      }),
    })
    setRecordId(res.record.id)
    setInherited(false)
    return res.record.id
  }, [recordId, localeRef, countryCode, lang, citySlug])

  const save = useCallback(
    async (payload: T) => {
      setSaving(true)
      setError(null)
      try {
        const id = await ensureRecord()
        const body: Record<string, unknown> = {
          inheritanceMode: 'override',
          translationStatus: 'draft',
          customized: true,
          citySlug,
        }
        if (section === 'seo') body.seo = payload
        else body.payload = payload
        await adminFetch(`/api/admin/locale/records/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        setDataState(payload)
        baselineRef.current = JSON.stringify(payload)
        setDirty(false)
        setInherited(false)
        await reloadStatus()
      } catch (e: unknown) {
        const msg = e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed'
        setError(msg)
        throw e
      } finally {
        setSaving(false)
      }
    },
    [ensureRecord, reloadStatus, section, setDirty, citySlug],
  )

  const publish = useCallback(async () => {
    setPublishing(true)
    setError(null)
    try {
      const id = await ensureRecord()
      await adminFetch(`/api/admin/locale/records/${id}/translation-status`, {
        method: 'POST',
        body: JSON.stringify({ status: 'approved' }),
      })
      await adminFetch(`/api/admin/locale/records/${id}/publish`, { method: 'POST' })
      await adminFetch('/api/admin/locale/publish-store', { method: 'POST', body: '{}' })
      await reloadStatus()
    } catch (e: unknown) {
      const msg = e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Publish failed'
      setError(msg)
      throw e
    } finally {
      setPublishing(false)
    }
  }, [ensureRecord, reloadStatus])

  const usePkDefault = useCallback(async () => {
    if (!localeRef || !citySlug) return
    await adminFetch('/api/admin/locale/actions/use-pk-default', {
      method: 'POST',
      body: JSON.stringify({
        contentType: localeRef.contentType,
        globalIdentity: localeRef.globalIdentity,
        countryCode,
        lang,
        slug: localeRef.slug,
        citySlug,
      }),
    })
    await reload()
  }, [citySlug, countryCode, lang, localeRef, reload])

  return {
    data,
    setData,
    loading,
    saving,
    publishing,
    error,
    setError,
    reload,
    save,
    publish,
    publishStatus,
    isLocaleMode: true,
    isCityMode: true,
    recordId,
    inherited,
    usePkDefault,
    citySlug,
  }
}
