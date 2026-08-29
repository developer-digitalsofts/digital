import { Fragment, useMemo } from 'react'
import { useCms } from '../cms/CmsContext'
import {
  getHomeSectionDefinition,
  HOME_SECTION_REGISTRY,
  isActiveHomeSectionId,
} from '../cms/homeSectionRegistry'
import { isSectionVisible, parsePageSections } from '../cms/pageSections'

export function HomePage() {
  const { data } = useCms()
  const sections = useMemo(() => parsePageSections(data?.pageSections), [data?.pageSections])

  const orderedSections = useMemo(() => {
    const configured = sections
      .filter((s) => isActiveHomeSectionId(s.id))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

    if (configured.length > 0) return configured

    return HOME_SECTION_REGISTRY.map((def) => ({
      id: def.id,
      name: def.label,
      visible: true,
      sortOrder: def.defaultSortOrder,
    }))
  }, [sections])

  return (
    <main>
      {orderedSections.map((s) => {
        if (s.id === 'stats' || !isSectionVisible(sections, s.id) || !isActiveHomeSectionId(s.id)) return null
        const def = getHomeSectionDefinition(s.id)
        if (!def) return null
        const Section = def.component
        return (
          <Fragment key={s.id}>
            <Section />
          </Fragment>
        )
      })}
    </main>
  )
}
