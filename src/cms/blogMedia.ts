import { resolvePublicMediaUrl } from './publicMediaUrl'

/** Branded fallback when a post has no featured image uploaded. */
export const BLOG_FALLBACK_IMAGE = '/software-images/inventory-management-software/hero.jpg'

export function hasCustomFeaturedImage(path: string | undefined | null): boolean {
  const raw = (path ?? '').trim()
  if (!raw) return false
  if (/^(data:|blob:)/i.test(raw)) return false
  if (/^[a-z]:\\/i.test(raw)) return false
  return true
}

export function resolveBlogFeaturedImage(path: string | undefined | null): string {
  if (hasCustomFeaturedImage(path)) {
    const resolved = resolvePublicMediaUrl(path)
    if (resolved) return resolved
  }
  return resolvePublicMediaUrl(BLOG_FALLBACK_IMAGE)
}
