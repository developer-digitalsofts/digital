import type { HeroCarouselSlide, HeroCmsPayload } from '../../types/heroCarousel'

function readText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value === 'object') {
    const o = value as { en?: unknown; ar?: unknown }
    if (typeof o.en === 'string' && o.en.trim()) return o.en.trim()
    if (typeof o.ar === 'string' && o.ar.trim()) return o.ar.trim()
  }
  return ''
}

function slideImageSrc(slide: Record<string, unknown>): string {
  const dashboardImage = slide.dashboardImage
  if (dashboardImage && typeof dashboardImage === 'object') {
    const src = (dashboardImage as { src?: unknown }).src
    if (typeof src === 'string' && src.trim()) return src.trim()
  }
  if (typeof dashboardImage === 'string' && dashboardImage.trim()) return dashboardImage.trim()

  const image = slide.image
  if (image && typeof image === 'object') {
    const src = (image as { src?: unknown }).src
    if (typeof src === 'string' && src.trim()) return src.trim()
  }

  if (typeof slide.dashboardImageUrl === 'string' && slide.dashboardImageUrl.trim()) {
    return slide.dashboardImageUrl.trim()
  }

  return ''
}

/** One carousel slide is renderable when it is enabled and has headline copy or a dashboard image. */
export function isValidHeroSlide(slide: HeroCarouselSlide | null | undefined): slide is HeroCarouselSlide {
  if (!slide || typeof slide !== 'object') return false
  if (slide.visible === false) return false
  if ((slide as { enabled?: boolean }).enabled === false) return false

  const raw = slide as HeroCarouselSlide & {
    enabled?: boolean
    headline?: unknown
    dashboardImage?: unknown
    image?: unknown
  }

  const headline =
    readText(raw.headline) ||
    readText(slide.pill) ||
    readText(slide.titleBefore) ||
    readText(slide.titleAccent) ||
    readText(slide.titleLine2)

  // Bundled React dashboards render without an image URL — copy alone is enough.
  if (headline) return true

  return Boolean(slideImageSrc(raw as Record<string, unknown>))
}

export function hasValidHeroSlides(hero: HeroCmsPayload | null | undefined): boolean {
  const slides = hero?.slides
  return Array.isArray(slides) && slides.some((slide) => isValidHeroSlide(slide))
}

export function filterValidHeroSlides(slides: HeroCarouselSlide[]): HeroCarouselSlide[] {
  return slides.filter((slide) => isValidHeroSlide(slide))
}
