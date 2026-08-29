import { useMemo } from 'react'
import { useCms } from '../../../cms/CmsContext'
import { useLocale } from '../../../locale/LocaleContext'
import { useSoftwareDetailRegional } from '../../../locale/SoftwareDetailRegionalContext'
import {
  getDashboardRegionalData,
  getDashboardRegionalDataFromLocale,
} from './dashboardRegionalData'
import type { LocaleSoftwareDetailRegional } from '../../../cms/applyLocaleSoftwareDetail'

/** Country-aware illustrative dashboard demo data for hero and detail mockups. */
export function useDashboardRegionalData() {
  const { countryCode, lang } = useLocale()
  const { data } = useCms()
  const localeRegional = useSoftwareDetailRegional()
  const homepageRegional = data?.regional
  return useMemo(() => {
    if (localeRegional) return localeRegional
    if (homepageRegional?.cities?.length) {
      return getDashboardRegionalDataFromLocale(countryCode, homepageRegional)
    }
    return getDashboardRegionalData(countryCode)
  }, [localeRegional, homepageRegional, countryCode, lang])
}

/** Build dashboard pack from CMS locale regional block (software-detail pages). */
export function useLocaleDashboardRegional(
  regional: LocaleSoftwareDetailRegional | null | undefined,
  countryCode: string,
) {
  return useMemo(() => {
    if (!regional?.currency) return null
    return getDashboardRegionalDataFromLocale(countryCode, regional)
  }, [regional, countryCode])
}
