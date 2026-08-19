import { useEffect, useState } from 'react'
import type { ModuleNavItem } from '../../../types/moduleDetailPage'
import { MODULE_SECTION_IDS, moduleShellClass } from './moduleConstants'

type Props = {
  items: ModuleNavItem[]
}

const NAV_TO_SECTION: Record<string, string> = {
  overview: MODULE_SECTION_IDS.overview,
  features: MODULE_SECTION_IDS.features,
  workflow: MODULE_SECTION_IDS.workflow,
  transactions: MODULE_SECTION_IDS.transactions,
  reports: MODULE_SECTION_IDS.reports,
  integrations: MODULE_SECTION_IDS.integrations,
  faqs: MODULE_SECTION_IDS.faqs,
}

export function ModuleStickyNav({ items }: Props) {
  const [active, setActive] = useState(items[0]?.id ?? 'overview')

  useEffect(() => {
    const ids = items.map((i) => NAV_TO_SECTION[i.id]).filter(Boolean)
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          const match = Object.entries(NAV_TO_SECTION).find(([, sid]) => sid === visible[0].target.id)
          if (match) setActive(match[0])
        }
      },
      { rootMargin: '-120px 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  function scrollTo(id: string) {
    const sectionId = NAV_TO_SECTION[id]
    const el = sectionId ? document.getElementById(sectionId) : null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(id)
    }
  }

  return (
    <nav className="mod-sticky-nav" aria-label="Page sections">
      <div className={moduleShellClass}>
        <ul className="mod-sticky-nav__list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`mod-sticky-nav__btn ${active === item.id ? 'is-active' : ''}`}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
