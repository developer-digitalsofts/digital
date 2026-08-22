import { useLocale } from '../locale/LocaleContext'
import { GCC_COUNTRY_FLAGS } from '../locale/localeConfig'
import { codeToCountrySlug } from '../locale/localeConfig'
import '../components/locale-selector.css'

export function CountrySuggestModal() {
  const { suggestCountry, countries, dismissCountrySuggest, acceptCountrySuggest } = useLocale()
  if (!suggestCountry) return null

  const profile = countries.find((c) => codeToCountrySlug(c.code) === suggestCountry)
  const flag = GCC_COUNTRY_FLAGS[profile?.code ?? ''] ?? ''

  return (
    <div className="dm-locale-suggest" role="dialog" aria-labelledby="locale-suggest-title" aria-live="polite">
      <p id="locale-suggest-title" className="dm-locale-suggest__title">
        {flag} View DigitalManager for {profile?.name || suggestCountry.toUpperCase()}?
      </p>
      <p className="dm-locale-suggest__text">
        We detected you may be browsing from another GCC country. You can switch region or stay on the UAE English site.
      </p>
      <div className="dm-locale-suggest__actions">
        <button type="button" className="dm-locale-suggest__btn dm-locale-suggest__btn--primary" onClick={acceptCountrySuggest}>
          Switch to {profile?.shortName || suggestCountry.toUpperCase()}
        </button>
        <button type="button" className="dm-locale-suggest__btn dm-locale-suggest__btn--ghost" onClick={dismissCountrySuggest}>
          Stay on UAE
        </button>
      </div>
    </div>
  )
}
