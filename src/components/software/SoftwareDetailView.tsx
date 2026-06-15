import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CmsLink } from '../CmsLink'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import type { SoftwareDetailPageData } from '../../data/softwareDetail/types'
import { linkForSoftwareRelated } from '../../data/megaMenu'
import { DashboardMockup } from '../DashboardMockup'
import { SoftwareColorIcon, detailCardAccentStyle } from '../SoftwareColorIcon'
import { detailCardIconAccent, softwarePageIconName } from '../../ui/cardIconColors'
import { pageShellClass } from '../../ui/pageShell'
import { cardFlat } from '../../ui/saas'
import { SoftwareDemoCtaSection } from './SoftwareDemoCtaSection'
import { useDetailPageInquiry } from './useDetailPageInquiry'

type SoftwareDetailViewProps = {
  detail: SoftwareDetailPageData
  displayName: string
  crumbMid: string
  crumbHome: string
  isModule: boolean
  slug: string
}

export function SoftwareDetailView({ detail, displayName, isModule, slug }: SoftwareDetailViewProps) {
  const uid = useId()
  const { lang, t } = useI18n()
  const pageKind = isModule ? ('module' as const) : ('industry' as const)
  const pageHeroIcon = useMemo(() => softwarePageIconName(slug, pageKind), [slug, pageKind])
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight
  const [tab, setTab] = useState(0)
  const { demoEmail, setDemoEmail, submitStatus, onSubmit: onDemoSubmit } = useDetailPageInquiry(
    displayName,
    slug,
  )

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

  const tabs = detail.vouchersReports.tabs
  const activeTab = tabs[tab] ?? tabs[0]

  return (
    <main className="border-t border-slate-100 bg-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80">
        <div className={`${pageShellClass} py-8 md:py-10`}>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div>
              <SoftwareColorIcon icon={pageHeroIcon} slug={slug} kind={pageKind} className="mb-4" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{detail.hero.eyebrow}</p>
              <h1 className="mt-3 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-4xl lg:text-[2.35rem]">
                {detail.hero.headline}
              </h1>
              <p className="mt-3 text-lg font-semibold text-slate-800 md:text-xl">{detail.hero.subhead}</p>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-600 md:text-[1.05rem]">
                {detail.hero.intro}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                {detail.hero.trust.map((trustItem, trustIdx) => (
                  <div
                    key={trustItem.label}
                    className="card-accent-hover rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white px-3 py-2.5 text-center transition-[border-color,transform] hover:-translate-y-px sm:min-w-[7.5rem]"
                    style={detailCardAccentStyle(trustIdx)}
                  >
                    {trustItem.icon ? (
                      <SoftwareColorIcon icon={trustItem.icon} paletteIndex={trustIdx} className="mx-auto mb-1.5" size="sm" />
                    ) : null}
                    <div className="font-heading text-lg font-bold text-slate-900 md:text-xl">{trustItem.value}</div>
                    <div className="text-[11px] font-medium text-slate-500">{trustItem.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <CmsLink
                  to={detail.hero.ctaPrimary.to}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  {detail.hero.ctaPrimary.label}
                  <ChevronFwd className="size-4" aria-hidden />
                </CmsLink>
                <CmsLink
                  to={detail.hero.ctaSecondary.to}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand"
                >
                  {detail.hero.ctaSecondary.label}
                </CmsLink>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
              <div className="border-slate-200/90 [&_.relative]:max-w-full">
                <DashboardMockup frameClassName="border-slate-200/90" />
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-500 lg:text-left">
                Dashboard preview — illustrative UI for {displayName}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-10 md:py-12">
        <div className={pageShellClass}>
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">Key features</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
              Every capability below maps to configurable screens, approvals, and postings inside DigitalManager — designed for ERP accuracy without sacrificing usability.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {detail.features.map((f, featIdx) => (
              <article
                key={f.title}
                className={`card-accent-hover flex gap-3 p-4 transition-[border-color,transform] hover:-translate-y-px md:p-5 ${cardFlat}`}
                style={detailCardAccentStyle(featIdx)}
              >
                <SoftwareColorIcon icon={f.icon} paletteIndex={featIdx} className="shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-heading text-sm font-bold text-slate-900 md:text-base">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 md:text-sm">{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/50 py-10 md:py-12">
        <div className={pageShellClass}>
          <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{detail.vouchersReports.heading}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">{detail.vouchersReports.subheading}</p>

          <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {tabs.map((tb, i) => (
              <button
                key={tb.id}
                type="button"
                onClick={() => setTab(i)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === i ? 'bg-brand text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand/40'
                }`}
              >
                {tb.title}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {activeTab.items.map((it) => (
              <div key={it.name} className={`rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white p-4 md:p-5`}>
                <h3 className="font-heading text-sm font-bold text-slate-900">{it.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">{it.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-10 md:py-12">
        <div className={pageShellClass}>
          <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">Challenges &amp; solutions</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            Practical pain points we hear during evaluations — and how DigitalManager removes them for {isModule ? 'this module' : 'this industry programme'}.
          </p>
          <div className="mt-8 grid gap-3 lg:grid-cols-2">
            {detail.challengesSolutions.map((row, idx) => (
              <div key={idx} className="grid gap-0 overflow-hidden rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white md:grid-cols-2">
                <div className="border-b border-slate-100 bg-white p-4 md:border-b-0 md:border-r md:border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand">Challenge</p>
                  <p className="mt-2 text-sm font-semibold leading-snug text-slate-900">{row.challenge}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Solution</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{row.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/50 py-10 md:py-12">
        <div className={pageShellClass}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{detail.whyChoose.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{detail.whyChoose.intro}</p>
            </div>
            <div className="space-y-3 lg:col-span-7">
              {detail.whyChoose.points.map((p, pointIdx) => (
                <details
                  key={p.title}
                  className="card-accent-hover group rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 open:border-brand/30 md:px-5 md:py-4"
                  style={detailCardAccentStyle(pointIdx)}
                >
                  <summary className="cursor-pointer list-none font-heading text-sm font-bold text-slate-900 md:text-base [&::-webkit-details-marker]:hidden">
                    <span className="mr-2 inline-block text-brand transition-transform group-open:rotate-90">›</span>
                    {p.title}
                  </summary>
                  <p className="mt-2 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">{p.body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-10 md:py-12">
        <div className={pageShellClass}>
          <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{detail.realtimeReports.heading}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">{detail.realtimeReports.intro}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {detail.realtimeReports.bullets.map((b, i) => (
              <li
                key={i}
                className={`card-accent-hover rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white p-4 transition-[border-color,transform] hover:-translate-y-px`}
                style={detailCardAccentStyle(i)}
              >
                <span
                  className="inline-flex size-2 rounded-full"
                  style={{ backgroundColor: detailCardIconAccent(i) }}
                  aria-hidden
                />
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-800">{b.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-50/50 py-10 md:py-12">
        <div className={pageShellClass}>
          <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">Related modules &amp; industries</h2>
          <p className="mt-2 text-sm text-slate-600">Explore adjacent capabilities that commonly deploy together.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {detail.related.map((r) => (
              <Link
                key={`${r.kind}-${r.slug}`}
                to={linkForSoftwareRelated(r)}
                className="inline-flex items-center rounded-full border border-[rgba(15,23,42,0.12)] bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand md:text-sm"
              >
                {r.label}
                <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">{r.kind}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white py-10 md:py-12">
        <div className={pageShellClass}>
          <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">Implementation process</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            A proven rollout sequence used across DigitalSofts engagements — adapted to your branches, integrations, and compliance context.
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {detail.implementation.map((step, i) => (
              <li
                key={step.title}
                className={`card-accent-hover relative p-5 transition-[border-color,transform] hover:-translate-y-px ${cardFlat}`}
                style={detailCardAccentStyle(i)}
              >
                <span className="absolute right-4 top-4 font-heading text-3xl font-bold text-slate-200">{i + 1}</span>
                <SoftwareColorIcon icon={step.icon} paletteIndex={i} />
                <h3 className="mt-4 font-heading text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SoftwareDemoCtaSection
        uid={uid}
        heading={detail.demoCta.heading}
        sub={detail.demoCta.sub}
        whatsappHref={detail.demoCta.whatsappHref}
        whatsappLabel={detail.demoCta.whatsappLabel}
        sendLabel="Request Here"
        demoEmail={demoEmail}
        setDemoEmail={setDemoEmail}
        onSubmit={onDemoSubmit}
        submitStatus={submitStatus}
      />

      <section className="border-b border-slate-100 bg-white py-10 md:py-14">
        <div className={`${pageShellClass} max-w-4xl`}>
          {detail.seoBlocks.map((block, i) => {
            const Tag = block.level === 2 ? 'h2' : 'h3'
            return (
              <div key={i} className={i > 0 ? 'mt-10 border-t border-slate-100 pt-10' : ''}>
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
                  <p key={j} className="mt-4 text-sm leading-[1.75] text-slate-600 md:text-base">
                    {para}
                  </p>
                ))}
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-slate-50/80 py-10 md:py-12">
        <div className={`${pageShellClass} max-w-3xl`}>
          <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">{t('softwareDetail.faqHeading')}</h2>
          <div className="mt-6 space-y-2">
            {detail.faqs.map((faq, i) => (
              <details key={i} className={`card-accent-hover rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 open:border-brand/30`}>
                <summary className="cursor-pointer list-none text-sm font-bold text-slate-900 md:text-base [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 text-brand">+</span>
                  {faq.q}
                </summary>
                <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
