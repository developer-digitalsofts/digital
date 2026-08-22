import { fetchJson } from './api'
import type { Lang } from '../i18n/messages'
import { matchesCountryScope } from '../config/gccCountries'
import type { GccCountryCode } from '../config/gccCountries'
import type { TestimonialRecord, TestimonialsContentDoc, ResolvedTestimonial } from '../types/testimonialsContent'

function readText(value: unknown, lang: Lang): string {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value === 'object') {
    const o = value as { en?: string; ar?: string }
    const primary = lang === 'ar' ? o.ar : o.en
    const fallback = lang === 'ar' ? o.en : o.ar
    if (typeof primary === 'string' && primary.trim()) return primary.trim()
    if (typeof fallback === 'string' && fallback.trim()) return fallback.trim()
  }
  return ''
}

export function isPublishedTestimonial(item: TestimonialRecord | null | undefined): boolean {
  if (!item || item.enabled === false || item.status !== 'published') return false
  return Boolean(readText(item.quote, 'en') && readText(item.customerName, 'en'))
}

export function mapTestimonialRecord(item: TestimonialRecord, lang: Lang): ResolvedTestimonial | null {
  if (!isPublishedTestimonial(item)) return null
  const quote = readText(item.quote, lang)
  const customerName = readText(item.customerName, lang)
  if (!quote || !customerName) return null
  return {
    id: item.id,
    quote,
    customerName,
    designation: readText(item.designation, lang),
    company: readText(item.company, lang),
    companyLogo: item.companyLogo?.trim() || '',
    companyLogoAlt: readText(item.companyLogoAlt, lang),
    image: item.image?.trim() || '',
    imageAlt: readText(item.imageAlt, lang) || customerName,
    productService: readText(item.productService, lang),
    industry: item.industry || '',
    city: item.city || '',
    country: item.country || '',
    rating: typeof item.rating === 'number' ? item.rating : undefined,
    verified: item.verified === true,
    caseStudyUrl: item.caseStudyUrl?.trim() || '',
    solutionUrl: item.solutionUrl?.trim() || '',
    featuredOnHomepage: item.featuredOnHomepage === true,
    countryCode: item.countryCode?.trim() || '',
  }
}

export function resolveTestimonialsDoc(doc: TestimonialsContentDoc | undefined, lang: Lang) {
  const section = doc?.section || {}
  const page = doc?.page || {}
  const published = (doc?.items || [])
    .map((item) => mapTestimonialRecord(item, lang))
    .filter(Boolean) as ResolvedTestimonial[]

  return {
    sectionEnabled: section.enabled !== false,
    eyebrow: readText(section.eyebrow, lang),
    heading: readText(section.heading, lang),
    supportingText: readText(section.supportingText, lang),
    viewAllLabel: readText(section.viewAllLabel, lang),
    viewAllUrl: section.viewAllUrl?.trim() || '/testimonials',
    showViewAll: section.showViewAll !== false,
    limit: typeof section.limit === 'number' ? section.limit : 6,
    selectionMode: section.selectionMode === 'manual' ? 'manual' as const : 'featured' as const,
    manualIds: Array.isArray(section.manualIds) ? section.manualIds : [],
    pageEnabled: page.enabled !== false,
    pageTitle: readText(page.title, lang),
    pageIntro: readText(page.intro, lang),
    seoTitle: readText(page.seoTitle, lang),
    seoDescription: readText(page.seoDescription, lang),
    items: published,
  }
}

export function selectHomepageTestimonials(
  resolved: ReturnType<typeof resolveTestimonialsDoc>,
  countryCode?: GccCountryCode,
) {
  if (!resolved.sectionEnabled || !resolved.items.length) return []
  let selected: ResolvedTestimonial[] = []
  if (resolved.selectionMode === 'manual' && resolved.manualIds.length) {
    const byId = new Map(resolved.items.map((i) => [i.id, i]))
    selected = resolved.manualIds.map((id) => byId.get(id)).filter(Boolean) as ResolvedTestimonial[]
  } else {
    selected = resolved.items.filter((item) => item.featuredOnHomepage)
    if (!selected.length) selected = resolved.items
  }
  const scoped = countryCode
    ? selected.filter((item) => matchesCountryScope(item.countryCode, countryCode))
    : selected
  return scoped.slice(0, resolved.limit)
}

export async function fetchPublicTestimonials<T = unknown>(params: Record<string, string | undefined> = {}) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v)
  }
  const qs = q.toString()
  return fetchJson<T>(`/api/public/testimonials${qs ? `?${qs}` : ''}`, { cache: 'no-store' })
}

export async function fetchPublicBlogPosts(params: Record<string, string | number | undefined> = {}) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') q.set(k, String(v))
  }
  const qs = q.toString()
  return fetchJson(`/api/public/blog/posts${qs ? `?${qs}` : ''}`, { cache: 'no-store' })
}

export async function fetchPublicBlogPost(slug: string, params: Record<string, string | undefined> = {}) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v)
  }
  const qs = q.toString()
  return fetchJson(`/api/public/blog/posts/${encodeURIComponent(slug)}${qs ? `?${qs}` : ''}`, { cache: 'no-store' })
}

export async function fetchPublicBlogHomepage() {
  return fetchJson('/api/public/blog/homepage', { cache: 'no-store' })
}

export async function fetchPublicBlogCategories() {
  return fetchJson('/api/public/blog/categories', { cache: 'no-store' })
}
