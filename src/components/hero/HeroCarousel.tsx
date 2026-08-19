import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { HeroCarouselSlide, HeroCmsPayload } from '../../types/heroCarousel'
import { useHeroCarousel, useSwipe } from '../../hooks/useHeroCarousel'
import { DEFAULT_HERO_SLIDES, resolveAutoplayMs } from './defaultHeroSlides'
import { hasValidHeroSlideList } from './heroSlideValidation'
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

  const displaySlides = useMemo(
    () => (hasValidHeroSlideList(slides) ? slides : DEFAULT_HERO_SLIDES),
    [slides],
  )

  const usingFallback = displaySlides === DEFAULT_HERO_SLIDES || !hasValidHeroSlideList(slides)

  const { index, reducedMotion, autoplayEpoch, next, prev, select } = useHeroCarousel({
    slideCount: displaySlides.length,
    autoplayEnabled,
    durationMs,
    paused: hoverPaused,
  })

  const swipe = useSwipe(next, prev)

  const safeIndex = Math.min(Math.max(index, 0), displaySlides.length - 1)
  const activeSlide = displaySlides[safeIndex] ?? displaySlides[0]

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [safeIndex])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    console.debug('[hero] carousel state', {
      incomingSlideCount: slides.length,
      validatedSlideCount: hasValidHeroSlideList(slides) ? slides.length : 0,
      displaySlideCount: displaySlides.length,
      usingFallback,
      cmsLoaded,
      loading,
      cmsError,
      activeIndex: index,
      safeIndex,
      activeSlideId: activeSlide?.id,
    })
  }, [
    slides.length,
    displaySlides.length,
    usingFallback,
    cmsLoaded,
    loading,
    cmsError,
    index,
    safeIndex,
    activeSlide?.id,
    slides,
  ])

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
          <HeroSlidePanel
            slide={activeSlide}
            slideIndex={safeIndex}
            slideCount={displaySlides.length}
            animKey={animKey}
            reducedMotion={reducedMotion}
            hero={hero}
          />
        </div>

        <div className="dm-hero__carousel">
          <HeroCarouselDeck
            slides={displaySlides}
            activeIndex={safeIndex}
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
