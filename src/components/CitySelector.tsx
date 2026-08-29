import { PK_CITY_NAMES, PK_CITY_SLUGS, type PkCitySlug } from '../market/pakistanConfig'
import { useCity } from '../locale/CityContext'
import './locale-selector.css'

type Props = {
  compact?: boolean
  className?: string
}

export function CitySelector({ compact = false, className = '' }: Props) {
  const { citySlug, setCity } = useCity()

  return (
    <div className={`dm-locale-select ${compact ? 'dm-locale-select--compact' : ''} ${className}`.trim()}>
      <label className="dm-locale-select__group">
        <span className="dm-locale-select__label">City</span>
        <select
          className="dm-locale-select__input"
          aria-label="Select city"
          value={citySlug || ''}
          onChange={(e) => {
            const next = e.target.value
            setCity(next ? (next as PkCitySlug) : null)
          }}
        >
          <option value="">All Pakistan</option>
          {PK_CITY_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {PK_CITY_NAMES[slug]}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
