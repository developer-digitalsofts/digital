import { useCallback, useEffect, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from '../adminApi'

export type PublishStatus = {
  status: string
  lastSavedAt: string | null
  lastPublishedAt: string | null
  hasUnpublishedChanges: boolean
  hasPublished: boolean
}

export function useAdminSection<T extends Record<string, unknown>>(section: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [publishStatus, setPublishStatus] = useState<PublishStatus | null>(null)

  const reloadStatus = useCallback(() => {
    adminFetch<PublishStatus>(`/api/admin/publish-status/${section}`)
      .then(setPublishStatus)
      .catch(() => setPublishStatus(null))
  }, [section])

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    adminFetch<T>(`/api/admin/data/${section}`)
      .then((d) => setData(d))
      .catch((e: Error) => setError(friendlyAdminApiMessage(e.message)))
      .finally(() => setLoading(false))
    reloadStatus()
  }, [section, reloadStatus])

  useEffect(() => {
    reload()
  }, [reload])

  const save = useCallback(
    async (payload: T) => {
      setSaving(true)
      setError(null)
      try {
        const res = await adminFetch<{ ok: boolean; publishStatus?: PublishStatus }>(`/api/admin/data/${section}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        if (res.publishStatus) setPublishStatus(res.publishStatus)
        await adminFetch<T>(`/api/admin/data/${section}`).then((d) => setData(d))
        reloadStatus()
      } catch (e: unknown) {
        const msg = e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed'
        setError(msg)
        throw e
      } finally {
        setSaving(false)
      }
    },
    [section, reloadStatus],
  )

  const publish = useCallback(async () => {
    setPublishing(true)
    setError(null)
    try {
      const res = await adminFetch<{ ok: boolean; publishStatus?: PublishStatus }>(`/api/admin/publish/${section}`, {
        method: 'POST',
        body: JSON.stringify({}),
      })
      if (res.publishStatus) setPublishStatus(res.publishStatus)
      else reloadStatus()
    } catch (e: unknown) {
      const msg = e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Publish failed'
      setError(msg)
      throw e
    } finally {
      setPublishing(false)
    }
  }, [section, reloadStatus])

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
  }
}
