import { useEffect, useMemo } from 'react'
import { useCms } from '../cms/CmsContext'
import { HeroCarousel } from './hero/HeroCarousel'
import { HeroErrorBoundary } from './hero/HeroErrorBoundary'
import type { HeroCmsPayload } from '../types/heroCarousel'
import { resolveHeroSlides } from './hero/defaultHeroSlides'
import { hasValidHeroSlides } from './hero/heroSlideValidation'

export function HeroSection() {
  const { data, loading, error } = useCms()
  const hero = (data?.hero ?? undefined) as HeroCmsPayload | undefined

  const slides = useMemo(() => resolveHeroSlides(hero), [hero])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const cmsSlideCount = Array.isArray(hero?.slides) ? hero.slides.length : 0
    const validCmsSlides = hasValidHeroSlides(hero)
    console.debug('[hero] HeroSection', {
      cmsLoaded: Boolean(data),
      loading,
      cmsError: error,
      incomingSlideCount: cmsSlideCount,
      validatedSlideCount: validCmsSlides ? cmsSlideCount : 0,
      renderedSlideCount: slides.length,
      usingFallback: !validCmsSlides,
      eyebrow: slides[0]?.pill?.en,
    })
  }, [data, hero, slides, loading, error])

  return (
    <HeroErrorBoundary>
      <HeroCarousel
        hero={hero}
        slides={slides}
        loading={loading}
        cmsError={error}
        cmsLoaded={Boolean(data)}
      />
    </HeroErrorBoundary>
  )
}
