import { LocaleSelector } from './LocaleSelector'
import { useLocale } from '../locale/LocaleContext'
import './locale-selector.css'

type Props = {
  className?: string
  hint?: boolean
}

/** Manual region/language fallback — hidden from desktop header; used in mobile menu and footer. */
export function RegionLanguageUtility({ className = '', hint = true }: Props) {
  const { resetAutoLocale, hasManualLocalePref } = useLocale()

  return (
    <div className={`dm-locale-utility ${className}`.trim()} aria-label="Region and language">
      <p className="dm-locale-utility__title">Region &amp; Language</p>
      {hint ? (
        <p className="dm-locale-utility__hint">
          Override automatic detection if you use a VPN, travel abroad, or your region was detected incorrectly.
        </p>
      ) : null}
      <LocaleSelector compact className="dm-locale-utility__select" />
      <button
        type="button"
        className="dm-locale-utility__reset mt-3 text-sm font-semibold text-brand hover:underline"
        onClick={resetAutoLocale}
      >
        {hasManualLocalePref ? 'Reset saved country & detect again' : 'Detect my country again'}
      </button>
    </div>
  )
}
