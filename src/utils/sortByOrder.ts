export function sortByOrder<T extends { sortOrder?: number }>(items: T[] | undefined | null): T[] {
  if (!items?.length) return []
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}
