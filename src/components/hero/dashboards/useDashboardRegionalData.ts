import { useMemo } from 'react'
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
  const localeRegional = useSoftwareDetailRegional()
  return useMemo(() => {
    if (localeRegional) return localeRegional
    return getDashboardRegionalData(countryCode)
  }, [localeRegional, countryCode, lang])
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
