import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { fetchPublicTestimonials, resolveTestimonialsDoc } from '../cms/contentApi'
import { useCountry } from '../context/CountryContext'
import { useLocale } from '../locale/LocaleContext'
import { resolvePublicMediaUrl } from '../cms/publicMediaUrl'
import { useI18n } from '../i18n/I18nProvider'
import type { ResolvedTestimonial, TestimonialsContentDoc } from '../types/testimonialsContent'
import '../components/testimonials.css'
import './content-pages.css'

function TestimonialPageCard({ item, featured }: { item: ResolvedTestimonial; featured?: boolean }) {
  const { href } = useLocale()
  const image = resolvePublicMediaUrl(item.image)
  const logo = resolvePublicMediaUrl(item.companyLogo)

  return (
    <article className={`testimonial-card testimonials-page__card${featured ? ' testimonials-page__card--featured' : ''}`}>
      <div className="testimonial-card__quote-mark" aria-hidden="true">
        &ldquo;
      </div>
      <blockquote className="testimonial-card__quote">{item.quote}</blockquote>
      <footer className="testimonial-card__footer">
        <div className="testimonial-card__person">
          <cite className="testimonial-card__name">{item.customerName}</cite>
          {item.designation ? <span className="testimonial-card__role">{item.designation}</span> : null}
          {item.company ? <span className="testimonial-card__company">{item.company}</span> : null}
          <div className="testimonials-page__meta-chips">
            {item.country ? <span className="testimonials-page__chip">{item.country}</span> : null}
            {item.industry ? <span className="testimonials-page__chip">{item.industry}</span> : null}
          </div>
          {item.solutionUrl ? (
            <Link to={href(item.solutionUrl)} className="testimonials-page__solution-link" onClick={(e) => e.stopPropagation()}>
              Related solution
            </Link>
          ) : null}
        </div>
        <div className="testimonials-page__media">
          {logo ? (
            <img src={logo} alt={item.companyLogoAlt || item.company || 'Company logo'} className="testimonials-page__logo" loading="lazy" />
          ) : null}
          {image ? (
            <div className="testimonial-card__avatar">
              <img src={image} alt={item.imageAlt || item.customerName} loading="lazy" width={62} height={62} />
            </div>
          ) : (
            <div className="testimonial-card__avatar" aria-hidden>
              <span className="testimonial-card__avatar-initials">
                {item.customerName
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((p) => p.charAt(0).toUpperCase())
                  .join('') || '?'}
              </span>
            </div>
          )}
        </div>
      </footer>
    </article>
  )
}

export function TestimonialsPage() {
  const { lang, t } = useI18n()
  const { countryCode } = useCountry()
  const { href } = useLocale()
  const [doc, setDoc] = useState<TestimonialsContentDoc | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [industry, setIndustry] = useState('')

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchPublicTestimonials<TestimonialsContentDoc>({ lang, country: countryCode })
      .then(setDoc)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load testimonials'))
      .finally(() => setLoading(false))
  }, [lang, countryCode])

  const resolved = useMemo(() => resolveTestimonialsDoc(doc ?? undefined, lang), [doc, lang])
  const industries = useMemo(
    () => [...new Set(resolved.items.map((i) => i.industry).filter(Boolean))].sort(),
    [resolved.items],
  )
  const filtered = useMemo(
    () => (industry ? resolved.items.filter((i) => i.industry === industry) : resolved.items),
    [resolved.items, industry],
  )
  const featured = useMemo(
    () => filtered.find((i) => i.featuredOnHomepage) || filtered[0],
    [filtered],
  )
  const gridItems = useMemo(
    () => filtered.filter((i) => i.id !== featured?.id),
    [filtered, featured?.id],
  )

  useEffect(() => {
    document.title = resolved.seoTitle || resolved.pageTitle || 'Client Testimonials | DigitalManager'
    const desc = resolved.seoDescription
    let meta = document.querySelector('meta[name="description"]')
    if (desc) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', desc)
    }
    return () => {
      document.title = ''
    }
  }, [resolved.seoTitle, resolved.pageTitle, resolved.seoDescription])

  if (!loading && !resolved.pageEnabled) {
    return (
      <main className="content-page">
        <div className="content-page__container">
          <h1>Testimonials</h1>
          <p className="content-page__empty">This page is not currently available.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="content-page dm-testimonials testimonials-page">
      <div className="content-page__container">
        <header className="content-page__hero">
          <p className="content-page__eyebrow">{resolved.pageEyebrow || 'CLIENT SUCCESS'}</p>
          <h1>{resolved.pageTitle || 'Client Testimonials'}</h1>
          {resolved.pageIntro ? <p className="content-page__intro">{resolved.pageIntro}</p> : null}
        </header>

        {error ? (
          <div className="testimonials-page__state testimonials-page__state--error" role="alert">
            <p className="content-page__error">{error}</p>
            <button type="button" className="testimonials-page__retry" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        ) : null}

        {industries.length > 1 ? (
          <div className="content-page__filters" role="toolbar" aria-label="Filter testimonials by industry">
            <button type="button" className={!industry ? 'is-active' : ''} onClick={() => setIndustry('')}>
              All
            </button>
            {industries.map((name) => (
              <button key={name} type="button" className={industry === name ? 'is-active' : ''} onClick={() => setIndustry(name)}>
                {name}
              </button>
            ))}
          </div>
        ) : null}

        {loading ? <p className="content-page__loading">Loading testimonials…</p> : null}

        {!loading && !error && resolved.items.length === 0 ? (
          <div className="testimonials-page__empty">
            <p className="content-page__empty">
              Verified client testimonials will appear here once approved and published in the CMS. Sample drafts remain private until real customer approval is confirmed.
            </p>
          </div>
        ) : null}

        {!loading && resolved.items.length > 0 && filtered.length === 0 ? (
          <p className="content-page__empty">No testimonials match this filter.</p>
        ) : null}

        {!loading && featured ? (
          <section className="testimonials-page__featured" aria-label="Featured testimonial">
            <TestimonialPageCard item={featured} featured />
          </section>
        ) : null}

        {!loading && gridItems.length > 0 ? (
          <section className="content-page__grid content-page__grid--testimonials testimonials-page__grid" aria-label="All testimonials">
            {gridItems.map((item) => (
              <TestimonialPageCard key={item.id} item={item} />
            ))}
          </section>
        ) : null}

        <section className="testimonials-page__cta" aria-label="Book a demo">
          <div className="testimonials-page__cta-inner">
            <div>
              <h2>{t('demoCta.title')}</h2>
              <p>{t('demoCta.desc')}</p>
            </div>
            <Link to={href('/contact')} className="testimonials-page__cta-btn">
              {t('demoCta.button')}
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
