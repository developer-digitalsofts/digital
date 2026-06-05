import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { industryProgrammeCards } from '../data/industryProgrammeCards'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { LucideByName } from '../utils/lucideFromName'
import { CmsLink } from './CmsLink'
import { pageShellClass } from '../ui/pageShell'
import { ScrollReveal } from './ScrollReveal'
import {
  cardDesc,
  cardFooter,
  cardTitle,
  iconBox,
  iconGlyph,
  industryCard,
  linkAccent,
  sectionMuted,
  sectionContentTop,
  sectionPadCompact,
  sectionSubCenter,
  sectionTitle,
} from '../ui/saas'

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

  const title = block?.title ? pick(block.title, lang) : t('industryBlock.title')
  const sub = block?.subtitle ? pick(block.subtitle, lang) : t('industryBlock.sub')
  const explore = block?.exploreLabel ? pick(block.exploreLabel, lang) : t('industryBlock.explore')

  const cmsItems = block?.items
    ? [...block.items]
        .filter((x) => x.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  return (
    <section id="industries" className={`relative scroll-mt-28 ${sectionMuted} ${sectionPadCompact}`}>
      <div className={pageShellClass}>
        <ScrollReveal>
          <h2 className={`${sectionTitle} mx-auto max-w-4xl`}>{title}</h2>
          <p className={sectionSubCenter}>{sub}</p>
        </ScrollReveal>

        <div
          className={`${sectionContentTop} grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5`}
        >
          {cmsItems.length > 0
            ? cmsItems.map((item, i) => {
                const to = item.href?.trim() || '/'
                return (
                  <ScrollReveal key={item.id} delayMs={i * 90}>
                    <article className={industryCard}>
                      <div className="flex items-start gap-3">
                        <div className={iconBox}>
                          <LucideByName name={item.icon} className={iconGlyph} strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          {item.category ? (
                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                              {pick(item.category, lang)}
                            </p>
                          ) : null}
                          <h3 className={`${cardTitle} ${item.category ? 'mt-0.5' : ''}`}>
                            {item.title ? pick(item.title, lang) : ''}
                          </h3>
                        </div>
                      </div>
                      <p className={cardDesc}>{item.description ? pick(item.description, lang) : ''}</p>
                      <div className={cardFooter}>
                        <CmsLink to={to} className={linkAccent}>
                          {explore}
                          <ArrowUpRight className="size-4" aria-hidden />
                        </CmsLink>
                      </div>
                    </article>
                  </ScrollReveal>
                )
              })
            : industryProgrammeCards.map((item, i) => (
                <ScrollReveal key={item.cardKey} delayMs={i * 90}>
                  <article className={industryCard}>
                    <div className="flex items-start gap-3">
                      <div className={iconBox}>
                        <item.icon className={iconGlyph} strokeWidth={2} aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                          {t(`industryBlock.card.${item.cardKey}.cat`)}
                        </p>
                        <h3 className={`${cardTitle} mt-0.5`}>
                          {t(`industryBlock.card.${item.cardKey}.title`)}
                        </h3>
                      </div>
                    </div>
                    <p className={cardDesc}>{t(`industryBlock.card.${item.cardKey}.desc`)}</p>
                    <div className={cardFooter}>
                      <Link to={item.exploreTo} className={linkAccent}>
                        {t('industryBlock.explore')}
                        <ArrowUpRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  )
}
