export type PageSectionRow = { id: string; name?: string; visible?: boolean; sortOrder?: number }

const MAIN_IDS = [
  'hero',
  'stats',
  'about',
  'valueChain',
  'modules',
  'workflow',
  'industries',
  'faqs',
  'cta',
] as const

const DEFAULT_MAIN: PageSectionRow[] = MAIN_IDS.map((id, i) => ({
  id,
  name: id,
  visible: true,
  sortOrder: i,
}))

export function parsePageSections(raw: unknown): PageSectionRow[] {
  const sections = (raw as { sections?: PageSectionRow[] } | null)?.sections
  if (!Array.isArray(sections) || sections.length === 0) return DEFAULT_MAIN
  return [...sections].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function isSectionVisible(sections: PageSectionRow[], id: string): boolean {
  const row = sections.find((s) => s.id === id)
  if (!row) return true
  return row.visible !== false
}

export function isFooterVisibleFromSections(sections: PageSectionRow[]): boolean {
  return isSectionVisible(sections, 'footer')
}

export function isTopBarVisibleFromSections(sections: PageSectionRow[]): boolean {
  return isSectionVisible(sections, 'topBar')
}
