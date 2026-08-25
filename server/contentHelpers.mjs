/**
 * Shared helpers for testimonials and blog content stores.
 */
import { nanoid } from 'nanoid'

export const CONTENT_SCHEMA = {
  testimonials: 3,
  blogPosts: 1,
  blogCategories: 1,
  blogSection: 1,
}

export function slugify(input) {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

export function uniqueSlug(base, taken) {
  let slug = slugify(base) || `item-${nanoid(6)}`
  if (!taken.has(slug)) return slug
  let n = 2
  while (taken.has(`${slug}-${n}`)) n += 1
  return `${slug}-${n}`
}

export function readBilingualText(value, lang = 'en') {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const o = value
  const primary = lang === 'ar' ? o.ar : o.en
  const fallback = lang === 'ar' ? o.en : o.ar
  if (typeof primary === 'string' && primary.trim()) return primary.trim()
  if (typeof fallback === 'string' && fallback.trim()) return fallback.trim()
  return ''
}

export function isPublishedRecord(item) {
  return item && item.enabled !== false && item.status === 'published'
}

export function isValidTestimonial(item) {
  if (!item || typeof item !== 'object') return false
  const quote = readBilingualText(item.quote)
  const name = readBilingualText(item.customerName)
  return Boolean(quote && name)
}

export function estimateReadingMinutes(blocks, lang = 'en') {
  if (!Array.isArray(blocks)) return 1
  let words = 0
  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue
    if (block.type === 'paragraph' || block.type === 'quote') {
      words += readBilingualText(block.text, lang).split(/\s+/).filter(Boolean).length
    } else if (block.type === 'heading2' || block.type === 'heading3') {
      words += readBilingualText(block.text, lang).split(/\s+/).filter(Boolean).length
    } else if (block.type === 'bulletList' || block.type === 'numberedList') {
      for (const item of block.items || []) {
        words += readBilingualText(item, lang).split(/\s+/).filter(Boolean).length
      }
    } else if (block.type === 'cta') {
      words += readBilingualText(block.description, lang).split(/\s+/).filter(Boolean).length
    }
  }
  return Math.max(1, Math.ceil(words / 200))
}

export function stripAdminFieldsTestimonial(item) {
  if (!item || typeof item !== 'object') return item
  const { verificationNote, isSample, internalTitle, ...rest } = item
  return rest
}

export function stripAdminFieldsBlogPost(item) {
  if (!item || typeof item !== 'object') return item
  const { internalTitle, ...rest } = item
  return rest
}
