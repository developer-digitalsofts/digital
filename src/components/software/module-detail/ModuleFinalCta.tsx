import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CmsLink } from '../../CmsLink'
import type { ModuleFinalCtaModel } from '../../../types/moduleDetailPage'
import { useI18n } from '../../../i18n/I18nProvider'
import { moduleShellClass } from './moduleConstants'

type Props = {
  model: ModuleFinalCtaModel
}

export function ModuleFinalCta({ model }: Props) {
  const { lang } = useI18n()
  const ChevronFwd = lang === 'ar' ? ChevronLeft : ChevronRight

  return (
    <section className="mod-section mod-section--cta">
      <div className={moduleShellClass}>
        <div className="mod-final-cta">
          <h2 className="mod-h2">{model.heading}</h2>
          <p className="mod-lead">{model.sub}</p>
          <div className="mod-final-cta__actions">
            <CmsLink to={model.ctaPrimary.to} className="mod-btn mod-btn--primary">
              {model.ctaPrimary.label}
              <ChevronFwd className="size-4" aria-hidden />
            </CmsLink>
            <a
              href={model.ctaSecondary.to}
              target="_blank"
              rel="noopener noreferrer"
              className="mod-btn mod-btn--whatsapp"
            >
              {model.ctaSecondary.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
