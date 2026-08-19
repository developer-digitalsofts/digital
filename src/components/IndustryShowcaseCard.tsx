import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CmsLink } from './CmsLink'
import type { IndustrySoftwareLink } from '../data/publishedIndustries'
import './industry-showcase.css'

type Props = {
  title: string
  description?: string
  softwareLinks?: IndustrySoftwareLink[]
  image: string
  imageAlt: string
  href: string
  useCmsLink?: boolean
}

export function IndustryShowcaseCard({
  title,
  description = '',
  softwareLinks,
  image,
  imageAlt,
  href,
  useCmsLink = false,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasSoftwareLinks = Boolean(softwareLinks?.length)
  const isHashLink = href.startsWith('#')
  const initial = title.trim().charAt(0).toUpperCase() || '?'

  const media = (
    <div
      className={`industry-card__media industry-showcase-card__media ${imageFailed ? 'industry-showcase-card__media--fallback' : ''}`}
    >
      {imageFailed ? (
        <span className="industry-showcase-card__fallback-mark" aria-hidden>
          {initial}
        </span>
      ) : (
        <img
          src={image}
          alt={imageAlt}
          className="industry-showcase-card__img"
          loading="lazy"
          decoding="async"
          width={640}
          height={330}
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  )

  const body = (
    <div className="industry-card__content industry-showcase-card__body">
      <h3 className="industry-card__title industry-showcase-card__title">{title}</h3>
      {hasSoftwareLinks ? (
        <ul className="industry-showcase-card__software-links">
          {softwareLinks!.map((link) => (
            <li key={link.slug}>
              <Link to={link.href} className="industry-showcase-card__software-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : description ? (
        <p className="industry-card__description industry-showcase-card__desc">{description}</p>
      ) : null}
    </div>
  )

  if (hasSoftwareLinks) {
    return (
      <article className="industry-card industry-showcase-card industry-showcase-card--links group/card">
        {media}
        {body}
      </article>
    )
  }

  const linkClass = 'industry-card__link industry-showcase-card__link'
  const inner = (
    <>
      {media}
      {body}
    </>
  )

  return (
    <article className="industry-card industry-showcase-card group/card">
      {isHashLink ? (
        <a href={href} className={linkClass}>
          {inner}
        </a>
      ) : useCmsLink ? (
        <CmsLink to={href} className={linkClass}>
          {inner}
        </CmsLink>
      ) : (
        <Link to={href} className={linkClass}>
          {inner}
        </Link>
      )}
    </article>
  )
}

type ViewAllProps = {
  label: string
}

export function IndustryShowcaseViewAll({ label }: ViewAllProps) {
  return (
    <Link to="/industries" className="industry-showcase-viewall industries-section__view-all group">
      {label}
      <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}
