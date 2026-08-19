import { useMemo } from 'react'
import type { SoftwareDetailPageData } from '../../data/softwareDetail/types'
import { mapModuleMasterSections } from '../../data/softwareDetail/mapModuleMasterSections'
import { useI18n } from '../../i18n/I18nProvider'
import { ModuleDetailPageView } from './module-detail/ModuleDetailPageView'

type Props = {
  detail: SoftwareDetailPageData
  displayName: string
  crumbMid: string
  crumbHome: string
  slug: string
  showBreadcrumb?: boolean
}

/** Inventory-master renderer for all module detail routes (`/software/:flatSlug`). */
export function ModuleDetailTemplate({
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
    () => mapModuleMasterSections(detail, slug, productLabel, lang),
    [detail, slug, productLabel, lang],
  )

  return (
    <ModuleDetailPageView
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
