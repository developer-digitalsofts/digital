import { ChevronDown } from 'lucide-react'
import { LOCALE_COUNTRY_SLUGS, type LocaleCountrySlug, type LocaleLang } from '../locale/localeConfig'
import { useLocale, useCountryFlag } from '../locale/LocaleContext'
import { codeToCountrySlug } from '../locale/localeConfig'
import './locale-selector.css'

const LANG_LABELS: Record<LocaleLang, string> = { en: 'EN', ar: 'AR' }

type LocaleSelectorProps = { compact?: boolean; className?: string }

export function LocaleSelector({ compact = false, className = '' }: LocaleSelectorProps) {
  const { country, lang, countries, setLocale } = useLocale()
  const flag = useCountryFlag(countries.find((c) => codeToCountrySlug(c.code) === country)?.code ?? 'AE')

  return (
    <div className={`dm-locale-select ${compact ? 'dm-locale-select--compact' : ''} ${className}`.trim()}>
      <label className="dm-locale-select__group">
        <span className="sr-only">Country</span>
        <span className="dm-locale-select__flag" aria-hidden>
          {flag}
        </span>
        <select
          className="dm-locale-select__input"
          value={country}
          onChange={(e) => setLocale(e.target.value as LocaleCountrySlug, lang)}
          aria-label="Select country"
        >
          {LOCALE_COUNTRY_SLUGS.map((slug) => {
            const profile = countries.find((c) => codeToCountrySlug(c.code) === slug)
            return (
              <option key={slug} value={slug}>
                {profile?.shortName || slug.toUpperCase()}
              </option>
            )
          })}
        </select>
        <ChevronDown className="dm-locale-select__chevron" aria-hidden strokeWidth={2.25} />
      </label>

      <label className="dm-locale-select__group dm-locale-select__group--lang">
        <span className="sr-only">Language</span>
        <select
          className="dm-locale-select__input dm-locale-select__input--lang"
          value={lang}
          onChange={(e) => setLocale(country, e.target.value as LocaleLang)}
          aria-label="Select language"
        >
          <option value="en">{LANG_LABELS.en}</option>
          <option value="ar">{LANG_LABELS.ar}</option>
        </select>
        <ChevronDown className="dm-locale-select__chevron" aria-hidden strokeWidth={2.25} />
      </label>
    </div>
  )
}
