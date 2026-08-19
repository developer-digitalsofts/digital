import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '../../../i18n/I18nProvider'
import type { DetailFaqModel } from '../../../types/detailPageSections'
import { detailShellClass } from './detailConstants'

type Props = {
  model: DetailFaqModel
}

export function DetailFaqSection({ model }: Props) {
  const { lang } = useI18n()
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight

  return (
    <section className="accounts-proto__section accounts-proto__section--faq">
      <div className={detailShellClass}>
        <header className="accounts-proto__header-center">
          <h2 className="accounts-proto__h2">{model.heading}</h2>
        </header>
        <div className="accounts-proto-faq__list">
          {model.items.map((faq) => (
            <details key={faq.q} className="accounts-proto-faq__item group">
              <summary>
                <span>{faq.q}</span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FFF4EE] text-[#FF7048] transition-transform group-open:rotate-90">
                  <ChevronFwd className="size-4" aria-hidden />
                </span>
              </summary>
              <p className="accounts-proto-faq__answer">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
