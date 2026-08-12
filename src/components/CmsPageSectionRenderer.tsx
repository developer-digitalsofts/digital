import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import type { PageSectionRecord, SectionType } from '../cms/sectionCatalog'
import { CmsLink } from './CmsLink'
import { LucideByName } from '../utils/lucideFromName'
import { resolvePublicMediaUrl } from '../cms/publicMediaUrl'
import { HomeCtaBanner, CTA_BANNER_IMAGES } from './HomeCtaBanner'
import { pageShellClass } from '../ui/pageShell'
import {
  btnPrimary,
  btnSecondary,
  heroBody,
  heroPad,
  heroSection,
  heroTitle,
  sectionEyebrow,
  sectionPad,
  sectionTitle,
  sectionTitleLeft,
  sectionWhite,
} from '../ui/saas'

type Props = {
  sections: PageSectionRecord[]
}

function bi(raw: unknown): Bilingual {
  const o = raw as Bilingual | undefined
  return { en: o?.en || '', ar: o?.ar || '' }
}

function SectionBlock({ section }: { section: PageSectionRecord }) {
  const { lang } = useI18n()
  const c = section.content || {}

  switch (section.type as SectionType) {
    case 'hero': {
      const pill = pick(bi(c.pill), lang)
      const before = pick(bi(c.titleBefore), lang)
      const accent = pick(bi(c.titleAccent), lang)
      const line2 = pick(bi(c.titleLine2), lang)
      const body = pick(bi(c.body), lang)
      const p1 = (c.ctaPrimary as { label?: Bilingual; href?: string }) || {}
      const p2 = (c.ctaSecondary as { label?: Bilingual; href?: string }) || {}
      const img = resolvePublicMediaUrl(String(c.imageUrl || ''))
      return (
        <section className={`${heroSection} ${heroPad}`}>
          <div className={`${pageShellClass} grid items-center gap-10 lg:grid-cols-2`}>
            <div>
              {pill ? (
                <p className="mb-4 inline-flex rounded-full border border-brand/25 bg-brand/[0.06] px-3 py-1 text-xs font-semibold text-brand">
                  {pill}
                </p>
              ) : null}
              <h1 className={heroTitle}>
                {before}
                {accent ? <span className="text-brand">{accent}</span> : null}
                {line2 ? <span className="block">{line2}</span> : null}
              </h1>
              {body ? <p className={`${heroBody} mt-5 max-w-xl`}>{body}</p> : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {p1.label ? (
                  <CmsLink to={p1.href || '/contact'} className={`${btnPrimary} min-w-[10.5rem]`}>
                    {pick(bi(p1.label), lang)}
                  </CmsLink>
                ) : null}
                {p2.label ? (
                  <CmsLink to={p2.href || '/#modules'} className={`${btnSecondary} min-w-[10.5rem]`}>
                    {pick(bi(p2.label), lang)}
                  </CmsLink>
                ) : null}
              </div>
            </div>
            {img ? (
              <img src={img} alt={pick(bi(c.imageAlt), lang)} className="w-full rounded-2xl border border-slate-200 shadow-lg" />
            ) : null}
          </div>
        </section>
      )
    }
    case 'stats': {
      const title = pick(bi(c.title), lang)
      const items = (c.items as { id: string; value?: string; label?: Bilingual; icon?: string; accentColor?: string }[]) || []
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={pageShellClass}>
            {title ? <h2 className={`${sectionTitle} text-center`}>{title}</h2> : null}
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <div
                    className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${item.accentColor || '#ff7a45'}20`, color: item.accentColor || '#ff7a45' }}
                  >
                    <LucideByName name={item.icon || 'Award'} className="size-6" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-600">{pick(bi(item.label), lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }
    case 'imageText': {
      const eyebrow = pick(bi(c.eyebrow), lang)
      const heading = pick(bi(c.heading), lang)
      const body = pick(bi(c.body), lang)
      const img = resolvePublicMediaUrl(String(c.imageUrl || ''))
      const cta = (c.ctaPrimary as { label?: Bilingual; href?: string }) || {}
      const imageLeft = c.imageLeft === true
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={`${pageShellClass} grid items-center gap-10 lg:grid-cols-2`}>
            <div className={imageLeft ? 'lg:order-2' : ''}>
              {eyebrow ? <p className={`${sectionEyebrow} uppercase`}>{eyebrow}</p> : null}
              {heading ? <h2 className={`${sectionTitleLeft} mt-2`}>{heading}</h2> : null}
              {body ? <p className="mt-5 text-base leading-relaxed text-slate-600">{body}</p> : null}
              {cta.label ? (
                <CmsLink to={cta.href || '/contact'} className={`${btnPrimary} mt-6 inline-flex`}>
                  {pick(bi(cta.label), lang)}
                </CmsLink>
              ) : null}
            </div>
            <div className={imageLeft ? 'lg:order-1' : ''}>
              {img ? (
                <img src={img} alt={pick(bi(c.imageAlt), lang)} className="w-full rounded-2xl border border-slate-200 shadow-md" />
              ) : null}
            </div>
          </div>
        </section>
      )
    }
    case 'featureCards': {
      const title = pick(bi(c.title), lang)
      const subtitle = pick(bi(c.subtitle), lang)
      const items = (c.items as { id: string; icon?: string; accentColor?: string; title?: Bilingual; description?: Bilingual }[]) || []
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={pageShellClass}>
            {title ? <h2 className={`${sectionTitle} text-center`}>{title}</h2> : null}
            {subtitle ? <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">{subtitle}</p> : null}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div
                    className="mb-4 flex size-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${item.accentColor || '#ff7a45'}18`, color: item.accentColor || '#ff7a45' }}
                  >
                    <LucideByName name={item.icon || 'Activity'} className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{pick(bi(item.title), lang)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pick(bi(item.description), lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }
    case 'featureStrip': {
      const items = (c.items as { id: string; icon?: string; title?: Bilingual }[]) || []
      return (
        <section className="border-y border-slate-200 bg-slate-50 py-8">
          <div className={`${pageShellClass} flex flex-wrap justify-center gap-8`}>
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <LucideByName name={item.icon || 'Shield'} className="size-5 text-brand" />
                {pick(bi(item.title), lang)}
              </div>
            ))}
          </div>
        </section>
      )
    }
    case 'comparison': {
      const title = pick(bi(c.title), lang)
      const leftTitle = pick(bi(c.leftTitle), lang)
      const rightTitle = pick(bi(c.rightTitle), lang)
      const leftItems = ((c.leftItems as Bilingual[]) || []).map((x) => pick(bi(x), lang))
      const rightItems = ((c.rightItems as Bilingual[]) || []).map((x) => pick(bi(x), lang))
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={pageShellClass}>
            {title ? <h2 className={`${sectionTitle} text-center`}>{title}</h2> : null}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900">{leftTitle}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {leftItems.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-brand/30 bg-brand/[0.03] p-6">
                <h3 className="font-bold text-slate-900">{rightTitle}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {rightItems.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )
    }
    case 'workflowSteps': {
      const title = pick(bi(c.title), lang)
      const subtitle = pick(bi(c.subtitle), lang)
      const steps = (c.steps as { id: string; title?: Bilingual; description?: Bilingual }[]) || []
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={pageShellClass}>
            {title ? <h2 className={`${sectionTitle} text-center`}>{title}</h2> : null}
            {subtitle ? <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">{subtitle}</p> : null}
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((step, i) => (
                <li key={step.id} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <span className="text-xs font-bold uppercase tracking-wide text-brand">Step {i + 1}</span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{pick(bi(step.title), lang)}</h3>
                  <p className="mt-2 text-sm text-slate-600">{pick(bi(step.description), lang)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )
    }
    case 'modules':
    case 'industries': {
      const title = pick(bi(c.title), lang)
      const subtitle = pick(bi(c.subtitle), lang)
      const explore = pick(bi(c.exploreLabel), lang) || 'Explore →'
      const items =
        (c.items as { id: string; icon?: string; accentColor?: string; title?: Bilingual; description?: Bilingual; href?: string }[]) || []
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={pageShellClass}>
            {title ? <h2 className={`${sectionTitle} text-center`}>{title}</h2> : null}
            {subtitle ? <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">{subtitle}</p> : null}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <CmsLink
                  key={item.id}
                  to={item.href || '#'}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand/40 hover:shadow-md"
                >
                  <div
                    className="mb-4 flex size-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${item.accentColor || '#ff7a45'}18`, color: item.accentColor || '#ff7a45' }}
                  >
                    <LucideByName name={item.icon || 'Layers'} className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand">{pick(bi(item.title), lang)}</h3>
                  <p className="mt-2 text-sm text-slate-600">{pick(bi(item.description), lang)}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand">{explore}</span>
                </CmsLink>
              ))}
            </div>
          </div>
        </section>
      )
    }
    case 'pricing': {
      const title = pick(bi(c.title), lang)
      const subtitle = pick(bi(c.subtitle), lang)
      const plans =
        (c.plans as { id: string; name?: Bilingual; price?: Bilingual; features?: Bilingual[]; href?: string; accentColor?: string }[]) || []
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={pageShellClass}>
            {title ? <h2 className={`${sectionTitle} text-center`}>{title}</h2> : null}
            {subtitle ? <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">{subtitle}</p> : null}
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold" style={{ color: plan.accentColor || '#ff7a45' }}>
                    {pick(bi(plan.name), lang)}
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{pick(bi(plan.price), lang)}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                    {(plan.features || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                        {pick(bi(f), lang)}
                      </li>
                    ))}
                  </ul>
                  <CmsLink to={plan.href || '/contact'} className={`${btnPrimary} mt-6 w-full text-center`}>
                    Contact sales
                  </CmsLink>
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }
    case 'faqs': {
      const title = pick(bi(c.title), lang)
      const items = (c.items as { id: string; question?: Bilingual; answer?: Bilingual }[]) || []
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={`${pageShellClass} max-w-3xl`}>
            {title ? <h2 className={`${sectionTitle} text-center`}>{title}</h2> : null}
            <div className="mt-8 space-y-3">
              {items.map((item) => (
                <FaqItem key={item.id} question={pick(bi(item.question), lang)} answer={pick(bi(item.answer), lang)} />
              ))}
            </div>
          </div>
        </section>
      )
    }
    case 'cta': {
      const title = pick(bi(c.title), lang)
      const body = pick(bi(c.body), lang)
      const primary = (c.primary as { label?: Bilingual; href?: string }) || {}
      const secondary = (c.secondary as { label?: Bilingual; href?: string }) || {}
      return (
        <HomeCtaBanner backgroundUrl={CTA_BANNER_IMAGES.final} title={title} body={body} variant="final">
          {primary.label ? (
            <CmsLink to={primary.href || '/contact'} className={`${btnPrimary} inline-flex min-h-[42px] items-center px-6`}>
              {pick(bi(primary.label), lang)}
            </CmsLink>
          ) : null}
          {secondary.label ? (
            <CmsLink
              to={secondary.href || '/#modules'}
              className="inline-flex min-h-[42px] items-center rounded-lg border-2 border-white px-6 font-semibold text-white hover:bg-white/10"
            >
              {pick(bi(secondary.label), lang)}
            </CmsLink>
          ) : null}
        </HomeCtaBanner>
      )
    }
    case 'richText':
    default: {
      const heading = pick(bi(c.heading), lang)
      const body = pick(bi(c.body), lang)
      return (
        <section className={`${sectionWhite} ${sectionPad}`}>
          <div className={`${pageShellClass} max-w-3xl`}>
            {heading ? <h2 className={`${sectionTitleLeft} mb-5`}>{heading}</h2> : null}
            {body ? <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">{body}</div> : null}
          </div>
        </section>
      )
    }
  }
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-900"
        onClick={() => setOpen((v) => !v)}
      >
        {question}
        <ChevronDown className={`size-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">{answer}</div> : null}
    </div>
  )
}

export function CmsPageSectionRenderer({ sections }: Props) {
  const ordered = [...sections].filter((s) => s.visible !== false).sort((a, b) => a.order - b.order)
  return (
    <main>
      {ordered.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </main>
  )
}
