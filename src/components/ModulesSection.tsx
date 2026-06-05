import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { moduleExplorerCards } from '../data/moduleExplorerCards'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { LucideByName } from '../utils/lucideFromName'
import { CmsLink } from './CmsLink'
import { pageShellClass } from '../ui/pageShell'
import { ScrollReveal } from './ScrollReveal'
import {
  badgePill,
  cardDesc,
  cardFooter,
  cardTitle,
  iconBox,
  iconGlyph,
  linkAccent,
  moduleCard,
  sectionContentTop,
  sectionPad,
  sectionSubCenter,
  sectionTitle,
  sectionWhite,
} from '../ui/saas'

type ModItem = {
  id: string
  icon?: string
  badge?: Bilingual
  title?: Bilingual
  description?: Bilingual
  href?: string
  sortOrder?: number
  active?: boolean
}

type ModulesCms = {
  pill?: Bilingual
  title?: Bilingual
  subtitle?: Bilingual
  exploreLabel?: Bilingual
  items?: ModItem[]
}

export function ModulesSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const block = data?.modules as ModulesCms | undefined

  const pill = block?.pill ? pick(block.pill, lang) : t('moduleBlock.pill')
  const title = block?.title ? pick(block.title, lang) : t('moduleBlock.title')
  const sub = block?.subtitle ? pick(block.subtitle, lang) : t('moduleBlock.sub')
  const explore = block?.exploreLabel ? pick(block.exploreLabel, lang) : t('moduleBlock.explore')

  const cmsItems = block?.items
    ? [...block.items]
        .filter((m) => m.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  return (
    <section
      id="modules"
      className={`relative scroll-mt-28 overflow-hidden ${sectionWhite} ${sectionPad}`}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-[min(720px,100%)] -translate-x-1/2 rounded-full bg-brand/[0.035] blur-3xl"
        aria-hidden
      />

      <div className={`${pageShellClass} relative`}>
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <p className={badgePill}>
            <Sparkles className={`size-3.5 ${iconGlyph}`} strokeWidth={2} aria-hidden />
            {pill}
          </p>
          <h2 className={`${sectionTitle} mt-2.5`}>{title}</h2>
          <p className={`${sectionSubCenter} text-slate-600`}>{sub}</p>
        </ScrollReveal>

        <div className={`${sectionContentTop} grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5`}>
          {cmsItems.length > 0
            ? cmsItems.map((m, i) => {
                const to = m.href?.trim() || '/'
                const badgeText = m.badge ? pick(m.badge, lang) : ''
                return (
                  <ScrollReveal key={m.id} delayMs={i * 70}>
                  <article className={moduleCard}>
                    <div className="relative flex items-start justify-between gap-3">
                      <span className={iconBox}>
                        <LucideByName name={m.icon} className={iconGlyph} strokeWidth={2} />
                      </span>
                      {badgeText ? (
                        <span className="rounded-full border border-brand/15 bg-brand/[0.06] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-dark">
                          {badgeText}
                        </span>
                      ) : null}
                    </div>

                    <h3 className={`${cardTitle} mt-4`}>{m.title ? pick(m.title, lang) : ''}</h3>
                    <p className={cardDesc}>{m.description ? pick(m.description, lang) : ''}</p>

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
            : moduleExplorerCards.map((m, i) => (
                <ScrollReveal key={m.slug} delayMs={i * 70}>
                <article className={moduleCard}>
                  <div className="relative flex items-start justify-between gap-3">
                    <span className={iconBox}>
                      <m.icon className={iconGlyph} strokeWidth={2} aria-hidden />
                    </span>
                    <span className="rounded-full border border-brand/15 bg-brand/[0.06] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-dark">
                      {m.badge === 'core' ? t('moduleBlock.badgeCore') : t('moduleBlock.badgePopular')}
                    </span>
                  </div>

                  <h3 className={`${cardTitle} mt-4`}>{t(`moduleBlock.card.${m.slug}.title`)}</h3>
                  <p className={cardDesc}>{t(`moduleBlock.card.${m.slug}.desc`)}</p>

                  <div className={cardFooter}>
                    <Link to={m.to} className={linkAccent}>
                      {t('moduleBlock.explore')}
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
