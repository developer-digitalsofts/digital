import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { LucideByName } from '../utils/lucideFromName'
import { ScrollReveal } from './ScrollReveal'
import { EnterpriseIconCard } from './EnterpriseIconCard'
import { pageShellClass } from '../ui/pageShell'
import { sectionContentTop, sectionMuted, sectionPad, sectionSubCenter, sectionTitle } from '../ui/saas'
import { valueChainCardIconStyle } from '../ui/cardIconColors'

import {
  Activity,
  BookOpen,
  LineChart,
  Package,
  ShoppingBag,
  Users,
} from 'lucide-react'

const fallbackCards = [
  { icon: Activity, n: 1 },
  { icon: BookOpen, n: 2 },
  { icon: ShoppingBag, n: 3 },
  { icon: Users, n: 4 },
  { icon: Package, n: 5 },
  { icon: LineChart, n: 6 },
] as const

type VcCard = {
  id: string
  icon?: string
  accentColor?: string
  title?: Bilingual
  description?: Bilingual
  sortOrder?: number
  active?: boolean
}

type VcCms = {
  title?: Bilingual
  subtitle?: Bilingual
  cards?: VcCard[]
}

export function ValueChainSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const vc = data?.valueChain as VcCms | undefined

  const title = vc?.title ? pick(vc.title, lang) : t('valueChain.title')
  const sub = vc?.subtitle ? pick(vc.subtitle, lang) : t('valueChain.sub')

  const cmsCards = vc?.cards
    ? [...vc.cards]
        .filter((c) => c.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  return (
    <section className={`${sectionMuted} ${sectionPad}`}>
      <div className={pageShellClass}>
        <ScrollReveal>
          <h2 className={`${sectionTitle} mx-auto max-w-4xl`}>{title}</h2>
          <p className={sectionSubCenter}>{sub}</p>
        </ScrollReveal>
        <div
          className={`${sectionContentTop} grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6`}
        >
          {cmsCards.length > 0
            ? cmsCards.map((c, i) => {
                const iconStyle = valueChainCardIconStyle(i)
                const accent = c.accentColor?.trim() || iconStyle.accent
                return (
                  <ScrollReveal key={c.id} delayMs={i * 80}>
                    <EnterpriseIconCard
                      title={c.title ? pick(c.title, lang) : ''}
                      description={c.description ? pick(c.description, lang) : ''}
                      iconAccentColor={accent}
                      icon={<LucideByName name={c.icon} strokeWidth={2} aria-hidden />}
                    />
                  </ScrollReveal>
                )
              })
            : fallbackCards.map((c, i) => {
                const iconStyle = valueChainCardIconStyle(i)
                return (
                  <ScrollReveal key={c.n} delayMs={i * 80}>
                    <EnterpriseIconCard
                      title={t(`valueChain.c${c.n}t`)}
                      description={t(`valueChain.c${c.n}d`)}
                      iconAccentColor={iconStyle.accent}
                      icon={<c.icon strokeWidth={2} aria-hidden />}
                    />
                  </ScrollReveal>
                )
              })}
        </div>
      </div>
    </section>
  )
}
