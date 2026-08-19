/** Normalize heading strings for duplicate detection. */
export function normalizeHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getUniqueHeading(
  eyebrow: string | undefined | null,
  title: string | undefined | null,
): { eyebrow: string | null; title: string | null } {
  const e = eyebrow?.trim() ?? ''
  const t = title?.trim() ?? ''
  if (!e) return { eyebrow: null, title: t || null }
  if (!t) return { eyebrow: e, title: null }
  if (normalizeHeading(e) === normalizeHeading(t)) {
    return { eyebrow: null, title: t }
  }
  return { eyebrow: e, title: t }
}

/** Single section heading — never repeats eyebrow and title when they match. */
export function buildSectionHeading(
  eyebrow: string | undefined | null,
  title: string | undefined | null,
  fallback = '',
): string {
  const { eyebrow: e, title: t } = getUniqueHeading(eyebrow, title)
  if (t && e) return `${e} — ${t}`
  if (t) return t
  if (e) return e
  return fallback
}
