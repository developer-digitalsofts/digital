import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { ScrollReveal } from './ScrollReveal'
import { pageShellClass } from '../ui/pageShell'
import { faqItem, faqPanel, faqTrigger, sectionContentTop, sectionMuted, sectionPad, sectionSubCenter, sectionTitle } from '../ui/saas'

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

  return (
    <section id="faqs" className={`${sectionMuted} ${sectionPad}`}>
      <div className={pageShellClass}>
        <div className="mx-auto w-full max-w-[min(100%,40rem)]">
        <ScrollReveal>
          <h2 className={sectionTitle}>{title}</h2>
          <p className={`${sectionSubCenter} mx-auto max-w-xl`}>{sub}</p>
        </ScrollReveal>
        <div className={`${sectionContentTop} space-y-2.5`}>
          {items && items.length > 0
            ? items.map((row, i) => {
                const isOpen = open === i
                return (
                  <div
                    key={row.id}
                    className={faqItem}
                  >
                    <button
                      type="button"
                      className={faqTrigger}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span className="pr-2">{row.q}</span>
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-300 ${
                          isOpen
                            ? 'rotate-180 border-brand/25 bg-brand/10'
                            : 'border-slate-200/80 bg-slate-50'
                        }`}
                      >
                        <ChevronDown className="size-4 text-brand" aria-hidden />
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:duration-0 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className={faqPanel}>{row.a}</div>
                      </div>
                    </div>
                  </div>
                )
              })
            : faqIndexes.map((n, i) => {
                const isOpen = open === i
                const q = t(`faq.q${n}`)
                return (
                  <div
                    key={n}
                    className={faqItem}
                  >
                    <button
                      type="button"
                      className={faqTrigger}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span className="pr-2">{q}</span>
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-300 ${
                          isOpen
                            ? 'rotate-180 border-brand/25 bg-brand/10'
                            : 'border-slate-200/80 bg-slate-50'
                        }`}
                      >
                        <ChevronDown className="size-4 text-brand" aria-hidden />
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:duration-0 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className={faqPanel}>{t(`faq.a${n}`)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
        </div>
        </div>
      </div>
    </section>
  )
}
