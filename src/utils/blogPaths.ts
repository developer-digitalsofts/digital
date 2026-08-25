import { buildLocalizedHref } from '../locale/localePaths'
import type { LocaleCountrySlug, LocaleLang } from '../locale/localeConfig'

/** Locale-aware blog listing path (`/blog` or `/sa/en/insights`). */
export function blogListingPath(countrySlug: LocaleCountrySlug = 'ae', lang: LocaleLang = 'en'): string {
  return buildLocalizedHref(countrySlug, lang, '/blog')
}

/** Locale-aware article detail path (`/blog/slug` or `/kw/en/insights/slug`). */
export function blogArticlePath(
  slug: string,
  countrySlug: LocaleCountrySlug = 'ae',
  lang: LocaleLang = 'en',
): string {
  const listing = blogListingPath(countrySlug, lang)
  return `${listing}/${encodeURIComponent(slug)}`
}
