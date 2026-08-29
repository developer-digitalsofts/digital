import { ChevronDown } from 'lucide-react'
import { useCountry, useCountryFlag } from '../context/CountryContext'
import type { GccCountryCode } from '../config/gccCountries'
import './country-selector.css'

export function CountrySelector({ compact = false }: { compact?: boolean }) {
  const { countryCode, setCountryCode, countries } = useCountry()
  const flag = useCountryFlag(countryCode)

  if (countries.length <= 1) return null

  return (
    <label className={`dm-country-select ${compact ? 'dm-country-select--compact' : ''}`}>
      <span className="sr-only">Select country</span>
      <span className="dm-country-select__flag" aria-hidden>
        {flag}
      </span>
      <select
        className="dm-country-select__input"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value as GccCountryCode)}
        aria-label="Select country"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.shortName || country.name}
          </option>
        ))}
      </select>
      <ChevronDown className="dm-country-select__chevron" aria-hidden strokeWidth={2.25} />
    </label>
  )
}
