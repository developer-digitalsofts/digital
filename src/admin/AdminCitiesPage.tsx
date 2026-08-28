import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GCC_COUNTRY_CODES } from '../config/gccCountries'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'

type CityRow = {
  slug: string
  countryCode: string
  name: { en: string; ar: string }
  recordId: string | null
  previewPath: string
  draft: { publicationStatus: string; translationStatus: string; enabled: boolean; updatedAt?: string } | null
  published: { publicationStatus: string; translationStatus: string; enabled: boolean; publishedAt?: string } | null
}

export function AdminCitiesPage() {
  const toast = useAdminToast()
  const [countryCode, setCountryCode] = useState('PK')
  const [cities, setCities] = useState<CityRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminFetch<{ cities: CityRow[] }>(`/api/admin/locale/cities?country=${countryCode}`)
      setCities(data.cities || [])
    } catch {
      toast.push('Failed to load cities', 'error')
    } finally {
      setLoading(false)
    }
  }, [countryCode, toast])

  useEffect(() => {
    void load()
  }, [load])

  const seedCity = async (citySlug: string) => {
    try {
      await adminFetch(`/api/admin/locale/cities/${citySlug}/seed`, { method: 'POST' })
      toast.push(`Draft content seeded for ${citySlug}`, 'success')
      await load()
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Seed failed', 'error')
    }
  }

  const publish = async (recordId: string) => {
    try {
      await adminFetch(`/api/admin/locale/records/${recordId}/publish`, { method: 'POST' })
      await adminFetch('/api/admin/locale/publish-store', { method: 'POST' })
      toast.push('City page published', 'success')
      await load()
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Publish failed', 'error')
    }
  }

  const unpublish = async (recordId: string) => {
    try {
      await adminFetch(`/api/admin/locale/records/${recordId}/unpublish`, { method: 'POST' })
      await adminFetch('/api/admin/locale/publish-store', { method: 'POST' })
      toast.push('City page unpublished', 'success')
      await load()
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Unpublish failed', 'error')
    }
  }

  const summary = useMemo(() => {
    const published = cities.filter((c) => c.published?.publicationStatus === 'published').length
    return { total: cities.length, published }
  }, [cities])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">City Pages</h2>
        <p className="text-sm text-slate-600">
          Manage city-level ERP landing pages (e.g. /dubai/erp-software, /sa/en/riyadh/erp-software). Seed, edit, preview, publish or disable per city.
        </p>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Country
        <select
          className="mt-1 w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          {GCC_COUNTRY_CODES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </label>

      <p className="text-sm text-slate-600">
        {summary.published} of {summary.total} cities published for {countryCode}
      </p>

      {loading ? (
        <p className="text-sm text-slate-600">Loading cities…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Draft</th>
                <th className="px-4 py-3 font-semibold">Published</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr key={city.slug} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{city.name.en}</td>
                  <td className="px-4 py-3 font-mono text-xs">{city.slug}</td>
                  <td className="px-4 py-3">{city.draft?.publicationStatus || '—'}</td>
                  <td className="px-4 py-3">{city.published?.publicationStatus || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {!city.recordId ? (
                        <button type="button" className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => void seedCity(city.slug)}>
                          Seed
                        </button>
                      ) : null}
                      {city.recordId ? (
                        <>
                          <Link to={city.previewPath} target="_blank" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold">
                            Preview
                          </Link>
                          {city.published?.publicationStatus !== 'published' ? (
                            <button type="button" className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white" onClick={() => city.recordId && void publish(city.recordId)}>
                              Publish
                            </button>
                          ) : (
                            <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700" onClick={() => city.recordId && void unpublish(city.recordId)}>
                              Unpublish
                            </button>
                          )}
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
