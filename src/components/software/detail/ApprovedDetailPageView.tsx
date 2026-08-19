import { useEffect, useId } from 'react'
import type { ApprovedDetailPageSections } from '../../../types/detailPageSections'
import { useDetailPageInquiry } from '../useDetailPageInquiry'
import { DetailHero } from './DetailHero'
import { MetricsStrip } from './MetricsStrip'
import { ConnectedWorkflow } from './ConnectedWorkflow'
import { ProductOverview } from './ProductOverview'
import { ImageFeatureCards } from './ImageFeatureCards'
import { AnnotatedProductView } from './AnnotatedProductView'
import { ChallengeSolution } from './ChallengeSolution'
import { AlternatingBenefits } from './AlternatingBenefits'
import { RoleBenefits } from './RoleBenefits'
import { TestimonialResults } from './TestimonialResults'
import { ImplementationSteps } from './ImplementationSteps'
import { DetailCapabilitiesTabs } from './DetailCapabilitiesTabs'
import { DetailDemoCta } from './DetailDemoCta'
import { DetailFaqSection } from './DetailFaqSection'
import '../accounts/accounts-prototype.css'

type TemplateKind = 'module' | 'industry'

type Props = {
  template: TemplateKind
  sections: ApprovedDetailPageSections
  displayName: string
  slug: string
  breadcrumb?: { home: string; mid: string; current: string }
  metaTitle: string
  metaDescription: string
}

export function ApprovedDetailPageView({
  template,
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

  const moduleBody = (
    <>
      <ProductOverview model={sections.overview} />
      {sections.imageFeatures ? <ImageFeatureCards model={sections.imageFeatures} /> : null}
      {sections.annotatedView ? <AnnotatedProductView model={sections.annotatedView} /> : null}
      {sections.challengeSolution ? <ChallengeSolution model={sections.challengeSolution} /> : null}
      {sections.alternatingBenefits ? <AlternatingBenefits items={sections.alternatingBenefits} /> : null}
      {sections.capabilities ? <DetailCapabilitiesTabs model={sections.capabilities} /> : null}
      {sections.industriesSection ? <ImageFeatureCards model={sections.industriesSection} /> : null}
    </>
  )

  const industryBody = (
    <>
      {sections.challengeSolution ? <ChallengeSolution model={sections.challengeSolution} /> : null}
      <ProductOverview model={sections.overview} />
      {sections.imageFeatures ? <ImageFeatureCards model={sections.imageFeatures} /> : null}
      {sections.annotatedView ? <AnnotatedProductView model={sections.annotatedView} /> : null}
      {sections.alternatingBenefits ? <AlternatingBenefits items={sections.alternatingBenefits} /> : null}
      {sections.roles ? <RoleBenefits heading={sections.roles.heading} items={sections.roles.items} /> : null}
      {sections.capabilities ? <DetailCapabilitiesTabs model={sections.capabilities} /> : null}
      {sections.industriesSection ? <ImageFeatureCards model={sections.industriesSection} /> : null}
    </>
  )

  return (
    <main
      className="accounts-proto border-t border-slate-100 bg-white"
      data-approved-detail={template}
      data-detail-slug={slug}
    >
      <DetailHero model={sections.hero} breadcrumb={breadcrumb} />
      <MetricsStrip metrics={sections.metrics} />
      {sections.workflow ? (
        <ConnectedWorkflow heading={sections.workflow.heading} steps={sections.workflow.steps} />
      ) : null}
      {template === 'module' ? moduleBody : industryBody}
      {sections.testimonial ? <TestimonialResults model={sections.testimonial} /> : null}
      {sections.implementation ? <ImplementationSteps model={sections.implementation} /> : null}
      <DetailDemoCta
        uid={uid}
        model={sections.demo}
        demoEmail={demoEmail}
        setDemoEmail={setDemoEmail}
        onSubmit={onSubmit}
        submitStatus={submitStatus}
      />
      {sections.faqs ? <DetailFaqSection model={sections.faqs} /> : null}
    </main>
  )
}
