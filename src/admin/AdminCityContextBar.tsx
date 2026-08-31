import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useAdminCity } from './AdminCityContext'

type Props = {
  showProductLink?: boolean
}

export function AdminCityContextBar({ showProductLink = true }: Props) {
  const { citySlug, cityName, setCitySlug, cities } = useAdminCity()

  return (
    <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand">
          <MapPin className="size-4" />
          City CMS
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-slate-700">Select city (required)</span>
          <select
            className="min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2"
            value={citySlug || ''}
            onChange={(e) => setCitySlug(e.target.value || null)}
          >
            <option value="">Choose a city…</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        {citySlug ? (
          <div className="rounded-xl bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200">
            Editing: <strong className="text-slate-900">{cityName}</strong>{' '}
            <span className="font-mono text-xs text-slate-500">/{citySlug}</span>
          </div>
        ) : (
          <p className="text-sm text-amber-800">Select a city before editing. Changes apply only to that city.</p>
        )}
        {citySlug && showProductLink ? (
          <Link
            to={`/admin/content/cities/${citySlug}/products`}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Product pages
          </Link>
        ) : null}
        {citySlug ? (
          <a
            href={`/${citySlug}?preview=1`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Preview draft
          </a>
        ) : null}
      </div>
    </div>
  )
}
