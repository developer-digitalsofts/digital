import { LocaleSelector } from './LocaleSelector'
import './locale-selector.css'

type Props = {
  className?: string
  hint?: boolean
}

/** Manual region/language fallback — hidden from desktop header; used in mobile menu and footer. */
export function RegionLanguageUtility({ className = '', hint = true }: Props) {
  return (
    <div className={`dm-locale-utility ${className}`.trim()} aria-label="Region and language">
      <p className="dm-locale-utility__title">Region &amp; Language</p>
      {hint ? (
        <p className="dm-locale-utility__hint">
          Override automatic detection if you use a VPN, travel abroad, or your region was detected incorrectly.
        </p>
      ) : null}
      <LocaleSelector compact className="dm-locale-utility__select" />
    </div>
  )
}
