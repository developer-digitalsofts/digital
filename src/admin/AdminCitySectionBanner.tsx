import { adminFetch } from './adminApi'
import { useAdminLocale } from './AdminLocaleContext'
import { useAdminCity } from './AdminCityContext'
import { countrySlugToCode } from '../locale/localeConfig'
import { CITY_ADMIN_SECTIONS } from './adminLocaleSections'
import { useCityAdminSection } from './hooks/useCityAdminSection'

type Props = {
  section: string
  compact?: boolean
}

export function AdminCitySectionBanner({ section, compact }: Props) {
  const { citySlug, cityName } = useAdminCity()
  const { country, lang } = useAdminLocale()
  const localeRef = CITY_ADMIN_SECTIONS[section]
  const countryCode = countrySlugToCode(country)
  const citySection = useCityAdminSection<Record<string, unknown>>(section)

  if (!citySlug || !localeRef) return null

  const runUsePkDefault = async () => {
    if (!window.confirm(`Reset ${section} for ${cityName} to Pakistan default?`)) return
    await citySection.usePkDefault()
  }

  const runPublish = async () => {
    await citySection.publish()
  }

  const runCustomize = async () => {
    await adminFetch('/api/admin/locale/actions/customize', {
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
    citySection.reload()
  }

  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          <span className="font-semibold text-slate-900">{cityName}</span>
          <span className="text-slate-500"> · {section}</span>
          {citySection.inherited ? (
            <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">Pakistan default</span>
          ) : (
            <span className="ml-2 rounded-full bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">City override</span>
          )}
          {citySection.publishStatus?.status ? (
            <span className="ml-2 text-xs text-slate-500">({citySection.publishStatus.status})</span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {citySection.inherited ? (
            <button type="button" className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white" onClick={() => void runCustomize()}>
              Override for this city
            </button>
          ) : (
            <button type="button" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold" onClick={() => void runUsePkDefault()}>
              Use Pakistan default
            </button>
          )}
          {!citySection.inherited ? (
            <button type="button" className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white" onClick={() => void runPublish()} disabled={citySection.publishing}>
              Publish section
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
