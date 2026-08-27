import type { Lang } from '../i18n/messages'
import type { ModuleRichPage } from '../data/moduleRichPages'
import type { SoftwareDetailPageData } from '../data/softwareDetail/types'

export type LocaleSoftwareDetailRegional = {
  currency: string
  currencyName?: string
  countryCode?: string
  countryName?: string
  cityPhrase?: string
  cities: string[]
  companies: string[]
  vatLabel?: string
  dashboard?: {
    erpRevenue?: string
    erpGross?: string
    erpReceivables?: string
    branchAmounts?: string[]
    financeCash?: string
    posToday?: string
    posBasket?: string
    inventoryValue?: string
    hrPayroll?: string
    moduleCashFlow?: string
    modulePosSales?: string
    modulePayroll?: string
  }
  branches?: { city: string; amount: string }[]
}

export type LocaleSoftwareDetailPage = {
  template?: string
  kind?: string
  slug?: string
  title?: string
  heading?: string
  shortDescription?: string
  label?: string
  hero?: {
    eyebrow?: string
    headline?: string
    subhead?: string
    intro?: string
    ctaPrimary?: string
    ctaSecondary?: string
  }
  demoCta?: {
    heading?: string
    sub?: string
  }
  fields?: Record<string, string>
  regional?: LocaleSoftwareDetailRegional | null
  seo?: Record<string, unknown>
  _locale?: {
    fallbackUsed?: boolean
    noIndex?: boolean
    publicationStatus?: string
  }
}

function pick(value: string | undefined, fallback: string): string {
  return value?.trim() ? value.trim() : fallback
}

/** Merge published locale CMS record into rich page copy (hero fields). */
export function applyLocaleToRichPage(
  rich: ModuleRichPage,
  locale: LocaleSoftwareDetailPage | null | undefined,
  _lang: Lang,
): ModuleRichPage {
  if (!locale) return rich
  const hero = locale.hero
  const fields = locale.fields
  return {
    ...rich,
    headline: pick(hero?.headline, pick(fields?.heroHeadline, pick(locale.heading, rich.headline))),
    subhead: pick(hero?.subhead, pick(fields?.heroSubhead, rich.subhead)),
    intro: pick(hero?.intro, pick(fields?.heroIntro, pick(locale.shortDescription, rich.intro))),
  }
}

/** Merge published locale CMS record into built detail page data. */
export function applyLocaleToDetailPage(
  detail: SoftwareDetailPageData,
  locale: LocaleSoftwareDetailPage | null | undefined,
  _lang: Lang,
): SoftwareDetailPageData {
  if (!locale) return detail
  const hero = locale.hero
  const fields = locale.fields
  const demo = locale.demoCta
  const metaTitle = pick(fields?.metaTitle, pick(locale.title, detail.metaTitle))
  const metaDescription = pick(fields?.metaDescription, pick(locale.shortDescription, detail.metaDescription))

  const next: SoftwareDetailPageData = {
    ...detail,
    metaTitle,
    metaDescription,
    hero: {
      ...detail.hero,
      eyebrow: pick(hero?.eyebrow, pick(fields?.heroEyebrow, detail.hero.eyebrow)),
      headline: pick(hero?.headline, pick(fields?.heroHeadline, detail.hero.headline)),
      subhead: pick(hero?.subhead, pick(fields?.heroSubhead, detail.hero.subhead)),
      intro: pick(hero?.intro, pick(fields?.heroIntro, detail.hero.intro)),
      ctaPrimary: {
        ...detail.hero.ctaPrimary,
        label: pick(hero?.ctaPrimary, detail.hero.ctaPrimary.label),
      },
      ctaSecondary: {
        ...detail.hero.ctaSecondary,
        label: pick(hero?.ctaSecondary, detail.hero.ctaSecondary.label),
      },
    },
    demoCta: {
      ...detail.demoCta,
      heading: pick(demo?.heading, pick(fields?.demoCtaHeading, detail.demoCta.heading)),
      sub: pick(demo?.sub, pick(fields?.demoCtaSub, detail.demoCta.sub)),
    },
  }

  if (locale.regional?.currency && locale.regional.cityPhrase) {
    const currency = locale.regional.currency
    const phrase = locale.regional.cityPhrase
    next.hero = {
      ...next.hero,
      trust: next.hero.trust.map((stat) => ({
        ...stat,
        label: stat.label
          .replace(/\bAED\b/g, currency)
          .replace(/Dubai, Abu Dhabi and Sharjah/gi, phrase)
          .replace(/United Arab Emirates/gi, locale.regional?.countryName || stat.label),
      })),
    }
  }

  return next
}

export function hasPublishedLocaleRegional(locale: LocaleSoftwareDetailPage | null | undefined): boolean {
  return Boolean(locale?.regional?.currency && locale?.regional?.cities?.length)
}
