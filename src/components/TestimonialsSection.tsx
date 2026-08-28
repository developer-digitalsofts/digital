import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCms } from '../cms/CmsContext'
import { resolveTestimonialsCms } from '../cms/resolveHomepageCms'
import { useLocale } from '../locale/LocaleContext'
import { normalizeCountryCode } from '../config/gccCountries'
import { useI18n } from '../i18n/I18nProvider'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { resolvePublicMediaUrl } from '../cms/publicMediaUrl'
import { ScrollReveal } from './ScrollReveal'
import { sectionWhite } from '../ui/saas'
import './testimonials.css'

const AUTOPLAY_MS = 6000
const PAIR_BREAKPOINT = 768

type ResolvedTestimonial = {
  id: string
  quote: string
  customerName: string
  designation: string
  company: string
  image: string
  imageAlt: string
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function pairSlides(items: ResolvedTestimonial[]): ResolvedTestimonial[][] {
  const slides: ResolvedTestimonial[][] = []
  for (let i = 0; i < items.length; i += 2) {
    slides.push(items.slice(i, i + 2))
  }
  return slides
}

function TestimonialAvatar({ name, src, alt }: { name: string; src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  const initials = initialsFromName(name)
  const url = resolvePublicMediaUrl(src)

  if (failed || !url) {
    return (
      <div className="testimonial-card__avatar" aria-hidden="true">
        <span className="testimonial-card__avatar-initials">{initials || '?'}</span>
      </div>
    )
  }

  return (
    <div className="testimonial-card__avatar">
      <img
        src={url}
        alt={alt || name}
        loading="lazy"
        decoding="async"
        width={62}
        height={62}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

function TestimonialCard({ item }: { item: ResolvedTestimonial }) {
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

        <TestimonialAvatar name={item.customerName} src={item.image} alt={item.imageAlt} />
      </footer>
    </article>
  )
}

export function TestimonialsSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const { href, countryCode } = useLocale()
  const marketCode = normalizeCountryCode(countryCode)
  const copy = useMemo(() => resolveTestimonialsCms(data ?? undefined, t, lang, marketCode), [data, t, lang, marketCode])
  const reducedMotion = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [timerEpoch, setTimerEpoch] = useState(0)
  const [pairMode, setPairMode] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${PAIR_BREAKPOINT}px)`).matches,
  )
  const timerRef = useRef<number | null>(null)

  const items = copy.items
  const pairSlideList = useMemo(() => pairSlides(items), [items])
  const slideCount = pairMode ? pairSlideList.length : items.length
  const viewAllHref = href(copy.viewAllUrl || '/testimonials')

  const goTo = useCallback(
    (next: number) => {
      if (slideCount <= 0) return
      setIndex((next + slideCount) % slideCount)
      setTimerEpoch((e) => e + 1)
    },
    [slideCount],
  )

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${PAIR_BREAKPOINT}px)`)
    const onChange = () => {
      setPairMode(mq.matches)
      setIndex(0)
      setTimerEpoch((e) => e + 1)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    setIndex((i) => (slideCount > 0 ? i % slideCount : 0))
  }, [slideCount])

  useEffect(() => {
    if (slideCount <= 1 || reducedMotion || paused) return
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount)
    }, AUTOPLAY_MS)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [slideCount, reducedMotion, paused, timerEpoch])

  const activeItems = pairMode ? (pairSlideList[index] ?? []) : items[index] ? [items[index]] : []

  if (!items.length) return null

  return (
    <section id="testimonials" className={`dm-testimonials scroll-mt-28 ${sectionWhite} home-section home-section--testimonials`}>
      <div className="industries-section__container">
        <ScrollReveal>
          <header className="dm-testimonials__header">
            {copy.eyebrow ? <p className="dm-testimonials__eyebrow">{copy.eyebrow}</p> : null}
            {copy.title ? <h2 className="dm-testimonials__title">{copy.title}</h2> : null}
            {copy.supportingText ? <p className="dm-testimonials__lead">{copy.supportingText}</p> : null}
          </header>
        </ScrollReveal>

        <ScrollReveal delayMs={50}>
          <div
            className={`dm-testimonials__carousel ${pairMode ? 'dm-testimonials__carousel--pair' : 'dm-testimonials__carousel--single'}`}
            aria-roledescription="carousel"
            aria-label={copy.title || copy.eyebrow || 'Testimonials'}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setPaused(false)
              }
            }}
          >
            <div className="dm-testimonials__track" aria-live="polite" key={`${pairMode ? 'pair' : 'single'}-${index}`}>
              {activeItems.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </div>

            {slideCount > 1 ? (
              <div className="dm-testimonials__controls">
                <button
                  type="button"
                  className="dm-testimonials__nav-btn"
                  aria-label={t('testimonials.prev')}
                  onClick={() => goTo(index - 1)}
                >
                  <ChevronLeft className="dm-testimonials__nav-icon" aria-hidden />
                </button>
                <div className="dm-testimonials__dots" role="tablist" aria-label={t('testimonials.dotsLabel')}>
                  {Array.from({ length: slideCount }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      className={`dm-testimonials__dot ${i === index ? 'is-active' : ''}`}
                      aria-selected={i === index}
                      aria-label={`${t('testimonials.slideLabel')} ${i + 1}`}
                      onClick={() => goTo(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="dm-testimonials__nav-btn"
                  aria-label={t('testimonials.next')}
                  onClick={() => goTo(index + 1)}
                >
                  <ChevronRight className="dm-testimonials__nav-icon" aria-hidden />
                </button>
              </div>
            ) : null}
          </div>
        </ScrollReveal>

        {copy.showViewAll && copy.viewAllLabel ? (
          <p className="dm-testimonials__view-all">
            <Link to={viewAllHref}>{copy.viewAllLabel}</Link>
          </p>
        ) : null}
      </div>
    </section>
  )
}
