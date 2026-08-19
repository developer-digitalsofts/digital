import { ArrowRight, CalendarCheck } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { resolveDemoCtaCms } from '../cms/resolveHomepageCms'
import { ScrollReveal } from './ScrollReveal'
import { sectionWhite } from '../ui/saas'
import './demo-cta.css'

function scrollToPersonalizedDemo() {
  const target = document.getElementById('personalized-demo')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  window.location.hash = 'personalized-demo'
}

export function DemoCTASection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const copy = resolveDemoCtaCms(data ?? undefined, t, lang)

  if (!copy.enabled) return null

  return (
    <section id="demo-cta" className={`dm-demo-cta scroll-mt-28 ${sectionWhite} compact-home-section compact-home-section--demo-cta`}>
      <div className="industries-section__container">
        <ScrollReveal>
          <div className="dm-demo-cta__strip demo-cta-strip__card">
            <div className="dm-demo-cta__icon-wrap" aria-hidden>
              <CalendarCheck className="dm-demo-cta__icon" strokeWidth={2} />
            </div>

            <div className="dm-demo-cta__copy">
              <h2 className="dm-demo-cta__title">{copy.title}</h2>
              <p className="dm-demo-cta__desc">{copy.description}</p>
            </div>

            <button type="button" className="dm-demo-cta__button" onClick={scrollToPersonalizedDemo}>
              {copy.buttonLabel}
              <ArrowRight className="dm-demo-cta__button-icon" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
