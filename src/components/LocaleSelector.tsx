import { useCountryFlag, useLocale } from '../locale/LocaleContext'
import './locale-selector.css'

type LocaleSelectorProps = { compact?: boolean; className?: string }

/** Pakistan-only market — display label (no multi-country switcher). */
export function LocaleSelector({ compact = false, className = '' }: LocaleSelectorProps) {
  const { countryCode, countries } = useLocale()
  const flag = useCountryFlag(countries.find((c) => c.code === countryCode)?.code ?? 'PK')
  const label = countries.find((c) => c.code === countryCode)?.shortName || 'Pakistan'

  return (
    <div className={`dm-locale-select ${compact ? 'dm-locale-select--compact' : ''} ${className}`.trim()}>
      <div className="dm-locale-select__group" aria-label="Country">
        {!compact ? (
          <span className="dm-locale-select__flag" aria-hidden>
            {flag}
          </span>
        ) : null}
        <span className="dm-locale-select__input" aria-live="polite">
          {label}
        </span>
      </div>
    </div>
  )
}
