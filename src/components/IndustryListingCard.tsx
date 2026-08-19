import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { formatMoreSolutionsLabel } from '../data/publishedIndustries'
import type { IndustryListingCardData } from '../data/publishedIndustries'
import './industry-listing-card.css'

const VISIBLE_SOLUTIONS = 3

type Props = IndustryListingCardData & {
  footerActionLabel: string
  variant?: 'home' | 'page'
}

export function IndustryListingCard({
  slug,
  label,
  title,
  description,
  image,
  imageAlt,
  viewAllHref,
  solutions,
  footerActionLabel,
  variant = 'page',
}: Props) {
  const { t } = useI18n()
  const [imageFailed, setImageFailed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const remainingCount = Math.max(solutions.length - VISIBLE_SOLUTIONS, 0)
  const visibleSolutions = isExpanded ? solutions : solutions.slice(0, VISIBLE_SOLUTIONS)
  const solutionsListId = `solutions-${slug}`

  const toggleExpanded = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsExpanded((current) => !current)
  }

  return (
    <article
      id={variant === 'page' ? slug : undefined}
      className={`industry-listing-card industry-listing-card--${variant} scroll-mt-28${isExpanded ? ' industry-listing-card--expanded' : ''}`}
      aria-labelledby={`industry-listing-${slug}`}
    >      <div className="industry-listing-card__image">
        <Link
          to={viewAllHref}
          className="industry-listing-card__image-link"
          aria-label={`${title} industry solutions`}
        >
          {imageFailed ? (
            <span className="industry-listing-card__image-fallback" aria-hidden>
              {title.trim().charAt(0).toUpperCase() || '?'}
            </span>
          ) : (
            <img
              src={image}
              alt={imageAlt}
              className="industry-listing-card__img"
              loading="lazy"
              decoding="async"
              width={640}
              height={320}
              onError={() => setImageFailed(true)}
            />
          )}
          <span className="industry-listing-card__image-gradient" aria-hidden />
        </Link>
      </div>

      <div className="industry-listing-card__content">
        <p className="industry-listing-card__label">{label}</p>

        <h3 id={`industry-listing-${slug}`} className="industry-listing-card__title">
          <Link to={viewAllHref} className="industry-listing-card__title-link">
            {title}
          </Link>
        </h3>

        {description ? (
          <p className="industry-listing-card__description">{description}</p>
        ) : null}

        {visibleSolutions.length > 0 ? (
          <ul
            id={solutionsListId}
            className={`industry-listing-card__solutions${isExpanded ? ' industry-listing-card__solutions--expanded' : ''}`}
          >
            {visibleSolutions.map((solution) => (
              <li key={`${slug}-${solution.href}`}>
                <Link to={solution.href} className="industry-listing-card__solution-link">
                  <ChevronRight className="industry-listing-card__solution-icon" aria-hidden />
                  <span>{solution.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {remainingCount > 0 ? (
          <button
            type="button"
            className="industry-listing-card__more"
            onClick={toggleExpanded}
            aria-expanded={isExpanded}
            aria-controls={solutionsListId}
          >
            {isExpanded ? (
              <>
                {t('industryShowcase.showLess')}
                <ChevronUp className="industry-listing-card__more-icon" aria-hidden />
              </>
            ) : (
              <>
                {formatMoreSolutionsLabel(remainingCount, t)}
                <ChevronDown className="industry-listing-card__more-icon" aria-hidden />
              </>
            )}
          </button>
        ) : null}
        <div className="industry-listing-card__footer">
          <Link to={viewAllHref} className="industry-listing-card__footer-action">
            <span>{footerActionLabel}</span>
            <ChevronRight className="industry-listing-card__footer-icon" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  )
}
