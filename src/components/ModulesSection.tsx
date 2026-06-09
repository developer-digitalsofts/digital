import { Sparkles } from 'lucide-react'
import { moduleExplorerCards } from '../data/moduleExplorerCards'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { LucideByName } from '../utils/lucideFromName'
import { pageShellClass } from '../ui/pageShell'
import { ScrollReveal } from './ScrollReveal'
import { PremiumFeatureCard } from './PremiumFeatureCard'
import {
  badgePill,
  iconGlyph,
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

        <div
          className={`${sectionContentTop} mx-auto grid max-w-[72rem] auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6`}
        >
          {cmsItems.length > 0
            ? cmsItems.map((m, i) => {
                const to = m.href?.trim() || '/'
                const badgeText = m.badge ? pick(m.badge, lang) : ''
                return (
                  <ScrollReveal key={m.id} delayMs={i * 70}>
                    <PremiumFeatureCard
                      title={m.title ? pick(m.title, lang) : ''}
                      description={m.description ? pick(m.description, lang) : ''}
                      exploreLabel={explore}
                      to={to}
                      eyebrow={badgeText || undefined}
                      useCmsLink
                      icon={<LucideByName name={m.icon} strokeWidth={1.75} />}
                    />
                  </ScrollReveal>
                )
              })
            : moduleExplorerCards.map((m, i) => (
                <ScrollReveal key={m.slug} delayMs={i * 70}>
                  <PremiumFeatureCard
                    title={t(`moduleBlock.card.${m.slug}.title`)}
                    description={t(`moduleBlock.card.${m.slug}.desc`)}
                    exploreLabel={t('moduleBlock.explore')}
                    to={m.to}
                    eyebrow={
                      m.badge === 'core' ? t('moduleBlock.badgeCore') : t('moduleBlock.badgePopular')
                    }
                    icon={<m.icon strokeWidth={1.75} aria-hidden />}
                  />
                </ScrollReveal>
              ))}
        </div>
      </div>
    </section>
  )
}
