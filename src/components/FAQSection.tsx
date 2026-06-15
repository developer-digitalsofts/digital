import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { ScrollReveal } from './ScrollReveal'
import { pageShellClass } from '../ui/pageShell'
import {
  faqItemInteractive,
  faqPanelModern,
  faqTriggerModern,
  sectionContentTop,
  sectionMuted,
  sectionPad,
  sectionSubCenter,
  sectionTitle,
} from '../ui/saas'

const faqIndexes = [1, 2, 3, 4, 5, 6] as const

type FaqItem = {
  id: string
  question?: Bilingual
  answer?: Bilingual
  sortOrder?: number
  active?: boolean
}

type FaqCms = {
  title?: Bilingual
  subtitle?: Bilingual
  items?: FaqItem[]
}

export function FAQSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const block = data?.faqs as FaqCms | undefined

  const title = block?.title ? pick(block.title, lang) : t('faq.title')
  const sub = block?.subtitle ? pick(block.subtitle, lang) : t('faq.sub')

  const items = useMemo(() => {
    const raw = block?.items
    if (!raw?.length) return null
    return [...raw]
      .filter((x) => x.active !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((x) => ({
        id: x.id,
        q: x.question ? pick(x.question, lang) : '',
        a: x.answer ? pick(x.answer, lang) : '',
      }))
  }, [block?.items, lang])

  const [open, setOpen] = useState<number | null>(0)

  const renderFaqRow = (key: string | number, q: string, a: string, i: number) => {
    const isOpen = open === i
    return (
      <div
        key={key}
        className={`${faqItemInteractive} group/faq relative hover:border-brand/25${
          isOpen ? ' border-brand/40 bg-white' : ''
        }`}
        data-open={isOpen ? 'true' : 'false'}
      >
        <button
          type="button"
          className={`${faqTriggerModern}${isOpen ? ' bg-brand/[0.03]' : ''}`}
          aria-expanded={isOpen}
          onClick={() => setOpen(isOpen ? null : i)}
        >
          <span
            className={`pr-4 text-[1.0625rem] transition-colors duration-300 sm:text-lg ${
              isOpen ? 'font-bold text-brand-deep' : 'font-semibold text-slate-900 group-hover/faq:text-slate-800'
            }`}
          >
            {q}
          </span>
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ease-out ${
              isOpen
                ? 'border-brand/40 bg-brand text-white'
                : 'border-[rgba(15,23,42,0.08)] bg-slate-50/90 text-slate-500 group-hover/faq:border-brand/30 group-hover/faq:bg-brand/[0.06] group-hover/faq:text-brand'
            }`}
          >
            {isOpen ? (
              <Minus className="size-5" strokeWidth={2.5} aria-hidden />
            ) : (
              <Plus className="size-5" strokeWidth={2.5} aria-hidden />
            )}
          </span>
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-0 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`${faqPanelModern}${isOpen ? ' border-l-[3px] border-brand/50 bg-white' : ''}`}
            >
              {a}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="faqs" className={`scroll-mt-28 ${sectionMuted} ${sectionPad}`}>
      <div className={pageShellClass}>
        <div className="mx-auto w-full max-w-[52rem] lg:max-w-[56rem] xl:max-w-[60rem]">
          <ScrollReveal>
            <h2 className={sectionTitle}>{title}</h2>
            <p className={`${sectionSubCenter} mx-auto mt-4 max-w-2xl text-slate-600`}>{sub}</p>
          </ScrollReveal>
          <div className={`${sectionContentTop} space-y-4 md:space-y-5`}>
            {items && items.length > 0
              ? items.map((row, i) => renderFaqRow(row.id, row.q, row.a, i))
              : faqIndexes.map((n, i) => renderFaqRow(n, t(`faq.q${n}`), t(`faq.a${n}`), i))}
          </div>
        </div>
      </div>
    </section>
  )
}
