import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ChevronLeft, ChevronRight, MessageCircle, Send } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import type { SoftwareDetailPageData } from '../../data/softwareDetail/types'
import { linkForSoftwareRelated } from '../../data/megaMenu'
import { DashboardMockup } from '../DashboardMockup'
import { pageShellClass } from '../../ui/pageShell'

function IconByName({ name, className }: { name: string; className?: string }) {
  const Cmp =
    (Icons as unknown as Record<string, LucideIcon | undefined>)[name] ?? Icons.Circle
  return <Cmp className={className} aria-hidden />
}

type SoftwareDetailViewProps = {
  detail: SoftwareDetailPageData
  displayName: string
  crumbMid: string
  crumbHome: string
  isModule: boolean
}

export function SoftwareDetailView({ detail, displayName, isModule }: SoftwareDetailViewProps) {
  const { lang, t } = useI18n()
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight
  const [tab, setTab] = useState(0)
  const [demoName, setDemoName] = useState('')
  const [demoPhone, setDemoPhone] = useState('')

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

  const mailtoDemo = useMemo(() => {
    const body = [`Requesting demo: ${displayName}`, demoName && `Name: ${demoName}`, demoPhone && `Phone: ${demoPhone}`]
      .filter(Boolean)
      .join('\n')
    return `mailto:info@digitalmanager.ae?subject=${encodeURIComponent(`Demo — ${displayName}`)}&body=${encodeURIComponent(body)}`
  }, [displayName, demoName, demoPhone])

  return (
    <main className="border-t border-slate-100 bg-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/80">
        <div className={`${pageShellClass} py-8 md:py-10`}>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{detail.hero.eyebrow}</p>
              <h1 className="mt-3 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-4xl lg:text-[2.35rem]">
                {detail.hero.headline}
              </h1>
              <p className="mt-3 text-lg font-semibold text-slate-800 md:text-xl">{detail.hero.subhead}</p>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-slate-600 md:text-[1.05rem]">
                {detail.hero.intro}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                {detail.hero.trust.map((t) => (
                  <div
                    key={t.label}
                    className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-center border-slate-200/90 sm:min-w-[7.5rem]"
                  >
                    <div className="font-heading text-lg font-bold text-brand md:text-xl">{t.value}</div>
                    <div className="text-[11px] font-medium text-slate-500">{t.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={detail.hero.ctaPrimary.to}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  {detail.hero.ctaPrimary.label}
                  <ChevronFwd className="size-4" aria-hidden />
                </Link>
                <Link
                  to={detail.hero.ctaSecondary.to}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand"
                >
                  {detail.hero.ctaSecondary.label}
                </Link>
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
            {detail.features.map((f) => (
              <article
                key={f.title}
                className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4 transition-colors hover:border-slate-300 hover:bg-white md:p-5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand/15 bg-brand/[0.08] text-brand">
                  <IconByName name={f.icon} className="size-5 text-brand" />
                </div>
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
              <div key={it.name} className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
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
              <div key={idx} className="grid gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white md:grid-cols-2">
                <div className="border-b border-slate-100 bg-slate-50/80 p-4 md:border-b-0 md:border-r md:border-slate-200">
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
              <div className="mt-6 hidden h-48 rounded-2xl border border-slate-200 bg-gradient-to-br from-brand/15 via-white to-slate-100 lg:block" aria-hidden />
            </div>
            <div className="space-y-3 lg:col-span-7">
              {detail.whyChoose.points.map((p) => (
                <details
                  key={p.title}
                  className="group rounded-xl border border-slate-200 bg-white px-4 py-3 open:border-slate-300 md:px-5 md:py-4"
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
              <li key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-brand">{b.title}</p>
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
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand md:text-sm"
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
              <li key={step.title} className="relative rounded-xl border border-slate-200 bg-slate-50/40 p-5">
                <span className="absolute right-4 top-4 font-heading text-3xl font-bold text-slate-200">{i + 1}</span>
                <div className="flex size-10 items-center justify-center rounded-lg border border-brand/15 bg-brand/[0.08] text-brand">
                  <IconByName name={step.icon} className="size-5 text-brand" />
                </div>
                <h3 className="mt-4 font-heading text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 md:text-sm">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-slate-900 py-10 text-white md:py-12">
        <div className={pageShellClass}>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">{detail.demoCta.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">{detail.demoCta.sub}</p>
              <a
                href={detail.demoCta.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
              >
                <MessageCircle className="size-4" aria-hidden />
                {detail.demoCta.whatsappLabel}
              </a>
            </div>
            <form
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur md:p-6"
              onSubmit={(e) => {
                e.preventDefault()
                window.location.href = mailtoDemo
              }}
            >
              <label className="block text-xs font-semibold text-slate-300" htmlFor="dm-demo-name">
                Name
              </label>
              <input
                id="dm-demo-name"
                value={demoName}
                onChange={(e) => setDemoName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none ring-brand/40 placeholder:text-slate-400 focus:ring-2"
                placeholder="Your name"
                autoComplete="name"
              />
              <label className="mt-3 block text-xs font-semibold text-slate-300" htmlFor="dm-demo-phone">
                Contact number
              </label>
              <input
                id="dm-demo-phone"
                value={demoPhone}
                onChange={(e) => setDemoPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none ring-brand/40 placeholder:text-slate-400 focus:ring-2"
                placeholder="Mobile / WhatsApp"
                inputMode="tel"
                autoComplete="tel"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark min-[380px]:flex-none"
                >
                  <Send className="size-4" aria-hidden />
                  Send request
                </button>
                <Link
                  to={detail.demoCta.contactHref}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-white/25 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 min-[380px]:flex-none"
                >
                  Full contact form
                </Link>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                Opens your email client to send details to info@digitalmanager.ae — or use the full contact form for structured enquiries.
              </p>
            </form>
          </div>
        </div>
      </section>

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
              <details key={i} className="rounded-xl border border-slate-200 bg-white px-4 py-3 open:border-slate-300">
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
