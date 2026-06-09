import { Wallet, Boxes, CreditCard, Users, BarChart3 } from 'lucide-react'
import { DashboardMockup } from './DashboardMockup'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { CmsLink } from './CmsLink'
import { LucideByName } from '../utils/lucideFromName'
import { pageShellClass } from '../ui/pageShell'
import {
  badgePill,
  btnPrimary,
  btnSecondary,
  heroBody,
  heroMockupWrap,
  heroPad,
  heroSection,
  heroSub,
  heroTitle,
  iconGlyph,
} from '../ui/saas'

const fallbackBadges = [
  { icon: Wallet, labelKey: 'badgeAccounts' as const },
  { icon: Boxes, labelKey: 'badgeInventory' as const },
  { icon: CreditCard, labelKey: 'badgePos' as const },
  { icon: Users, labelKey: 'badgePayroll' as const },
  { icon: BarChart3, labelKey: 'badgeReports' as const },
]

type HeroCms = {
  title?: Bilingual
  sub?: Bilingual
  body?: Bilingual
  ctaPrimary?: { label?: Bilingual; href?: string }
  ctaSecondary?: { label?: Bilingual; href?: string }
  mockupImageUrl?: string
  badges?: { id: string; icon?: string; label?: Bilingual; sortOrder?: number; active?: boolean }[]
}

export function HeroSection() {
  const { t, lang } = useI18n()
  const { data, loading } = useCms()
  const hero = data?.hero as HeroCms | undefined

  const title = hero?.title ? pick(hero.title, lang) : t('hero.title')
  const sub = hero?.sub ? pick(hero.sub, lang) : t('hero.sub')
  const body = hero?.body ? pick(hero.body, lang) : t('hero.body')
  const cta1 = hero?.ctaPrimary?.label ? pick(hero.ctaPrimary.label, lang) : t('hero.ctaDemo')
  const cta1Href = hero?.ctaPrimary?.href?.trim() || '/contact'
  const cta2 = hero?.ctaSecondary?.label ? pick(hero.ctaSecondary.label, lang) : t('hero.ctaContact')
  const cta2Href = hero?.ctaSecondary?.href?.trim() || '/#modules'

  const cmsBadges = hero?.badges
    ? [...hero.badges]
        .filter((b) => b.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  return (
    <section id="home" className={`${heroSection} ${heroPad}`} aria-busy={loading && !data}>
      <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-55" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(340px,48vh)] bg-[radial-gradient(ellipse_100%_70%_at_50%_-12%,rgba(244,124,77,0.08),transparent_65%)]"
        aria-hidden
      />

      <div
        className={`${pageShellClass} relative grid items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:gap-14 xl:gap-16`}
      >
        <div className="animate-fade-up order-1 min-w-0 text-center lg:order-none lg:text-left">
          <h1
            className={`${heroTitle} lg:max-w-[16ch] ${loading && !data ? 'animate-pulse text-slate-400' : ''}`}
          >
            {title}
          </h1>
          <p className={`${heroSub} lg:max-w-xl`}>{sub}</p>
          <p className={heroBody}>{body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 lg:justify-start">
            <CmsLink to={cta1Href} className={`min-w-[10.5rem] ${btnPrimary}`}>
              {cta1}
            </CmsLink>
            <CmsLink to={cta2Href} className={`min-w-[10.5rem] ${btnSecondary}`}>
              {cta2}
            </CmsLink>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {cmsBadges.length > 0
              ? cmsBadges.map((b) => (
                  <span key={b.id} className={badgePill}>
                    <LucideByName name={b.icon} className={`size-3.5 shrink-0 sm:size-4 ${iconGlyph}`} strokeWidth={1.75} />
                    {b.label ? pick(b.label, lang) : ''}
                  </span>
                ))
              : fallbackBadges.map(({ icon: Icon, labelKey }) => (
                  <span key={labelKey} className={badgePill}>
                    <Icon className={`size-3.5 shrink-0 sm:size-4 ${iconGlyph}`} strokeWidth={1.75} aria-hidden />
                    {t(`hero.${labelKey}`)}
                  </span>
                ))}
          </div>
        </div>

        <div
          className={`animate-fade-up-delayed order-2 mx-auto w-full min-w-0 max-w-[min(100%,34rem)] sm:max-w-2xl lg:order-none lg:mx-0 lg:max-w-none lg:scale-[1.06] lg:origin-center ${heroMockupWrap}`}
        >
          <div className="hero-mockup-float hero-mockup-frame relative z-[1]">
            <div className="overflow-hidden rounded-[calc(1rem-1px)] bg-white">
              {hero?.mockupImageUrl?.trim() ? (
                <img
                  src={hero.mockupImageUrl.startsWith('http') ? hero.mockupImageUrl : hero.mockupImageUrl}
                  alt=""
                  className="mx-auto w-full"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <DashboardMockup frameClassName="border-0 shadow-none ring-0 rounded-none" premium />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
