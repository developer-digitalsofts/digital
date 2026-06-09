import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { industryProgrammeCards } from '../data/industryProgrammeCards'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { LucideByName } from '../utils/lucideFromName'
import { pageShellClass } from '../ui/pageShell'
import { ScrollReveal } from './ScrollReveal'
import { PremiumFeatureCard } from './PremiumFeatureCard'
import { btnSecondary, sectionContentTop, sectionPad, sectionSubCenter, sectionTitle } from '../ui/saas'

const INITIAL_VISIBLE = 6

type IndItem = {
  id: string
  icon?: string
  category?: Bilingual
  title?: Bilingual
  description?: Bilingual
  href?: string
  sortOrder?: number
  active?: boolean
}

type IndCms = {
  title?: Bilingual
  subtitle?: Bilingual
  exploreLabel?: Bilingual
  items?: IndItem[]
}

export function IndustriesSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const block = data?.industries as IndCms | undefined
  const [expanded, setExpanded] = useState(false)

  const title = block?.title ? pick(block.title, lang) : t('industryBlock.title')
  const sub = block?.subtitle ? pick(block.subtitle, lang) : t('industryBlock.sub')
  const explore = block?.exploreLabel ? pick(block.exploreLabel, lang) : t('industryBlock.explore')

  const cmsItems = block?.items
    ? [...block.items]
        .filter((x) => x.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  const allCards = useMemo(() => {
    if (cmsItems.length > 0) {
      return cmsItems.map((item) => ({
        key: item.id,
        title: item.title ? pick(item.title, lang) : '',
        description: item.description ? pick(item.description, lang) : '',
        to: item.href?.trim() || '/',
        eyebrow: item.category ? pick(item.category, lang) : undefined,
        useCmsLink: true as const,
        icon: <LucideByName name={item.icon} strokeWidth={1.75} />,
      }))
    }
    return industryProgrammeCards.map((item) => ({
      key: item.cardKey,
      title: t(`industryBlock.card.${item.cardKey}.title`),
      description: t(`industryBlock.card.${item.cardKey}.desc`),
      to: item.exploreTo,
      eyebrow: t(`industryBlock.card.${item.cardKey}.cat`),
      useCmsLink: false as const,
      icon: <item.icon strokeWidth={1.75} aria-hidden />,
    }))
  }, [cmsItems, lang, t])

  const hasMore = allCards.length > INITIAL_VISIBLE
  const visibleCards = expanded ? allCards : allCards.slice(0, INITIAL_VISIBLE)

  return (
    <section
      id="industries"
      className={`relative scroll-mt-28 overflow-hidden border-y border-slate-200/50 bg-gradient-to-b from-slate-50/50 via-white to-white ${sectionPad}`}
    >
      <div
        className="pointer-events-none absolute right-0 top-0 h-48 w-[min(480px,70%)] rounded-full bg-brand/[0.03] blur-3xl"
        aria-hidden
      />

      <div className={`${pageShellClass} relative`}>
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <h2 className={sectionTitle}>{title}</h2>
          <p className={sectionSubCenter}>{sub}</p>
        </ScrollReveal>

        <div
          className={`${sectionContentTop} grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6`}
        >
          {visibleCards.map((item, i) => (
            <ScrollReveal key={item.key} delayMs={i * 60}>
              <PremiumFeatureCard
                title={item.title}
                description={item.description}
                exploreLabel={explore}
                to={item.to}
                eyebrow={item.eyebrow}
                useCmsLink={item.useCmsLink}
                icon={item.icon}
                variant="industry"
              />
            </ScrollReveal>
          ))}
        </div>

        {hasMore ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className={`${btnSecondary} gap-2`}
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? t('industryBlock.showLess') : t('industryBlock.showMore')}
              <ChevronDown
                className={`size-4 shrink-0 text-brand transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
