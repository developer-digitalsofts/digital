import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HOME_SECTION_REGISTRY } from '../cms/homeSectionRegistry'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { MARKET_CODE } from '../market/pakistanConfig'

type SectionRow = { id: string; name?: string; visible?: boolean; sortOrder?: number }

type CityRow = {
  slug: string
  countryCode: string
  name: { en: string; ar?: string }
  recordId: string | null
  previewPath: string
  heading?: string
  intro?: string
  title?: string
  description?: string
  eyebrow?: string
  dashboardCities?: string
  dashboardCompanies?: string
  extraFaqQ?: string
  extraFaqA?: string
  pageSections?: SectionRow[]
  draft: { publicationStatus: string; translationStatus: string; enabled: boolean; updatedAt?: string } | null
  published: { publicationStatus: string; translationStatus: string; enabled: boolean; publishedAt?: string } | null
}

export function AdminCitiesPage() {
  const toast = useAdminToast()
  const countryCode = MARKET_CODE
  const [cities, setCities] = useState<CityRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [heading, setHeading] = useState('')
  const [intro, setIntro] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eyebrow, setEyebrow] = useState('')
  const [dashboardCities, setDashboardCities] = useState('')
  const [dashboardCompanies, setDashboardCompanies] = useState('')
  const [extraFaqQ, setExtraFaqQ] = useState('')
  const [extraFaqA, setExtraFaqA] = useState('')
  const [sectionVis, setSectionVis] = useState<Record<string, boolean>>({})

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
      await adminFetch(`/api/admin/locale/cities/${citySlug}/seed`, {
        method: 'POST',
        body: JSON.stringify({ pageSlug: 'home' }),
      })
      toast.push(`Draft homepage seeded for ${citySlug}`, 'success')
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

  const saveEdits = async (citySlug: string) => {
    try {
      await adminFetch(`/api/admin/locale/cities/${citySlug}`, {
        method: 'PUT',
        body: JSON.stringify({
          pageSlug: 'home',
          heading,
          intro,
          title,
          description,
          eyebrow,
          dashboardCities,
          dashboardCompanies,
          extraFaqQ,
          extraFaqA,
          pageSections: HOME_SECTION_REGISTRY.map((def, index) => ({
            id: def.id,
            name: def.label,
            visible: sectionVis[def.id] !== false,
            sortOrder: def.defaultSortOrder ?? index + 1,
          })),
        }),
      })
      toast.push('City homepage saved', 'success')
      setEditing(null)
      await load()
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Save failed', 'error')
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
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Manage individual Pakistan city websites. Unspecified fields inherit the main Pakistan website.
        </p>
      </div>

      <p className="text-sm text-slate-600">
        {summary.published} of {summary.total} city homepages published
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
                <tr key={city.slug} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 font-medium">{city.name.en}</td>
                  <td className="px-4 py-3 font-mono text-xs">/{city.slug}</td>
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
                          <button
                            type="button"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                            onClick={() => {
                              setEditing(city.slug)
                              setHeading(city.heading || '')
                              setIntro(city.intro || '')
                              setTitle(city.title || '')
                              setDescription(city.description || '')
                              setEyebrow(city.eyebrow || '')
                              setDashboardCities(city.dashboardCities || '')
                              setDashboardCompanies(city.dashboardCompanies || '')
                              setExtraFaqQ(city.extraFaqQ || '')
                              setExtraFaqA(city.extraFaqA || '')
                              const vis: Record<string, boolean> = {}
                              for (const def of HOME_SECTION_REGISTRY) vis[def.id] = true
                              for (const row of city.pageSections || []) {
                                if (row.id) vis[row.id] = row.visible !== false
                              }
                              setSectionVis(vis)
                            }}
                          >
                            Edit
                          </button>
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
                    {editing === city.slug ? (
                      <div className="mt-3 space-y-2 rounded-lg border border-slate-200 p-3">
                        <input className="w-full rounded border border-slate-200 px-2 py-1" placeholder="SEO title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Hero eyebrow" value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
                        <input className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Hero H1" value={heading} onChange={(e) => setHeading(e.target.value)} />
                        <textarea className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Hero description" value={intro} onChange={(e) => setIntro(e.target.value)} />
                        <textarea className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Meta description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <input className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Dashboard branches (comma-separated)" value={dashboardCities} onChange={(e) => setDashboardCities(e.target.value)} />
                        <input className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Dashboard sample labels (comma-separated)" value={dashboardCompanies} onChange={(e) => setDashboardCompanies(e.target.value)} />
                        <input className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Extra FAQ question" value={extraFaqQ} onChange={(e) => setExtraFaqQ(e.target.value)} />
                        <textarea className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Extra FAQ answer" value={extraFaqA} onChange={(e) => setExtraFaqA(e.target.value)} />
                        <fieldset className="rounded border border-slate-200 p-2">
                          <legend className="px-1 text-xs font-semibold text-slate-600">Homepage sections (blank inherits Pakistan defaults)</legend>
                          <div className="grid gap-1 sm:grid-cols-2">
                            {HOME_SECTION_REGISTRY.map((def) => (
                              <label key={def.id} className="flex items-center gap-2 text-xs">
                                <input
                                  type="checkbox"
                                  checked={sectionVis[def.id] !== false}
                                  onChange={(e) => setSectionVis((prev) => ({ ...prev, [def.id]: e.target.checked }))}
                                />
                                {def.label}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <div className="flex gap-2">
                          <button type="button" className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white" onClick={() => void saveEdits(city.slug)}>
                            Save
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
