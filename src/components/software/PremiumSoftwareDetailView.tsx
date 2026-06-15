import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import type { SoftwareDetailPageData } from '../../data/softwareDetail/types'
import { getPremiumPhotoPaths } from '../../data/softwareDetail/premiumImagePacks'
import {
  PremiumDashboardPhoto,
  PremiumFinancialReportsPhoto,
  PremiumHeroPhoto,
  PremiumLedgerOfficePhoto,
  PremiumTeamMeetingPhoto,
} from './PremiumSoftwarePhotos'
import { pageShellClass } from '../../ui/pageShell'
import { SoftwareColorIcon, detailCardAccentStyle } from '../SoftwareColorIcon'
import { detailCardIconAccent, isModuleSlug, softwarePageIconName } from '../../ui/cardIconColors'
import { cardDesc, cardFlat, cardInteractive, cardTitle, detailCardStatic } from '../../ui/saas'
import { WHATSAPP_URL } from '../../constants'
import { CmsLink } from '../CmsLink'
import { SoftwareDemoCtaSection } from './SoftwareDemoCtaSection'
import { useDetailPageInquiry } from './useDetailPageInquiry'

function IconByName({ name, className }: { name: string; className?: string }) {
  const Cmp =
    (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Circle
  return <Cmp className={className} aria-hidden />
}

const DETAIL_FEATURE_CARD = `${cardFlat} card-accent-hover flex h-full flex-col p-6 transition-[border-color,transform] hover:-translate-y-px`
const DETAIL_INNER_CARD = `${cardFlat} bg-white`
const DETAIL_PANEL_CARD = `${detailCardStatic} bg-white`

type Props = {
  detail: SoftwareDetailPageData
  displayName: string
  crumbMid: string
  crumbHome: string
  slug: string
  showBreadcrumb?: boolean
}

function HeroSecondaryCta({ label, to }: { label: string; to: string }) {
  const className =
    'inline-flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand'
  if (to.startsWith('http')) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }
  return (
    <CmsLink to={to} className={className}>
      {label}
    </CmsLink>
  )
}

export function PremiumSoftwareDetailView({
  detail,
  displayName,
  crumbMid,
  crumbHome,
  slug,
  showBreadcrumb = true,
}: Props) {
  const { lang, t } = useI18n()
  const cfg = detail.accounts ?? detail.premiumLayout
  const uid = useId()
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight
  const [tab, setTab] = useState(0)
  const { demoEmail, setDemoEmail, submitStatus, onSubmit: onDemoSubmit } = useDetailPageInquiry(
    displayName,
    slug,
  )

  const photoPaths = useMemo(() => getPremiumPhotoPaths(slug), [slug])
  const heroImageOverride = detail.heroImageUrl?.trim() || undefined
  const productLabel = useMemo(
    () => displayName.replace(/\s+Software$/i, '').replace(/\s+ERP$/i, '').trim() || displayName,
    [displayName],
  )
  const pageKind = useMemo(() => (isModuleSlug(slug) ? ('module' as const) : ('industry' as const)), [slug])
  const pageHeroIcon = useMemo(() => softwarePageIconName(slug, pageKind), [slug, pageKind])

  useEffect(() => {
    document.title = detail.metaTitle
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', detail.metaDescription)
    return () => {
      document.title = 'DigitalManager'
    }
  }, [detail.metaTitle, detail.metaDescription])

  if (!cfg) {
    return null
  }

  const tabs = detail.vouchersReports.tabs
  const activeTab = tabs[tab] ?? tabs[0]

  const chips = cfg.heroChips ?? []
  const isAccountsPage = cfg.layout === 'accounts-management'

  if (isAccountsPage) {
    const introParagraphs = detail.hero.intro
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
    const transactionTab = tabs.find((tb) => tb.id === 'transactions') ?? tabs[0]
    const reportingTab = tabs.find((tb) => tb.id === 'reporting') ?? tabs[1] ?? tabs[0]
    const ui =
      lang === 'ar'
        ? {
            problem: 'المشكلة',
            transactions: 'المعاملات',
            reporting: 'التقارير',
            solutionLabel: 'الحل',
            included: 'ما يشمله النظام',
            insights: 'تقارير وإشارات',
            industries: 'قطاعات مدعومة',
            faqHint: 'أسئلة عملية عن إدارة الحسابات السحابية.',
          }
        : {
            problem: 'Problem statement',
            transactions: 'Transactions',
            reporting: 'Reporting',
            solutionLabel: 'Solution',
            included: 'What is included',
            insights: 'Reports & insights',
            industries: 'Industries served',
            faqHint: 'Practical questions about cloud accounting operations.',
          }

    return (
      <main className="border-t border-slate-100 bg-white">
        <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-[#f8fafc] via-white to-[#fff7f3]">
          <div className="pointer-events-none absolute -left-28 top-16 size-72 rounded-full bg-brand/10 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-24 bottom-0 size-80 rounded-full bg-amber-200/25 blur-3xl" aria-hidden />

          <div className={`${pageShellClass} relative py-10 md:py-14 lg:py-16`}>
            {showBreadcrumb ? (
              <nav className="mb-8 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
                <Link to="/" className="hover:text-brand">
                  {crumbHome}
                </Link>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-700">{crumbMid}</span>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-900">{displayName}</span>
              </nav>
            ) : null}

            <div className="grid gap-9 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:items-center lg:gap-12">
              <div>
                <SoftwareColorIcon icon={pageHeroIcon} slug={slug} kind={pageKind} className="mb-4" />
                <p className="inline-flex rounded-full border border-brand/15 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  {detail.hero.eyebrow}
                </p>
                <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
                  {detail.hero.headline}
                </h1>
                <p className="mt-4 max-w-2xl text-lg font-semibold leading-snug text-slate-800 md:text-xl">
                  {detail.hero.subhead}
                </p>
                <div className="mt-4 max-w-2xl space-y-3 text-sm leading-[1.75] text-slate-600 md:text-base">
                  {introParagraphs.slice(0, 2).map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <CmsLink
                    to={detail.hero.ctaPrimary.to}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-brand-dark"
                  >
                    {detail.hero.ctaPrimary.label}
                    <ChevronFwd className="size-4" aria-hidden />
                  </CmsLink>
                  <HeroSecondaryCta label={detail.hero.ctaSecondary.label} to={detail.hero.ctaSecondary.to} />
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xl lg:mx-0">
                <PremiumHeroPhoto paths={photoPaths} productLabel={productLabel} overrideSrc={heroImageOverride} />
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {detail.hero.trust.map((stat, statIdx) => (
                <article
                  key={stat.label}
                  className={`card-accent-hover rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white p-5 text-center transition-[border-color,transform] hover:-translate-y-px`}
                  style={detailCardAccentStyle(statIdx)}
                >
                  {stat.icon ? (
                    <SoftwareColorIcon
                      icon={stat.icon}
                      paletteIndex={statIdx}
                      className="mx-auto mb-3"
                    />
                  ) : null}
                  <p className="font-heading text-xl font-bold text-slate-950 md:text-2xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium leading-snug text-slate-600">{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-white py-10 md:py-14">
          <div className={pageShellClass}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">{ui.included}</p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                {cfg.featuresHeading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{cfg.featuresLead}</p>
            </div>
            <div className="mt-8 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {detail.features.slice(0, 6).map((feature, featIdx) => (
                <article key={feature.title} className={DETAIL_FEATURE_CARD} style={detailCardAccentStyle(featIdx)}>
                  <SoftwareColorIcon icon={feature.icon} paletteIndex={featIdx} />
                  <h3 className={`${cardTitle} mt-5 line-clamp-2`}>{feature.title}</h3>
                  <p className={`${cardDesc} line-clamp-3`}>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white py-10 md:py-14">
          <div className={pageShellClass}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">{cfg.vouchersSectionEyebrow}</p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                {detail.vouchersReports.heading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{detail.vouchersReports.subheading}</p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <article className={DETAIL_PANEL_CARD}>
                <div className="flex items-center gap-4">
                  <SoftwareColorIcon icon="AlertTriangle" paletteIndex={0} className="shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">{ui.problem}</p>
                    <h3 className="font-heading text-lg font-bold text-slate-950">{cfg.challengesHeading}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{cfg.challengesIntro}</p>
                <ul className="mt-5 space-y-2.5">
                  {cfg.challengeBullets.slice(0, 6).map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-snug text-slate-700">
                      <IconByName name="CheckCircle2" className="mt-0.5 size-4 shrink-0 text-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className={DETAIL_PANEL_CARD}>
                <div className="flex items-center gap-4">
                  <SoftwareColorIcon icon="ReceiptText" paletteIndex={1} className="shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">{ui.transactions}</p>
                    <h3 className="font-heading text-lg font-bold text-slate-950">{transactionTab.title}</h3>
                  </div>
                </div>
                <ul className="mt-5 grid gap-2">
                  {transactionTab.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-start gap-2.5 rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white px-3 py-2 text-sm font-medium text-slate-800"
                    >
                      <FileText className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className={DETAIL_PANEL_CARD}>
                <div className="flex items-center gap-4">
                  <SoftwareColorIcon icon="BarChart3" paletteIndex={2} className="shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">{ui.reporting}</p>
                    <h3 className="font-heading text-lg font-bold text-slate-950">{reportingTab.title}</h3>
                  </div>
                </div>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                  {reportingTab.items.map((item) => (
                    <li key={item.name}>
                      <details className="group overflow-hidden rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white transition-[border-color] hover:border-brand/35 open:border-brand/35">
                        <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold leading-snug text-slate-900 [&::-webkit-details-marker]:hidden">
                          <span className="min-w-0 flex-1">{item.name}</span>
                          {item.description ? (
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors group-open:border-brand/20 group-open:bg-brand/10 group-open:text-brand">
                              <ChevronFwd className="size-3.5 transition-transform group-open:rotate-90" aria-hidden />
                            </span>
                          ) : null}
                        </summary>
                        {item.description ? (
                          <div className="border-t border-slate-100 bg-white/70 px-3 pb-3 pt-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand/80">
                              Scope
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
                          </div>
                        ) : null}
                      </details>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <div className={`mt-5 ${DETAIL_INNER_CARD} p-5 md:p-6`}>
              <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">{ui.solutionLabel}</p>
                  <h3 className="mt-1 font-heading text-xl font-bold text-emerald-950">{cfg.solutionHeading}</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {cfg.solutionParagraphs.map((para) => (
                    <p key={para} className={`${DETAIL_INNER_CARD} px-4 py-3 text-sm leading-relaxed text-slate-700`}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {detail.whyChoose.points.length > 0 ? (
          <section className="border-b border-slate-100 bg-white py-10 md:py-14">
            <div className={pageShellClass}>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">{ui.included}</p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                  {detail.whyChoose.heading}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{detail.whyChoose.intro}</p>
              </div>

              <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <div className="self-center">
                  <div className="grid gap-3">
                    {detail.whyChoose.points.map((point, idx) => (
                      <article
                        key={`${point.title}-${idx}`}
                        className="card-accent-hover rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white p-4 transition-[border-color,transform] hover:-translate-y-px"
                        style={detailCardAccentStyle(idx)}
                      >
                        <span
                          className="inline-flex size-7 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: detailCardIconAccent(idx) }}
                          aria-hidden
                        >
                          {idx + 1}
                        </span>
                        <h3 className="mt-2 font-heading text-base font-bold text-slate-950">{point.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{point.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="self-center">
                  <PremiumTeamMeetingPhoto paths={photoPaths} productLabel={productLabel} />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {detail.realtimeReports.bullets.length > 0 ? (
          <section className="border-b border-slate-100 bg-slate-50/70 py-10 md:py-14">
            <div className={pageShellClass}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <PremiumFinancialReportsPhoto paths={photoPaths} productLabel={productLabel} />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">{ui.insights}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                    {detail.realtimeReports.heading}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{detail.realtimeReports.intro}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {detail.realtimeReports.bullets.map((bullet, bulletIdx) => (
                      <article
                        key={bullet.title}
                        className="card-accent-hover rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white p-4 transition-[border-color,transform] hover:-translate-y-px"
                        style={detailCardAccentStyle(bulletIdx)}
                      >
                        <span
                          className="inline-flex size-2 rounded-full"
                          style={{ backgroundColor: detailCardIconAccent(bulletIdx) }}
                          aria-hidden
                        />
                        <h3 className="mt-2 font-heading text-sm font-bold text-slate-950">{bullet.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{bullet.text}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {cfg.industriesSection.items.length > 0 ? (
          <section className="border-b border-slate-100 bg-white py-10 md:py-14">
            <div className={pageShellClass}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">{ui.industries}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                    {cfg.industriesSection.heading}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{cfg.industriesSection.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {cfg.industriesSection.items.map((item) => (
                      <CmsLink
                        key={item.label}
                        to={item.to}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand"
                      >
                        {item.label}
                      </CmsLink>
                    ))}
                  </div>
                  <p className="mt-6 rounded-xl border border-dashed border-brand/40 bg-brand/5 px-4 py-3 text-sm font-medium text-slate-800">
                    {cfg.industriesSection.note}
                  </p>
                </div>
                <PremiumDashboardPhoto paths={photoPaths} productLabel={productLabel} />
              </div>
            </div>
          </section>
        ) : null}

        {detail.implementation.length > 0 ? (
          <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white py-10 md:py-14">
            <div className={pageShellClass}>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                  {cfg.implementationSectionTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{cfg.implementationSectionLead}</p>
              </div>
              <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {detail.implementation.map((step, idx) => (
                  <li
                    key={step.title}
                    className={`${cardFlat} card-accent-hover p-6 transition-[border-color,transform] hover:-translate-y-px`}
                    style={detailCardAccentStyle(idx)}
                  >
                    <SoftwareColorIcon icon={step.icon} paletteIndex={idx} className="mb-5" />
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {t('softwareDetail.stepLabel')} {idx + 1}
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        <SoftwareDemoCtaSection
          uid={uid}
          heading={detail.demoCta.heading}
          sub={detail.demoCta.sub}
          whatsappHref={detail.demoCta.whatsappHref ?? WHATSAPP_URL}
          whatsappLabel={detail.demoCta.whatsappLabel}
          sendLabel={cfg.demoSendButtonLabel}
          demoEmail={demoEmail}
          setDemoEmail={setDemoEmail}
          onSubmit={onDemoSubmit}
          submitStatus={submitStatus}
        />

        {detail.seoBlocks.length > 0 ? (
          <section className="border-b border-slate-100 bg-white py-10 md:py-16">
            <div className={pageShellClass}>
              <div className="space-y-12">
                {detail.seoBlocks.map((block, idx) => {
                  const Tag = block.level === 2 ? 'h2' : 'h3'
                  const visual =
                    idx % 2 === 0 ? (
                      <PremiumLedgerOfficePhoto paths={photoPaths} productLabel={productLabel} />
                    ) : (
                      <PremiumDashboardPhoto paths={photoPaths} productLabel={productLabel} />
                    )
                  return (
                    <article
                      key={block.heading}
                      className="space-y-8"
                    >
                      <div className="mx-auto max-w-3xl text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                          {block.level === 2 ? ui.included : ui.insights}
                        </p>
                        <Tag className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                          {block.heading}
                        </Tag>
                        <div className="mt-4 space-y-3">
                          {block.paragraphs.map((para) => (
                            <p key={para} className="text-sm leading-[1.75] text-slate-600 md:text-base">
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                        <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                        {block.lists?.map((list, listIdx) => (
                          <div key={listIdx} className="grid gap-3 sm:grid-cols-2">
                            {list.items.map((item) => {
                              const [title, ...rest] = item.split(' — ')
                              const body = rest.join(' — ')
                              return (
                                <article key={item} className="rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white p-4">
                                  <h4 className="font-heading text-sm font-bold text-slate-950">{title}</h4>
                                  {body ? <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{body}</p> : null}
                                </article>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                        <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>{visual}</div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}

        {detail.faqs.length > 0 ? (
          <section className="bg-slate-50/90 py-10 md:py-14">
            <div className={`${pageShellClass} max-w-3xl`}>
              <div className="text-center">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                  {cfg.faqSectionHeading}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{ui.faqHint}</p>
              </div>
              <div className="mt-7 space-y-3">
                {detail.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className={`${cardInteractive} card-accent-hover px-5 py-4 open:border-brand/35 md:px-6 md:py-5`}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-slate-950 md:text-base [&::-webkit-details-marker]:hidden">
                      <span>{faq.q}</span>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition-transform group-open:rotate-90">
                        <ChevronFwd className="size-4" aria-hidden />
                      </span>
                    </summary>
                    <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    )
  }

  return (
    <main className="border-t border-slate-100 bg-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-white to-slate-50/90">
        <div className={`${pageShellClass} py-8 md:py-10`}>
          {showBreadcrumb ? (
            <nav className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
              <Link to="/" className="hover:text-brand">
                {crumbHome}
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-700">{crumbMid}</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-slate-900">{displayName}</span>
            </nav>
          ) : null}

          <div className={`${showBreadcrumb ? 'mt-8' : ''} grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12`}>
            <div>
              <SoftwareColorIcon icon={pageHeroIcon} slug={slug} kind={pageKind} className="mb-4" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{detail.hero.eyebrow}</p>
              <h1 className="mt-3 font-heading text-3xl font-bold leading-[1.08] tracking-tight text-slate-900 md:text-4xl lg:text-[2.4rem]">
                {detail.hero.headline}
              </h1>
              <p className="mt-3 text-lg font-semibold text-slate-800 md:text-xl">{detail.hero.subhead}</p>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-600 md:text-[1.05rem]">
                {(detail.hero.intro.split(/\n+/).map((p) => p.trim()).filter(Boolean)[0] ?? detail.hero.intro).slice(0, 420)}
                {(detail.hero.intro.split(/\n+/).map((p) => p.trim()).filter(Boolean)[0] ?? detail.hero.intro).length > 420 ? '…' : ''}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CmsLink
                  to={detail.hero.ctaPrimary.to}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  {detail.hero.ctaPrimary.label}
                  <ChevronFwd className="size-4" aria-hidden />
                </CmsLink>
                <HeroSecondaryCta label={detail.hero.ctaSecondary.label} to={detail.hero.ctaSecondary.to} />
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl space-y-3 lg:mx-0">
              <PremiumHeroPhoto paths={photoPaths} productLabel={productLabel} overrideSrc={heroImageOverride} />
              {chips.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {chips.map((f) => (
                    <div
                      key={`${f.label}-${f.value}`}
                      className="rounded-xl border border-slate-200 bg-white px-2 py-3 text-center "
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{f.label}</p>
                      <p className="mt-1 font-heading text-xs font-bold text-slate-900">{f.value}</p>
                      <p className="mt-0.5 text-[10px] text-brand">{f.hint}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="text-center text-[11px] leading-snug text-slate-500 lg:text-end">{cfg.heroAsideCaption}</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-slate-100 pt-8 sm:grid-cols-4">
            {detail.hero.trust.map((trustItem, trustIdx) => (
              <div
                key={trustItem.label}
                className="card-accent-hover flex flex-col items-center gap-2 rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white px-3 py-4 text-center transition-[border-color,transform] hover:-translate-y-px"
                style={detailCardAccentStyle(trustIdx)}
              >
                {trustItem.icon ? (
                  <SoftwareColorIcon icon={trustItem.icon} paletteIndex={trustIdx} />
                ) : null}
                <div className="font-heading text-xl font-bold text-slate-900 md:text-2xl">{trustItem.value}</div>
                <div className="text-xs font-medium leading-snug text-slate-600">{trustItem.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-10 md:py-14">
        <div className={pageShellClass}>
          <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{cfg.featuresHeading}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">{cfg.featuresLead}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {detail.features.slice(0, 6).map((f, featIdx) => (
              <article
                key={f.title}
                className={`${cardFlat} card-accent-hover flex gap-4 p-6 transition-[border-color,transform] hover:-translate-y-px md:gap-5`}
                style={detailCardAccentStyle(featIdx)}
              >
                <SoftwareColorIcon icon={f.icon} paletteIndex={featIdx} className="shrink-0" />
                <div className="min-w-0">
                  <h3 className={`${cardTitle} line-clamp-2`}>{f.title}</h3>
                  <p className={`${cardDesc} line-clamp-3`}>{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/70 py-10 md:py-14">
        <div className={pageShellClass}>
          {cfg.vouchersSectionEyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{cfg.vouchersSectionEyebrow}</p>
          ) : null}
          <h2 className="mt-2 font-heading text-2xl font-bold text-slate-900 md:text-3xl">{detail.vouchersReports.heading}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">{detail.vouchersReports.subheading}</p>

          <div className={`mt-8 ${DETAIL_INNER_CARD} p-4 md:p-6`}>
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
              {tabs.map((tb, i) => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setTab(i)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                    tab === i ? 'bg-brand text-white ' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-white'
                  }`}
                >
                  {tb.title}
                </button>
              ))}
            </div>
            <ul className="mt-2 divide-y divide-slate-100">
              {activeTab.items.slice(0, 6).map((it) => (
                <li key={it.name} className="px-1 py-3 sm:px-2">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{it.name}</p>
                      {it.description ? (
                        <p className="mt-1 text-xs italic leading-snug text-slate-500 md:not-italic">{it.description}</p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-10 md:py-14">
        <div className={pageShellClass}>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{cfg.challengesHeading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{cfg.challengesIntro}</p>
              {cfg.challengesListLead ? (
                <p className="mt-2 text-sm font-semibold text-slate-800">{cfg.challengesListLead}</p>
              ) : null}
              {cfg.challengeBullets.length > 0 ? (
                <ol className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
                  {cfg.challengeBullets.slice(0, 6).map((b, i) => (
                    <li key={b} className="flex gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
                        {i + 1}
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </div>
            <div className={`${DETAIL_INNER_CARD} p-6 md:p-8`}>
              <h3 className="font-heading text-xl font-bold text-emerald-900">{cfg.solutionHeading}</h3>
              {cfg.solutionParagraphs.map((p, idx) => (
                <p key={`sol-${idx}`} className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {detail.whyChoose.points.length > 0 ? (
        <section className="border-b border-slate-100 bg-slate-50/60 py-10 md:py-14">
          <div className={pageShellClass}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{detail.whyChoose.heading}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{detail.whyChoose.intro}</p>
                <ul className="mt-8 space-y-4">
                  {detail.whyChoose.points.map((p, i) => (
                    <li
                      key={`${p.title}-${i}`}
                      className="card-accent-hover rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white p-5 transition-[border-color,transform] hover:-translate-y-px"
                      style={detailCardAccentStyle(i)}
                    >
                      <span
                        className="inline-flex size-7 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: detailCardIconAccent(i) }}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <p className="mt-2 font-heading text-base font-bold text-slate-900">{p.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-3 sm:gap-4">
                <PremiumTeamMeetingPhoto paths={photoPaths} productLabel={productLabel} />
                <PremiumLedgerOfficePhoto paths={photoPaths} productLabel={productLabel} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {detail.realtimeReports.bullets.length > 0 ? (
        <section className="border-b border-slate-100 bg-white py-10 md:py-14">
          <div className={pageShellClass}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="order-2 lg:order-1">
                <PremiumFinancialReportsPhoto paths={photoPaths} productLabel={productLabel} />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{detail.realtimeReports.heading}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{detail.realtimeReports.intro}</p>
                <p className="mt-4 text-sm font-semibold text-slate-800">{t('softwareDetail.reportBenefits')}</p>
                <ul className="mt-4 space-y-3">
                  {detail.realtimeReports.bullets.map((b, idx) => (
                    <li
                      key={`rt-${idx}`}
                      className="card-accent-hover flex gap-3 rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 transition-[border-color,transform] hover:-translate-y-px"
                      style={detailCardAccentStyle(idx)}
                    >
                      <span
                        className="mt-1.5 size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: detailCardIconAccent(idx) }}
                        aria-hidden
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{b.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600 md:text-sm">{b.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {cfg.industriesSection.items.length > 0 ? (
        <section className="border-b border-slate-100 bg-slate-50/70 py-10 md:py-14">
          <div className={pageShellClass}>
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{cfg.industriesSection.heading}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{cfg.industriesSection.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {cfg.industriesSection.items.map((it) => (
                    <Link
                      key={it.to}
                      to={it.to}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800  transition-colors hover:border-brand hover:text-brand"
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
                <p className="mt-6 rounded-xl border border-dashed border-brand/40 bg-brand/5 px-4 py-3 text-sm font-medium text-slate-800">
                  {cfg.industriesSection.note}
                </p>
              </div>
              <PremiumDashboardPhoto paths={photoPaths} productLabel={productLabel} />
            </div>
          </div>
        </section>
      ) : null}

      {detail.implementation.length > 0 && cfg.implementationSectionTitle ? (
        <section className="border-b border-slate-100 bg-white py-10 md:py-14">
          <div className={pageShellClass}>
            <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{cfg.implementationSectionTitle}</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">{cfg.implementationSectionLead}</p>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {detail.implementation.map((step, i) => (
                <li
                  key={step.title}
                  className={`${cardFlat} card-accent-hover relative overflow-hidden p-6 transition-[border-color,transform] hover:-translate-y-px`}
                  style={detailCardAccentStyle(i)}
                >
                  <SoftwareColorIcon icon={step.icon} paletteIndex={i} className="mb-5" />
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {t('softwareDetail.stepLabel')} {i + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <SoftwareDemoCtaSection
        uid={uid}
        heading={detail.demoCta.heading}
        sub={detail.demoCta.sub}
        whatsappHref={detail.demoCta.whatsappHref ?? WHATSAPP_URL}
        whatsappLabel={detail.demoCta.whatsappLabel}
        sendLabel={cfg.demoSendButtonLabel}
        demoEmail={demoEmail}
        setDemoEmail={setDemoEmail}
        onSubmit={onDemoSubmit}
        submitStatus={submitStatus}
      />

      {detail.seoBlocks.length > 0 ? (
        <section className="border-b border-slate-100 bg-white py-10 md:py-16">
          <div className={`${pageShellClass} max-w-4xl`}>
            {detail.seoBlocks.map((block, i) => {
              const Tag = block.level === 2 ? 'h2' : 'h3'
              return (
              <div key={i} className={i > 0 ? 'mt-12 border-t border-slate-100 pt-12' : ''}>
                <Tag
                  className={
                    block.level === 2
                      ? 'font-heading text-xl font-bold text-slate-900 md:text-2xl'
                      : 'font-heading text-lg font-bold text-slate-900'
                  }
                >
                  {block.heading}
                </Tag>
                {block.paragraphs.map((para, j) => (
                  <p key={j} className="mt-4 text-sm leading-[1.8] text-slate-600 md:text-base">
                    {para}
                  </p>
                ))}
                {block.lists?.map((list, li) => (
                  <ol key={li} className="mt-6 list-none space-y-3">
                    {list.items.map((item, ii) => {
                      const [title, ...rest] = item.split(' — ')
                      const body = rest.join(' — ')
                      return (
                        <li
                          key={ii}
                          className={`flex gap-4 ${DETAIL_INNER_CARD} px-4 py-3 md:px-5 md:py-4`}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-sm font-bold text-brand">
                            {ii + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">{title}</p>
                            {body ? <p className="mt-1 text-sm leading-relaxed text-slate-600">{body}</p> : null}
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                ))}
              </div>
              )
            })}
          </div>
        </section>
      ) : null}

      {detail.faqs.length > 0 ? (
        <section className="bg-slate-50/90 py-10 md:py-14">
          <div className={`${pageShellClass} max-w-3xl`}>
            <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{cfg.faqSectionHeading}</h2>
            <div className="mt-6 space-y-2">
              {detail.faqs.map((faq, i) => (
                <details key={i} className={`${DETAIL_INNER_CARD} group px-4 py-3 open:border-brand/35 md:px-5 md:py-4`}>
                  <summary className="cursor-pointer list-none text-sm font-bold text-brand md:text-base [&::-webkit-details-marker]:hidden">
                    <span className="mr-2 text-slate-400 group-open:text-brand">▸</span>
                    {faq.q}
                  </summary>
                  <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}
