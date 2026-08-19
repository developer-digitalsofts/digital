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

const FALLBACK = {
  primaryEmail: 'info@digitalmanager.ae',
  salesEmail: 'info@digitalmanager.ae',
  supportEmail: 'info@digitalmanager.ae',
  phoneDisplay: '+971 6 536 6786',
  phoneHref: 'tel:+97165366786',
  whatsappNumber: '971581174911',
  defaultCountry: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
  defaultCurrency: 'AED',
  defaultPhoneCode: '+971',
  workingHours: {
    en: 'Sat - Thu : 10.00 am - 9.00 pm',
    ar: 'السبت–الخميس: ١٠ ص – ٩ م',
  },
  officeAddress: {
    en: '607, Al Rahma 1, Al Wahda St, Sharjah, UAE',
    ar: '٦٠٧، الرحمة ١، شارع الوحدة، الشارقة، الإمارات',
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
        normBi(raw.defaultSeoTitle ?? { en: 'DigitalManager — Cloud ERP for UAE Businesses', ar: 'ديجيتال مانجر — ERP سحابي لأعمال الإمارات' }),
        lang,
      ),
      defaultMetaDescription: pick(
        normBi(raw.defaultMetaDescription ?? {
          en: 'Cloud ERP software for retail, manufacturing, logistics and services across the UAE.',
          ar: 'برمجيات ERP سحابية للتجزئة والتصنيع واللوجستيات والخدمات في الإمارات.',
        }),
        lang,
      ),
      ogImageUrl: String(raw.ogImageUrl ?? ''),
    }
  }, [raw, lang])
}
