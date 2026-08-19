import { useMemo } from 'react'
import type { SoftwareDetailPageData } from '../../data/softwareDetail/types'
import { mapIndustryMasterSections } from '../../data/softwareDetail/mapIndustryMasterSections'
import { useI18n } from '../../i18n/I18nProvider'
import { IndustryDetailPageView } from './industry-detail/IndustryDetailPageView'

type Props = {
  detail: SoftwareDetailPageData
  displayName: string
  crumbMid: string
  crumbHome: string
  slug: string
  showBreadcrumb?: boolean
}

/** Shared renderer for all industry detail routes (`/software/industry/:slug`). */
export function IndustryDetailTemplate({
  detail,
  displayName,
  crumbMid,
  crumbHome,
  slug,
  showBreadcrumb = true,
}: Props) {
  const { lang } = useI18n()

  const productLabel = useMemo(
    () => displayName.replace(/\s+Software$/i, '').replace(/\s+ERP$/i, '').trim() || displayName,
    [displayName],
  )

  const sections = useMemo(
    () => mapIndustryMasterSections(detail, slug, productLabel, lang),
    [detail, slug, productLabel, lang],
  )

  return (
    <IndustryDetailPageView
      sections={sections}
      displayName={displayName}
      slug={slug}
      metaTitle={detail.metaTitle}
      metaDescription={detail.metaDescription}
      breadcrumb={
        showBreadcrumb ? { home: crumbHome, mid: crumbMid, current: displayName } : undefined
      }
    />
  )
}
