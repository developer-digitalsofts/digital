import { Cloud, GitBranch, Shield } from 'lucide-react'
import { DashboardMockup } from './DashboardMockup'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { CmsLink } from './CmsLink'
import { LucideByName } from '../utils/lucideFromName'
import { resolvePublicMediaUrl } from '../cms/publicMediaUrl'
import { pageShellClass } from '../ui/pageShell'
import {
  btnPrimary,
  btnSecondary,
  heroBody,
  heroMockupPanel,
  heroMockupWrap,
  heroPad,
  heroSection,
  heroTitle,
} from '../ui/saas'

const heroCtaPrimary = `${btnPrimary} min-w-[10.5rem]`

const heroCtaSecondary = `${btnSecondary} min-w-[10.5rem] !border-brand/70 hover:!border-brand hover:bg-brand/[0.04] hover:text-slate-900`

const trustKeys = ['secureCloud', 'gcc', 'reporting'] as const

const trustIcons = {
  secureCloud: Shield,
  gcc: Cloud,
  reporting: GitBranch,
} as const

type TrustPoint = {
  id: string
  icon?: string
  label?: Bilingual
  sortOrder?: number
  active?: boolean
}

type HeroCms = {
  title?: Bilingual
  titleBefore?: Bilingual
  titleAccent?: Bilingual
  titleLine2?: Bilingual
  pill?: Bilingual
  useStructuredTitle?: boolean
  showPill?: boolean
  showTrustPoints?: boolean
  body?: Bilingual
  ctaPrimary?: { label?: Bilingual; href?: string }
  ctaSecondary?: { label?: Bilingual; href?: string }
  mockupImageUrl?: string
  trustPoints?: TrustPoint[]
}

export function HeroSection() {
  const { t, lang } = useI18n()
  const { data, loading } = useCms()
  const hero = data?.hero as HeroCms | undefined

  const hasStructured =
    hero?.useStructuredTitle === true ||
    Boolean(hero?.titleBefore?.en || hero?.titleAccent?.en || hero?.titleLine2?.en)

  const title = hero?.title ? pick(hero.title, lang) : t('hero.title')
  const body = hero?.body ? pick(hero.body, lang) : t('hero.body')
  const cta1 = hero?.ctaPrimary?.label ? pick(hero.ctaPrimary.label, lang) : t('hero.ctaDemo')
  const cta1Href = hero?.ctaPrimary?.href?.trim() || '/contact'
  const cta2 = hero?.ctaSecondary?.label ? pick(hero.ctaSecondary.label, lang) : t('hero.ctaContact')
  const cta2Href = hero?.ctaSecondary?.href?.trim() || '/#modules'

  const showPill = hero?.showPill !== false && (Boolean(hero?.pill) || !hero?.title || hasStructured)
  const pillText = hero?.pill ? pick(hero.pill, lang) : t('hero.pill')

  const cmsTrust = (hero?.trustPoints || [])
    .filter((p) => p.active !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  const showTrust = hero?.showTrustPoints !== false && (cmsTrust.length > 0 || hasStructured || !hero?.title)

  const mockupSrc = resolvePublicMediaUrl(hero?.mockupImageUrl)

  return (
    <section id="home" className={`${heroSection} ${heroPad}`} aria-busy={loading && !data}>
      <div className="hero-grid-bg pointer-events-none absolute inset-0 opacity-[0.28]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(400px,52vh)] bg-[radial-gradient(ellipse_90%_70%_at_50%_-8%,rgba(148,163,184,0.05),transparent_70%)]"
        aria-hidden
      />

      <div
        className={`${pageShellClass} relative grid items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10 xl:gap-12`}
      >
        <div className="animate-fade-up order-1 min-w-0 text-center lg:order-none lg:text-left">
          {showPill ? (
            <p className="inline-flex items-center rounded-full border border-brand/20 bg-brand/[0.06] px-3.5 py-1 text-[11px] font-semibold tracking-wide text-brand-dark sm:text-xs">
              {pillText}
            </p>
          ) : null}

          <h1
            className={`${heroTitle} ${showPill ? 'mt-4 sm:mt-5' : ''} ${
              loading && !data ? 'animate-pulse text-slate-400' : ''
            }`}
          >
            {hasStructured ? (
              <>
                <span className="block">
                  {hero?.titleBefore ? pick(hero.titleBefore, lang) : t('hero.titleBefore')}
                  <span className="text-brand">
                    {hero?.titleAccent ? pick(hero.titleAccent, lang) : t('hero.titleAccent')}
                  </span>
                </span>
                <span className="mt-2.5 block text-[0.86em] font-bold leading-[1.16] text-slate-900 sm:mt-3 sm:leading-[1.14]">
                  {hero?.titleLine2 ? pick(hero.titleLine2, lang) : t('hero.titleLine2')}
                </span>
              </>
            ) : (
              title
            )}
          </h1>

          <p className={heroBody}>{body}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:mt-9 sm:gap-4 lg:justify-start">
            <CmsLink to={cta1Href} className={heroCtaPrimary}>
              {cta1}
            </CmsLink>
            <CmsLink to={cta2Href} className={heroCtaSecondary}>
              {cta2}
            </CmsLink>
          </div>

          {showTrust ? (
            <ul className="mt-7 flex flex-col items-center gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2 lg:items-start lg:justify-start">
              {cmsTrust.length > 0
                ? cmsTrust.map((p) => (
                    <li
                      key={p.id}
                      className="inline-flex items-center gap-2 text-[13px] font-medium leading-snug text-slate-700 sm:text-sm"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/[0.05] text-brand">
                        <LucideByName name={p.icon || 'Shield'} className="size-3.5" strokeWidth={2.25} />
                      </span>
                      {p.label ? pick(p.label, lang) : ''}
                    </li>
                  ))
                : trustKeys.map((key) => {
                    const Icon = trustIcons[key]
                    return (
                      <li
                        key={key}
                        className="inline-flex items-center gap-2 text-[13px] font-medium leading-snug text-slate-700 sm:text-sm"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/[0.05] text-brand">
                          <Icon className="size-3.5" strokeWidth={2.25} aria-hidden />
                        </span>
                        {t(`hero.features.${key}`)}
                      </li>
                    )
                  })}
            </ul>
          ) : null}
        </div>

        <div
          className={`animate-fade-up-delayed relative order-2 mx-auto w-full min-w-0 max-w-[min(100%,41rem)] sm:max-w-[39rem] lg:order-none lg:ms-auto lg:me-0 lg:max-w-[37rem] xl:max-w-[39.5rem] ${heroMockupWrap}`}
        >
          <div className={`${heroMockupPanel} relative`}>
            <div className="hero-mockup-frame relative overflow-hidden">
              {mockupSrc ? (
                <img
                  src={mockupSrc}
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
