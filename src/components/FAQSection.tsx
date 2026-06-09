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
        className={`${faqItemInteractive}${isOpen ? ' border-brand/45' : ''}`}
        data-open={isOpen ? 'true' : 'false'}
      >
        <button
          type="button"
          className={faqTriggerModern}
          aria-expanded={isOpen}
          onClick={() => setOpen(isOpen ? null : i)}
        >
          <span className="pr-4">{q}</span>
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg border transition-[background-color,border-color,transform] duration-300 ${
              isOpen ? 'border-brand/35 bg-brand/[0.1]' : 'border-slate-200/90 bg-slate-50/80'
            }`}
          >
            {isOpen ? (
              <Minus className="size-[1.125rem] text-brand" strokeWidth={2} aria-hidden />
            ) : (
              <Plus className="size-[1.125rem] text-slate-500" strokeWidth={2} aria-hidden />
            )}
          </span>
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-350 ease-out motion-reduce:duration-0 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className={faqPanelModern}>{a}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="faqs" className={`scroll-mt-28 ${sectionMuted} ${sectionPad}`}>
      <div className={pageShellClass}>
        <div className="mx-auto w-full max-w-[64rem]">
          <ScrollReveal>
            <h2 className={sectionTitle}>{title}</h2>
            <p className={`${sectionSubCenter} mx-auto max-w-2xl`}>{sub}</p>
          </ScrollReveal>
          <div className={`${sectionContentTop} space-y-4 md:space-y-5 lg:space-y-6`}>
            {items && items.length > 0
              ? items.map((row, i) => renderFaqRow(row.id, row.q, row.a, i))
              : faqIndexes.map((n, i) => renderFaqRow(n, t(`faq.q${n}`), t(`faq.a${n}`), i))}
          </div>
        </div>
      </div>
    </section>
  )
}
