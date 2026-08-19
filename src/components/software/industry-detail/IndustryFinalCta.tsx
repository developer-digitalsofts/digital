import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '../../../i18n/I18nProvider'
import { CmsLink } from '../../CmsLink'
import type { IndustryFinalCtaModel } from '../../../types/industryDetailPage'
import { industryShellClass } from './industryConstants'

type Props = { model: IndustryFinalCtaModel }

export function IndustryFinalCta({ model }: Props) {
  const { lang } = useI18n()
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight

  return (
    <section className="ind-final-cta">
      <div className={industryShellClass}>
        <div className="ind-final-cta__box">
          <div className="ind-final-cta__copy">
            <h2 className="ind-h2">{model.heading}</h2>
            {model.sub ? <p>{model.sub}</p> : null}
            <div className="ind-final-cta__actions">
              <CmsLink to={model.ctaPrimary.to} className="ind-btn ind-btn--primary">
                {model.ctaPrimary.label}
                <ChevronFwd className="size-4" aria-hidden />
              </CmsLink>
              <a href={model.ctaSecondary.to} target="_blank" rel="noopener noreferrer" className="ind-btn ind-btn--whatsapp">
                {model.ctaSecondary.label}
              </a>
            </div>
            {(model.trustPoints?.length ?? 0) > 0 ? (
              <ul className="ind-final-cta__trust">
                {model.trustPoints!.map((point) => (
                  <li key={point}>
                    <Check className="size-4" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
