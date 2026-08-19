import { useEffect, useMemo } from 'react'
import { useCms } from '../cms/CmsContext'
import { HeroCarousel } from './hero/HeroCarousel'
import { HeroErrorBoundary } from './hero/HeroErrorBoundary'
import type { HeroCmsPayload } from '../types/heroCarousel'
import { resolveHeroSlides } from './hero/defaultHeroSlides'
import { hasValidHeroSlides } from './hero/heroSlideValidation'

export function HeroSection() {
  const { data, loading, error } = useCms()
  const hero = data?.hero as HeroCmsPayload | undefined
  const cmsLoaded = Boolean(data)

  const slides = useMemo(
    () => resolveHeroSlides(hero, { cmsLoaded }),
    [hero, cmsLoaded],
  )

  useEffect(() => {
    if (!cmsLoaded) return
    const cmsSlideCount = Array.isArray(hero?.slides) ? hero!.slides!.length : 0
    const validCmsSlides = hasValidHeroSlides(hero)
    if (!validCmsSlides && cmsSlideCount > 0) {
      console.warn('[hero] Published CMS hero slides were present but invalid — using bundled fallback')
    }
    if (import.meta.env.DEV) {
      console.log('RENDERED_HERO_DATA', {
        cmsLoaded,
        cmsSlideCount,
        validCmsSlides,
        renderedSlideCount: slides.length,
        eyebrow: slides[0]?.pill?.en,
        legacyPill: hero?.pill?.en,
        source: validCmsSlides ? 'published-cms-api' : 'bundled-fallback',
      })
    }
  }, [cmsLoaded, slides, hero])

  return (
    <HeroErrorBoundary>
      <HeroCarousel
        hero={hero}
        slides={slides}
        loading={loading && !data}
        cmsError={error}
        cmsLoaded={cmsLoaded}
      />
    </HeroErrorBoundary>
  )
}
