import { useCallback, useEffect, useRef, useState } from 'react'
import type { HeroCarouselSlide, HeroCmsPayload } from '../../types/heroCarousel'
import { useHeroCarousel, useSwipe } from '../../hooks/useHeroCarousel'
import { resolveAutoplayMs } from './defaultHeroSlides'
import { HeroCarouselDeck } from './HeroCarouselDeck'
import { HeroSlidePanel } from './HeroSlidePanel'
import './dm-hero.css'

type Props = {
  hero?: HeroCmsPayload
  slides: HeroCarouselSlide[]
  loading?: boolean
  cmsLoaded?: boolean
  cmsError?: string | null
}

export function HeroCarousel({ hero, slides, loading, cmsLoaded, cmsError }: Props) {
  const durationMs = resolveAutoplayMs(hero)
  const autoplayEnabled = hero?.autoplayEnabled !== false

  const [animKey, setAnimKey] = useState(0)
  const [hoverPaused, setHoverPaused] = useState(false)

  const regionRef = useRef<HTMLDivElement>(null)

  const { index, reducedMotion, autoplayEpoch, next, prev, select } = useHeroCarousel({
    slideCount: slides.length,
    autoplayEnabled,
    durationMs,
    paused: hoverPaused,
  })

  const swipe = useSwipe(next, prev)

  const activeSlide = slides[index]

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [index])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
    },
    [next, prev],
  )

  if (loading && !cmsLoaded) {
    return (
      <section id="home" className="dm-hero" aria-busy="true" aria-label="Loading hero">
        <div className="dm-hero__container dm-hero__inner">
          <div className="dm-hero__copy">
            <div className="dm-hero__copy-inner" aria-hidden />
          </div>
        </div>
      </section>
    )
  }

  if (cmsError && !cmsLoaded) {
    return (
      <section id="home" className="dm-hero" aria-label="Hero unavailable">
        {import.meta.env.DEV ? (
          <p className="mx-auto max-w-3xl px-4 py-8 text-sm text-red-700" role="alert">
            CMS hero failed to load: {cmsError}
          </p>
        ) : null}
      </section>
    )
  }

  if (!activeSlide) return null

  return (
    <section
      id="home"
      className={`dm-hero ${hoverPaused ? 'dm-hero--paused' : ''}`}
      aria-busy={loading}
      aria-roledescription="carousel"
      aria-label="DigitalManager product modules"
    >
      <div
        ref={regionRef}
        className="dm-hero__container dm-hero__inner"
        onKeyDown={onKeyDown}
        aria-live="off"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocusCapture={() => setHoverPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setHoverPaused(false)
          }
        }}
      >
        <div className="dm-hero__copy">
          {activeSlide ? (
            <HeroSlidePanel
              slide={activeSlide}
              slideIndex={index}
              slideCount={slides.length}
              animKey={animKey}
              reducedMotion={reducedMotion}
              hero={hero}
            />
          ) : null}
        </div>

        <div className="dm-hero__carousel">
          <HeroCarouselDeck
            slides={slides}
            activeIndex={index}
            animKey={animKey}
            reducedMotion={reducedMotion}
            durationMs={durationMs}
            autoplayEpoch={autoplayEpoch}
            onSelect={select}
            onTouchStart={swipe.onTouchStart}
            onTouchEnd={swipe.onTouchEnd}
          />
        </div>
      </div>
    </section>
  )
}
