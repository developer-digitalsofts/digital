import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { ScrollReveal } from './ScrollReveal'
import { sectionWhite } from '../ui/saas'
import './faq-section.css'

const fallbackKeys = [
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
  'q6',
  'q7',
  'q8',
  'q9',
  'q10',
] as const

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

type FaqRow = { id: string; q: string; a: string }

function splitColumns(items: FaqRow[]) {
  const mid = Math.ceil(items.length / 2)
  return [items.slice(0, mid), items.slice(mid)]
}

function FaqColumn({
  items,
  startIndex,
  openIndex,
  onToggle,
}: {
  items: FaqRow[]
  startIndex: number
  openIndex: number | null
  onToggle: (index: number) => void
}) {
  return (
    <div className="dm-faq__col">
      {items.map((row, i) => {
        const globalIndex = startIndex + i
        const isOpen = openIndex === globalIndex
        return (
          <div key={row.id} className={`dm-faq__item ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="dm-faq__trigger"
              aria-expanded={isOpen}
              onClick={() => onToggle(globalIndex)}
            >
              <span className="dm-faq__question-text">{row.q}</span>
              {isOpen ? (
                <span className="dm-faq__toggle" aria-hidden>
                  <Minus className="dm-faq__icon" strokeWidth={2.25} />
                </span>
              ) : (
                <span className="dm-faq__toggle" aria-hidden>
                  <Plus className="dm-faq__icon" strokeWidth={2.25} />
                </span>
              )}
            </button>
            <div className={`dm-faq__panel-wrap ${isOpen ? 'is-open' : ''}`}>
              <div className="dm-faq__panel">
                <p className="dm-faq__answer">{row.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function FAQSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const block = data?.faqs as FaqCms | undefined

  const eyebrow = block?.title ? pick(block.title, lang) : t('faq.eyebrow')

  const items = useMemo(() => {
    const raw = block?.items
    if (raw?.length) {
      return [...raw]
        .filter((x) => x.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((x) => ({
          id: x.id,
          q: x.question ? pick(x.question, lang) : '',
          a: x.answer ? pick(x.answer, lang) : '',
        }))
    }
    return fallbackKeys.map((key) => ({
      id: key,
      q: t(`faq.${key}`),
      a: t(`faq.a${key.slice(1)}`),
    }))
  }, [block?.items, lang, t])

  const [leftItems, rightItems] = useMemo(() => splitColumns(items), [items])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const onToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="faqs" className={`dm-faq scroll-mt-28 ${sectionWhite} home-section home-section--faq`}>
      <div className="industries-section__container">
        <ScrollReveal>
          <header className="dm-faq__header">
            <p className="dm-faq__eyebrow">{eyebrow}</p>
          </header>
        </ScrollReveal>

        <ScrollReveal delayMs={60}>
          <div className="dm-faq__grid">
            <FaqColumn
              items={leftItems}
              startIndex={0}
              openIndex={openIndex}
              onToggle={onToggle}
            />
            <FaqColumn
              items={rightItems}
              startIndex={leftItems.length}
              openIndex={openIndex}
              onToggle={onToggle}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
