import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '../../../i18n/I18nProvider'
import type { DetailFaqModel } from '../../../types/detailPageSections'
import { MODULE_SECTION_IDS, moduleShellClass } from './moduleConstants'

type Props = {
  model: DetailFaqModel
}

export function ModuleFaqSection({ model }: Props) {
  const { lang } = useI18n()
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="mod-section mod-section--faq" id={MODULE_SECTION_IDS.faqs}>
      <div className={moduleShellClass}>
        <header className="mod-header-center">
          <h2 className="mod-h2">{model.heading}</h2>
        </header>
        <div className="mod-faq">
          {model.items.map((faq, idx) => {
            const open = openIdx === idx
            return (
              <article key={faq.q} className={`mod-faq__item ${open ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="mod-faq__question"
                  aria-expanded={open}
                  onClick={() => setOpenIdx(open ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <span className="mod-faq__chev">
                    <ChevronFwd className="size-4" aria-hidden />
                  </span>
                </button>
                {open ? <p className="mod-faq__answer">{faq.a}</p> : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
