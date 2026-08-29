import { useMemo } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from './CmsContext'
import { pick } from './pick'
import type { Bilingual } from './types'

function normBi(v: unknown): Bilingual {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const b = v as Record<string, unknown>
    return { en: String(b.en ?? ''), ar: String(b.ar ?? '') }
  }
  return { en: '', ar: '' }
}

import { PK_CONTACT_PLACEHOLDERS } from '../market/pakistanConfig'

const FALLBACK = {
  primaryEmail: PK_CONTACT_PLACEHOLDERS.primaryEmail,
  salesEmail: PK_CONTACT_PLACEHOLDERS.salesEmail,
  supportEmail: PK_CONTACT_PLACEHOLDERS.supportEmail,
  phoneDisplay: PK_CONTACT_PLACEHOLDERS.phoneDisplay,
  phoneHref: PK_CONTACT_PLACEHOLDERS.phoneHref,
  whatsappNumber: PK_CONTACT_PLACEHOLDERS.whatsappNumber,
  defaultCountry: { en: 'Pakistan', ar: 'Pakistan' },
  defaultCurrency: 'PKR',
  defaultPhoneCode: '+92',
  workingHours: {
    en: PK_CONTACT_PLACEHOLDERS.workingHours,
    ar: PK_CONTACT_PLACEHOLDERS.workingHours,
  },
  officeAddress: {
    en: PK_CONTACT_PLACEHOLDERS.officeAddress,
    ar: PK_CONTACT_PLACEHOLDERS.officeAddress,
  },
} as const

export type SiteSettingsView = {
  primaryEmail: string
  salesEmail: string
  supportEmail: string
  phoneDisplay: string
  phoneHref: string
  whatsappNumber: string
  whatsappUrl: string
  defaultCountry: string
  defaultCurrency: string
  defaultPhoneCode: string
  phonePlaceholder: string
  officeAddress: string
  workingHours: string
  logoUrl: string
  faviconUrl: string
  demoPageLink: string
  primaryCtaLabel: string
  defaultSeoTitle: string
  defaultMetaDescription: string
  ogImageUrl: string
}

export function useSiteSettings(): SiteSettingsView {
  const { data } = useCms()
  const { lang } = useI18n()
  const raw = (data?.siteSettings ?? {}) as Record<string, unknown>

  return useMemo(() => {
    const whatsappNumber = String(raw.whatsappNumber ?? FALLBACK.whatsappNumber).replace(/\D/g, '')
    const defaultPhoneCode = String(raw.defaultPhoneCode ?? FALLBACK.defaultPhoneCode)
    return {
      primaryEmail: String(raw.primaryEmail ?? FALLBACK.primaryEmail),
      salesEmail: String(raw.salesEmail ?? FALLBACK.salesEmail),
      supportEmail: String(raw.supportEmail ?? FALLBACK.supportEmail),
      phoneDisplay: String(raw.phoneDisplay ?? FALLBACK.phoneDisplay),
      phoneHref: String(raw.phoneHref ?? FALLBACK.phoneHref),
      whatsappNumber,
      whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : `https://wa.me/${FALLBACK.whatsappNumber}`,
      defaultCountry: pick(normBi(raw.defaultCountry ?? FALLBACK.defaultCountry), lang),
      defaultCurrency: String(raw.defaultCurrency ?? FALLBACK.defaultCurrency),
      defaultPhoneCode,
      phonePlaceholder: `${defaultPhoneCode} …`,
      officeAddress: pick(normBi(raw.officeAddress ?? FALLBACK.officeAddress), lang),
      workingHours: pick(normBi(raw.workingHours ?? FALLBACK.workingHours), lang),
      logoUrl: String(raw.logoUrl ?? '/digitalmanager.svg'),
      faviconUrl: String(raw.faviconUrl ?? '/digitalmanager-favicon.png'),
      demoPageLink: String(raw.demoPageLink ?? '/contact#contact-form'),
      primaryCtaLabel: pick(normBi(raw.primaryCtaLabel ?? { en: 'Get Demo', ar: 'احصل على عرض' }), lang),
      defaultSeoTitle: pick(
        normBi(raw.defaultSeoTitle ?? { en: 'DigitalManager — Cloud ERP for Pakistan', ar: 'DigitalManager — Cloud ERP for Pakistan' }),
        lang,
      ),
      defaultMetaDescription: pick(
        normBi(raw.defaultMetaDescription ?? {
          en: 'Cloud ERP software for retail, manufacturing, logistics and services across Pakistan.',
          ar: 'Cloud ERP software for retail, manufacturing, logistics and services across Pakistan.',
        }),
        lang,
      ),
      ogImageUrl: String(raw.ogImageUrl ?? ''),
    }
  }, [raw, lang])
}
