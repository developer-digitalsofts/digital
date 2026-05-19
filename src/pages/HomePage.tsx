import { Fragment, useMemo } from 'react'
import { HeroSection } from '../components/HeroSection'
import { StatsSection } from '../components/StatsSection'
import { AboutSection } from '../components/AboutSection'
import { ValueChainSection } from '../components/ValueChainSection'
import { ModulesSection } from '../components/ModulesSection'
import { WorkflowCTASection } from '../components/WorkflowCTASection'
import { IndustriesSection } from '../components/IndustriesSection'
import { FAQSection } from '../components/FAQSection'
import { CTASection } from '../components/CTASection'
import { useCms } from '../cms/CmsContext'
import { isSectionVisible, parsePageSections } from '../cms/pageSections'

const MAIN_SET = new Set([
  'hero',
  'stats',
  'about',
  'valueChain',
  'modules',
  'workflow',
  'industries',
  'faqs',
  'cta',
])

export function HomePage() {
  const { data } = useCms()
  const sections = useMemo(() => parsePageSections(data?.pageSections), [data?.pageSections])
  const orderedMain = useMemo(() => sections.filter((s) => MAIN_SET.has(s.id)), [sections])

  const block = (id: string) => {
    switch (id) {
      case 'hero':
        return <HeroSection />
      case 'stats':
        return <StatsSection />
      case 'about':
        return <AboutSection />
      case 'valueChain':
        return <ValueChainSection />
      case 'modules':
        return <ModulesSection />
      case 'workflow':
        return <WorkflowCTASection />
      case 'industries':
        return <IndustriesSection />
      case 'faqs':
        return <FAQSection />
      case 'cta':
        return <CTASection />
      default:
        return null
    }
  }

  return (
    <main>
      {orderedMain.map((s) =>
        isSectionVisible(sections, s.id) ? <Fragment key={s.id}>{block(s.id)}</Fragment> : null,
      )}
    </main>
  )
}
