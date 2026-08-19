import { useEffect, useId } from 'react'
import type { ModuleDetailPageSections } from '../../../types/moduleDetailPage'
import { useDetailPageInquiry } from '../useDetailPageInquiry'
import { DetailDemoCta } from '../detail/DetailDemoCta'
import { ModuleHero } from './ModuleHero'
import { ModuleTrustMetrics } from './ModuleTrustMetrics'
import { ModuleStickyNav } from './ModuleStickyNav'
import { ModuleConnectedWorkflow } from './ModuleConnectedWorkflow'
import { ModuleCapabilityShowcase } from './ModuleCapabilityShowcase'
import { ModuleOperationalBenefits } from './ModuleOperationalBenefits'
import { ModuleFeatureStories } from './ModuleFeatureStories'
import { ModuleVisibilityDashboard } from './ModuleVisibilityDashboard'
import { ModuleChallengeSolution } from './ModuleChallengeSolution'
import { ModuleAlternatingSections } from './ModuleAlternatingSections'
import { ModuleTransactionTabs } from './ModuleTransactionTabs'
import { ModuleIntegrations } from './ModuleIntegrations'
import { ModuleRoleCards } from './ModuleRoleCards'
import { ModuleImplementationSteps } from './ModuleImplementationSteps'
import { ModuleFinalCta } from './ModuleFinalCta'
import { ModuleFaqSection } from './ModuleFaqSection'
import './module-detail.css'

type Props = {
  sections: ModuleDetailPageSections
  displayName: string
  slug: string
  breadcrumb?: { home: string; mid: string; current: string }
  metaTitle: string
  metaDescription: string
}

/** Inventory-master layout for all software module detail pages. */
export function ModuleDetailPageView({
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
      className="mod-page border-t border-slate-100 bg-white"
      data-module-detail
      data-detail-slug={slug}
    >
      <ModuleHero model={sections.hero} slug={slug} breadcrumb={breadcrumb} />
      <ModuleTrustMetrics metrics={sections.metrics} />
      <ModuleStickyNav items={sections.nav} />
      <ModuleConnectedWorkflow model={sections.workflow} />
      <ModuleCapabilityShowcase model={sections.capabilities} slug={slug} />
      <ModuleOperationalBenefits model={sections.operational} />
      <ModuleFeatureStories model={sections.featureStories} />
      <ModuleVisibilityDashboard model={sections.visibility} slug={slug} />
      <ModuleChallengeSolution model={sections.challengeSolution} />
      <ModuleAlternatingSections items={sections.alternating} slug={slug} />
      <ModuleTransactionTabs model={sections.transactions} />
      <ModuleIntegrations model={sections.integrations} />
      <ModuleRoleCards model={sections.roles} />
      <ModuleImplementationSteps model={sections.implementation} />
      <ModuleFinalCta model={sections.finalCta} />
      <div className="mod-demo-wrap">
        <DetailDemoCta
          uid={uid}
          model={sections.demo}
          demoEmail={demoEmail}
          setDemoEmail={setDemoEmail}
          onSubmit={onSubmit}
          submitStatus={submitStatus}
        />
      </div>
      {sections.faqs ? <ModuleFaqSection model={sections.faqs} /> : null}
    </main>
  )
}
