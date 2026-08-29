import { useCallback, useEffect, useRef, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from '../adminApi'
import { useAdminLocale } from '../AdminLocaleContext'
import { countrySlugToCode, isDefaultLocale } from '../../locale/localeConfig'
import { ADMIN_SECTION_LOCALE } from '../adminLocaleSections'
import type { PublishStatus } from './useAdminSection'

type ResolveResponse = {
  record: { id: string; payload?: Record<string, unknown> } | null
  payload?: Record<string, unknown>
  publicView?: Record<string, unknown>
}

export function useLocaleAdminSection<T extends Record<string, unknown>>(section: string) {
  const { country, lang, setDirty } = useAdminLocale()
  const localeRef = ADMIN_SECTION_LOCALE[section]
  const countryCode = countrySlugToCode(country)
  const isDefault = isDefaultLocale(country, lang)

  const [data, setDataState] = useState<T | null>(null)
  const [recordId, setRecordId] = useState<string | null>(null)
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
        `/api/admin/locale/records?country=${countryCode}&lang=${lang}&contentType=${localeRef.contentType}`,
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
    if (!localeRef || isDefault) {
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
    })
    if (localeRef.slug) params.set('slug', localeRef.slug)

    adminFetch<ResolveResponse>(`/api/admin/locale/resolve?${params}`)
      .then((res) => {
        const doc = (res.payload || res.publicView || res.record?.payload || {}) as T
        setRecordId(res.record?.id || null)
        setDataState(doc)
        baselineRef.current = JSON.stringify(doc)
        setDirty(false)
      })
      .catch((e: Error) => setError(friendlyAdminApiMessage(e.message)))
      .finally(() => {
        setLoading(false)
        void reloadStatus()
      })
  }, [countryCode, lang, isDefault, localeRef, reloadStatus, setDirty])

  useEffect(() => {
    reload()
  }, [reload])

  const ensureRecord = useCallback(async () => {
    if (recordId) return recordId
    const res = await adminFetch<{ record: { id: string } }>('/api/admin/locale/actions/customize', {
      method: 'POST',
      body: JSON.stringify({
        contentType: localeRef.contentType,
        globalIdentity: localeRef.globalIdentity,
        countryCode,
        lang,
        slug: localeRef.slug,
      }),
    })
    setRecordId(res.record.id)
    return res.record.id
  }, [recordId, localeRef, countryCode, lang])

  const save = useCallback(
    async (payload: T) => {
      setSaving(true)
      setError(null)
      try {
        const id = await ensureRecord()
        await adminFetch(`/api/admin/locale/records/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            payload,
            inheritanceMode: 'override',
            translationStatus: 'draft',
            customized: true,
          }),
        })
        setDataState(payload)
        baselineRef.current = JSON.stringify(payload)
        setDirty(false)
        await reloadStatus()
      } catch (e: unknown) {
        const msg = e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed'
        setError(msg)
        throw e
      } finally {
        setSaving(false)
      }
    },
    [ensureRecord, reloadStatus, setDirty],
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
    recordId,
  }
}
