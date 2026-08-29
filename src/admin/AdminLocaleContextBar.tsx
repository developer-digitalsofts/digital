import { useAdminLocale } from './AdminLocaleContext'
import { TRANSLATION_STATUS_LABELS, type LocaleCountrySlug } from '../locale/localeConfig'

export function AdminLocaleContextBar() {
  const { countryLabel, langLabel, country, lang, setCountry, setLang, inheritanceLabel } = useAdminLocale()

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      <span className="font-semibold text-slate-700">Editing:</span>
      <label className="flex items-center gap-2">
        Country
        <select className="rounded-lg border border-slate-200 px-2 py-1" value={country} onChange={(e) => setCountry(e.target.value as LocaleCountrySlug)}>
          <option value="pk">Pakistan</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        Language
        <select className="rounded-lg border border-slate-200 px-2 py-1" value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'ar')}>
            <option value="en">English</option>
        </select>
      </label>
      <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-800 ring-1 ring-slate-200">
        {countryLabel} · {langLabel}
      </span>
      <span className="text-slate-600">{inheritanceLabel}</span>
      <span className="text-xs text-slate-500">Translation statuses: {Object.values(TRANSLATION_STATUS_LABELS).join(' · ')}</span>
    </div>
  )
}
