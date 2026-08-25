import { useMemo } from 'react'
import { useLocale } from '../locale/LocaleContext'
import { useSiteSettings, type SiteSettingsView } from './useSiteSettings'

/** Site contact/settings merged with the active GCC country profile. */
export function useRegionalSettings(): SiteSettingsView {
  const site = useSiteSettings()
  const { activeCountry } = useLocale()

  return useMemo(() => {
    if (!activeCountry) return site
    return {
      ...site,
      primaryEmail: activeCountry.primaryEmail || site.primaryEmail,
      salesEmail: activeCountry.salesEmail || site.salesEmail,
      supportEmail: activeCountry.supportEmail || site.supportEmail,
      phoneDisplay: activeCountry.phoneDisplay || site.phoneDisplay,
      phoneHref: activeCountry.phoneHref || site.phoneHref,
      whatsappNumber: activeCountry.whatsappNumber || site.whatsappNumber,
      whatsappUrl: activeCountry.whatsappUrl || site.whatsappUrl,
      defaultCountry: activeCountry.name || site.defaultCountry,
      defaultCurrency: activeCountry.currency || site.defaultCurrency,
      defaultPhoneCode: activeCountry.phoneCode || site.defaultPhoneCode,
      phonePlaceholder: `${activeCountry.phoneCode || site.defaultPhoneCode} …`,
      officeAddress: activeCountry.officeAddress || site.officeAddress,
      workingHours: activeCountry.workingHours || site.workingHours,
    }
  }, [site, activeCountry])
}
