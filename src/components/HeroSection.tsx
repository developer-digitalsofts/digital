import { useEffect, useMemo } from 'react'
import { useCms } from '../cms/CmsContext'
import { HeroCarousel } from './hero/HeroCarousel'
import type { HeroCmsPayload } from '../types/heroCarousel'
import { resolveHeroSlides } from './hero/defaultHeroSlides'

export function HeroSection() {
  const { data, loading, error } = useCms()
  const hero = data?.hero as HeroCmsPayload | undefined
  const cmsLoaded = Boolean(data)

  const slides = useMemo(
    () => resolveHeroSlides(hero, { cmsLoaded }),
    [hero, cmsLoaded],
  )

  useEffect(() => {
    if (!import.meta.env.DEV || !cmsLoaded) return
    console.log('RENDERED_HERO_DATA', {
      cmsLoaded,
      slideCount: slides.length,
      eyebrow: slides[0]?.pill?.en,
      legacyPill: hero?.pill?.en,
      source: 'published-cms-api',
    })
  }, [cmsLoaded, slides, hero?.pill?.en])

  return (
    <HeroCarousel
      hero={hero}
      slides={slides}
      loading={loading && !data}
      cmsError={error}
      cmsLoaded={cmsLoaded}
    />
  )
}
