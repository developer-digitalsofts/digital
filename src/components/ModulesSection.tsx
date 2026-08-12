import { moduleExplorerCards } from '../data/moduleExplorerCards'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { LucideByName } from '../utils/lucideFromName'
import { pageShellClass } from '../ui/pageShell'
import { ScrollReveal } from './ScrollReveal'
import { PremiumFeatureCard } from './PremiumFeatureCard'
import { moduleCardIconStyle } from '../ui/cardIconColors'
import {
  sectionContentTop,
  sectionEyebrow,
  sectionPad,
  sectionSubCenter,
  sectionTitle,
  sectionWhite,
} from '../ui/saas'

type ModItem = {
  id: string
  icon?: string
  accentColor?: string
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
      className={`relative scroll-mt-28 overflow-hidden border-t border-slate-200/50 ${sectionWhite} ${sectionPad}`}
    >
      <div className={`${pageShellClass} relative`}>
        <ScrollReveal className="mx-auto max-w-4xl text-center">
          <p className={`${sectionEyebrow} uppercase`}>{pill}</p>
          <h2 className={`${sectionTitle} mt-2`}>{title}</h2>
          <p className={`${sectionSubCenter} mt-3 max-w-2xl text-slate-600`}>{sub}</p>
        </ScrollReveal>

        <div
          className={`${sectionContentTop} mx-auto grid max-w-[72rem] auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7`}
        >
          {cmsItems.length > 0
            ? cmsItems.map((m, i) => {
                const to = m.href?.trim() || '/'
                const iconStyle = moduleCardIconStyle(to, i)
                const accent = m.accentColor?.trim() || iconStyle.accent
                return (
                  <ScrollReveal key={m.id} delayMs={i * 70}>
                    <PremiumFeatureCard
                      variant="module"
                      title={m.title ? pick(m.title, lang) : ''}
                      description={m.description ? pick(m.description, lang) : ''}
                      exploreLabel={explore}
                      to={to}
                      useCmsLink
                      iconAccentColor={accent}
                      icon={<LucideByName name={m.icon} strokeWidth={2} />}
                    />
                  </ScrollReveal>
                )
              })
            : moduleExplorerCards.map((m, i) => {
                const iconStyle = moduleCardIconStyle(m.slug, i)
                return (
                  <ScrollReveal key={m.slug} delayMs={i * 70}>
                    <PremiumFeatureCard
                      variant="module"
                      title={t(`moduleBlock.card.${m.slug}.title`)}
                      description={t(`moduleBlock.card.${m.slug}.desc`)}
                      exploreLabel={t('moduleBlock.explore')}
                      to={m.to}
                      iconAccentColor={iconStyle.accent}
                      icon={<m.icon strokeWidth={2} aria-hidden />}
                    />
                  </ScrollReveal>
                )
              })}
        </div>
      </div>
    </section>
  )
}
