import { useCallback, useEffect, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from '../adminApi'

export function useAdminSection<T extends Record<string, unknown>>(section: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    adminFetch<T>(`/api/admin/data/${section}`)
      .then((d) => setData(d))
      .catch((e: Error) => setError(friendlyAdminApiMessage(e.message)))
      .finally(() => setLoading(false))
  }, [section])

  useEffect(() => {
    reload()
  }, [reload])

  const save = useCallback(
    async (payload: T) => {
      setSaving(true)
      setError(null)
      try {
        await adminFetch(`/api/admin/data/${section}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        await adminFetch<T>(`/api/admin/data/${section}`).then((d) => setData(d))
      } catch (e: unknown) {
        const msg = e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed'
        setError(msg)
        throw e
      } finally {
        setSaving(false)
      }
    },
    [section],
  )

  return { data, setData, loading, saving, error, setError, reload, save }
}
