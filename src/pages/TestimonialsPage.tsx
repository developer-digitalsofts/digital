import { useEffect, useMemo, useState } from 'react'
import { fetchPublicTestimonials } from '../cms/contentApi'
import { useCountry } from '../context/CountryContext'
import { resolveTestimonialsDoc } from '../cms/contentApi'
import { resolvePublicMediaUrl } from '../cms/publicMediaUrl'
import { useI18n } from '../i18n/I18nProvider'
import type { TestimonialsContentDoc } from '../types/testimonialsContent'
import '../components/testimonials.css'
import './content-pages.css'

function TestimonialPageCard({
  item,
}: {
  item: {
    id: string
    quote: string
    customerName: string
    designation: string
    company: string
    image: string
    imageAlt: string
  }
}) {
  const image = resolvePublicMediaUrl(item.image)
  return (
    <article className="testimonial-card">
      <div className="testimonial-card__quote-mark" aria-hidden="true">
        &ldquo;
      </div>
      <blockquote className="testimonial-card__quote">{item.quote}</blockquote>
      <footer className="testimonial-card__footer">
        <div className="testimonial-card__person">
          <cite className="testimonial-card__name">{item.customerName}</cite>
          <span className="testimonial-card__role">{item.designation}</span>
          <span className="testimonial-card__company">{item.company}</span>
        </div>
        {image ? (
          <div className="testimonial-card__avatar">
            <img src={image} alt={item.imageAlt || item.customerName} loading="lazy" width={62} height={62} />
          </div>
        ) : null}
      </footer>
    </article>
  )
}

export function TestimonialsPage() {
  const { lang } = useI18n()
  const { countryCode } = useCountry()
  const [doc, setDoc] = useState<TestimonialsContentDoc | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [industry, setIndustry] = useState('')

  useEffect(() => {
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

  useEffect(() => {
    document.title = resolved.seoTitle || resolved.pageTitle || 'Client Testimonials'
    return () => {
      document.title = ''
    }
  }, [resolved.seoTitle, resolved.pageTitle])

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
    <main className="content-page dm-testimonials">
      <div className="content-page__container">
        <header className="content-page__hero">
          <p className="content-page__eyebrow">CLIENT SUCCESS</p>
          <h1>{resolved.pageTitle || 'Client Testimonials'}</h1>
          {resolved.pageIntro ? <p className="content-page__intro">{resolved.pageIntro}</p> : null}
        </header>

        {error ? <p className="content-page__error" role="alert">{error}</p> : null}

        {industries.length > 1 ? (
          <div className="content-page__filters" role="toolbar" aria-label="Filter testimonials">
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

        {!loading && resolved.items.length === 0 ? (
          <p className="content-page__empty">Verified client testimonials will appear here once published in the CMS.</p>
        ) : null}

        {!loading && resolved.items.length > 0 && filtered.length === 0 ? (
          <p className="content-page__empty">No testimonials match this filter.</p>
        ) : null}

        {!loading && filtered.length > 0 ? (
          <div className="content-page__grid content-page__grid--testimonials">
            {filtered.map((item) => (
              <TestimonialPageCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
      </div>
    </main>
  )
}
