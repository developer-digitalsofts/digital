import { Link, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { AdminCityProvider, useAdminCity } from './AdminCityContext'
import { AdminCityContextBar } from './AdminCityContextBar'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { CITY_PRODUCT_PAGE_SLUGS, CITY_PRODUCT_LABELS } from '../market/pakistanConfig'

type ProductRow = {
  pageSlug: string
  label: string
  recordId: string | null
  heading: string
  draftStatus: string
  publishedStatus: string
}

function AdminCityProductsInner() {
  const { citySlug, cityName } = useAdminCity()
  const toast = useAdminToast()
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [heading, setHeading] = useState('')
  const [intro, setIntro] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const load = useCallback(async () => {
    if (!citySlug) return
    setLoading(true)
    try {
      const data = await adminFetch<{ records: { id: string; slug: string; payload?: { heading?: { en?: string } }; publicationStatus?: string }[] }>(
        `/api/admin/locale/records?country=PK&lang=en&contentType=cityPage`,
      )
      const cityRecords = (data.records || []).filter((r) => (r as { citySlug?: string }).citySlug === citySlug)
      setRows(
        CITY_PRODUCT_PAGE_SLUGS.map((pageSlug) => {
          const rec = cityRecords.find((r) => r.slug === pageSlug)
          return {
            pageSlug,
            label: CITY_PRODUCT_LABELS[pageSlug as keyof typeof CITY_PRODUCT_LABELS] || pageSlug,
            recordId: rec?.id || null,
            heading: rec?.payload?.heading?.en || '',
            draftStatus: rec?.publicationStatus || '—',
            publishedStatus: rec?.publicationStatus || '—',
          }
        }),
      )
    } catch {
      toast.push('Failed to load city product records', 'error')
    } finally {
      setLoading(false)
    }
  }, [citySlug, toast])

  useEffect(() => {
    void load()
  }, [load])

  const save = async (pageSlug: string) => {
    if (!citySlug) return
    try {
      await adminFetch(`/api/admin/locale/cities/${citySlug}/product`, {
        method: 'PUT',
        body: JSON.stringify({ pageSlug, heading, intro, title, description }),
      })
      toast.push('Product page saved', 'success')
      setEditing(null)
      await load()
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Save failed', 'error')
    }
  }

  const publish = async (recordId: string) => {
    try {
      await adminFetch(`/api/admin/locale/records/${recordId}/publish`, { method: 'POST' })
      await adminFetch('/api/admin/locale/publish-store', { method: 'POST' })
      toast.push('Product page published', 'success')
      await load()
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Publish failed', 'error')
    }
  }

  if (!citySlug) {
    return (
      <div className="space-y-6">
        <AdminCityContextBar showProductLink={false} />
        <p className="text-sm text-slate-600">Select a city to edit product/detail pages.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminCityContextBar />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">City Product Pages — {cityName}</h1>
          <p className="text-sm text-slate-600">ERP, POS and accounting detail pages for /{citySlug}/software/…</p>
        </div>
        <Link to={`/admin/content/cities/${citySlug}/home`} className="text-sm font-semibold text-brand">
          ← Back to homepage sections
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-slate-600">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Heading</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.pageSlug} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 font-medium">{row.label}</td>
                  <td className="px-4 py-3">{row.heading || '—'}</td>
                  <td className="px-4 py-3">{row.publishedStatus}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <a href={`/${citySlug}/software/${row.pageSlug}`} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-1 text-xs font-semibold">
                        Preview
                      </a>
                      <button
                        type="button"
                        className="rounded-lg border px-3 py-1 text-xs font-semibold"
                        onClick={() => {
                          setEditing(row.pageSlug)
                          setHeading(row.heading)
                          setIntro('')
                          setTitle('')
                          setDescription('')
                        }}
                      >
                        Edit
                      </button>
                      {row.recordId ? (
                        <button type="button" className="rounded-lg bg-brand px-3 py-1 text-xs font-semibold text-white" onClick={() => void publish(row.recordId!)}>
                          Publish
                        </button>
                      ) : null}
                    </div>
                    {editing === row.pageSlug ? (
                      <div className="mt-3 space-y-2 rounded-lg border p-3">
                        <input className="w-full rounded border px-2 py-1" placeholder="SEO title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input className="w-full rounded border px-2 py-1" placeholder="Hero heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
                        <textarea className="w-full rounded border px-2 py-1" placeholder="Intro" value={intro} onChange={(e) => setIntro(e.target.value)} />
                        <textarea className="w-full rounded border px-2 py-1" placeholder="Meta description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <div className="flex gap-2">
                          <button type="button" className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white" onClick={() => void save(row.pageSlug)}>
                            Save draft
                          </button>
                          <button type="button" className="rounded border px-3 py-1 text-xs" onClick={() => setEditing(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
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

export function AdminCityProductEditor() {
  const { citySlug = '' } = useParams()
  return (
    <AdminCityProvider initialCitySlug={citySlug || null} cityRequired>
      <AdminCityProductsInner />
    </AdminCityProvider>
  )
}
