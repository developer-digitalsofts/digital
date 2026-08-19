import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { industryShellClass } from './industryConstants'

type FaqModel = { heading: string; items: { q: string; a: string }[] }

type Props = { model: FaqModel }

export function IndustryFaqSection({ model }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  if (!model.items.length) return null

  return (
    <section className="ind-section ind-section--faq">
      <div className={industryShellClass}>
        <header className="ind-header-center">
          <h2 className="ind-h2">{model.heading}</h2>
        </header>
        <div className="ind-faq">
          {model.items.map((faq, idx) => {
            const open = openIdx === idx
            return (
              <article key={faq.q} className={`ind-faq__item ${open ? 'is-open' : ''}`}>
                <button type="button" className="ind-faq__trigger" aria-expanded={open} onClick={() => setOpenIdx(open ? null : idx)}>
                  <span>{faq.q}</span>
                  <ChevronDown className="ind-faq__chev" aria-hidden />
                </button>
                <div className="ind-faq__panel" hidden={!open}>
                  <p>{faq.a}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
