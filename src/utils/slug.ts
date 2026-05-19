export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function softwarePath(type: 'module' | 'industry', slug: string) {
  return `/software/${type}/${slug}`
}
