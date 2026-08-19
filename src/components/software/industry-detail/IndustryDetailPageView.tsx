import { useEffect, useId } from 'react'
import type { IndustryDetailPageSections } from '../../../types/industryDetailPage'
import { useDetailPageInquiry } from '../useDetailPageInquiry'
import { DetailDemoCta } from '../detail/DetailDemoCta'
import { IndustryHero } from './IndustryHero'
import { IndustryMetrics } from './IndustryMetrics'
import { IndustryWorkflow } from './IndustryWorkflow'
import { IndustryOperationalCards } from './IndustryOperationalCards'
import { IndustryChallengeSolution } from './IndustryChallengeSolution'
import { IndustryDashboardShowcase } from './IndustryDashboardShowcase'
import { IndustryAnalytics } from './IndustryAnalytics'
import { IndustryAlternatingBenefits } from './IndustryAlternatingBenefits'
import { IndustryRoles } from './IndustryRoles'
import { IndustryBusinessTypes } from './IndustryBusinessTypes'
import { IndustryTestimonial } from './IndustryTestimonial'
import { IndustryImplementation } from './IndustryImplementation'
import { IndustryFinalCta } from './IndustryFinalCta'
import { IndustryFaqSection } from './IndustryFaqSection'
import './industry-detail.css'

type Props = {
  sections: IndustryDetailPageSections
  displayName: string
  slug: string
  breadcrumb?: { home: string; mid: string; current: string }
  metaTitle: string
  metaDescription: string
}

/** Petrol & CNG master layout for all industry detail pages. */
export function IndustryDetailPageView({
  sections,
  displayName,
  slug,
  breadcrumb,
  metaTitle,
  metaDescription,
}: Props) {
  const uid = useId()
  const { demoEmail, setDemoEmail, submitStatus, onSubmit } = useDetailPageInquiry(displayName, slug)

  useEffect(() => {
    document.title = metaTitle
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', metaDescription)
    return () => {
      document.title = 'DigitalManager'
    }
  }, [metaTitle, metaDescription])

  return (
    <main
      className="ind-page border-t border-slate-100 bg-white"
      data-industry-detail
      data-detail-slug={slug}
    >
      <IndustryHero model={sections.hero} breadcrumb={breadcrumb} slug={slug} />
      <IndustryMetrics metrics={sections.metrics} />
      <IndustryWorkflow model={sections.workflow} />
      {sections.operationalCards.length > 0 ? (
        <IndustryOperationalCards cards={sections.operationalCards} />
      ) : null}
      <IndustryChallengeSolution model={sections.challengeSolution} />
      <IndustryDashboardShowcase model={sections.dashboardShowcase} slug={slug} />
      <IndustryAnalytics model={sections.analytics} slug={slug} />
      <IndustryAlternatingBenefits rows={sections.benefitRows} />
      <IndustryRoles model={sections.roles} />
      <IndustryBusinessTypes model={sections.businessTypes} />
      {sections.testimonial ? <IndustryTestimonial model={sections.testimonial} /> : null}
      <IndustryImplementation model={sections.implementation} />
      <IndustryFinalCta model={sections.finalCta} />
      <div className="ind-demo-wrap">
        <DetailDemoCta
          uid={uid}
          model={sections.demo}
          demoEmail={demoEmail}
          setDemoEmail={setDemoEmail}
          onSubmit={onSubmit}
          submitStatus={submitStatus}
        />
      </div>
      {sections.faqs ? <IndustryFaqSection model={sections.faqs} /> : null}
    </main>
  )
}
