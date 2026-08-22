import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCms } from '../cms/CmsContext'
import { useI18n } from '../i18n/I18nProvider'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import type { CountriesDoc, CountryProfile, ResolvedCountryProfile } from '../types/countriesContent'
import type { GccCountryCode } from '../config/gccCountries'
import {
  GCC_COUNTRY_FLAGS,
  LOCALE_STORAGE_KEY,
  LOCALE_SUGGEST_DISMISS_KEY,
  codeToCountrySlug,
  countrySlugToCode,
  isDefaultLocale,
  localeDefaultsForCountry,
  type LocaleCountrySlug,
  type LocaleLang,
} from './localeConfig'
import { buildLocalizedHref, localePathFromQueryCountry, parseLocalePath } from './localePaths'

type LocaleContextValue = {
  country: LocaleCountrySlug
  lang: LocaleLang
  countryCode: string
  countries: ResolvedCountryProfile[]
  activeCountry: ResolvedCountryProfile | null
  isDefaultLocaleRoute: boolean
  localePrefix: string
  editorialStatus: 'draft' | 'published'
  noIndex: boolean
  setLocale: (country: LocaleCountrySlug, lang: LocaleLang, opts?: { replace?: boolean }) => void
  href: (internalPath: string) => string
  loading: boolean
  suggestCountry: LocaleCountrySlug | null
  dismissCountrySuggest: () => void
  acceptCountrySuggest: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function readBi(value: unknown, lang: LocaleLang): string {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value === 'object') return pick(value as Bilingual, lang)
  return ''
}

function resolveProfile(item: CountryProfile, lang: LocaleLang, fallback?: ResolvedCountryProfile): ResolvedCountryProfile {
  const whatsappNumber = String(item.whatsappNumber ?? fallback?.whatsappNumber ?? '').replace(/\D/g, '')
  const code = (item.code ?? 'AE').toUpperCase() as GccCountryCode
  return {
    code,
    name: readBi(item.name, lang) || code,
    shortName: readBi(item.shortName, lang) || readBi(item.name, lang) || code,
    currency: item.currency || fallback?.currency || 'AED',
    phoneCode: item.phoneCode || fallback?.phoneCode || '+971',
    primaryEmail: item.primaryEmail || fallback?.primaryEmail || '',
    salesEmail: item.salesEmail || fallback?.salesEmail || fallback?.primaryEmail || '',
    supportEmail: item.supportEmail || fallback?.supportEmail || fallback?.primaryEmail || '',
    phoneDisplay: item.phoneDisplay || fallback?.phoneDisplay || '',
    phoneHref: item.phoneHref || fallback?.phoneHref || '',
    whatsappNumber,
    whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : fallback?.whatsappUrl || '',
    officeAddress: readBi(item.officeAddress, lang) || fallback?.officeAddress || '',
    workingHours: readBi(item.workingHours, lang) || fallback?.workingHours || '',
    isDefault: item.isDefault === true,
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { data } = useCms()
  const { lang: i18nLang, setLang } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const parsed = useMemo(() => parseLocalePath(location.pathname), [location.pathname])

  const doc = (data?.countries ?? { items: [] }) as CountriesDoc
  const lang = parsed.hasLocalePrefix ? parsed.lang : (i18nLang as LocaleLang)
  const country = parsed.country
  const countryCode = countrySlugToCode(country)
  const defaults = localeDefaultsForCountry(country)

  const countries = useMemo(() => {
    const raw = [...(doc.items || [])]
      .filter((item) => item.enabled !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    const defaultItem = raw.find((item) => item.isDefault) || raw[0]
    const defaultResolved = defaultItem ? resolveProfile(defaultItem, lang) : null
    return raw.map((item) => resolveProfile(item, lang, defaultResolved ?? undefined))
  }, [doc.items, lang])

  const [suggestCountry, setSuggestCountry] = useState<LocaleCountrySlug | null>(null)

  useEffect(() => {
    if (parsed.hasLocalePrefix && parsed.lang !== i18nLang) setLang(parsed.lang)
  }, [parsed.hasLocalePrefix, parsed.lang, i18nLang, setLang])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const legacy = params.get('country')
    if (!legacy) return
    const target = localePathFromQueryCountry(legacy, lang, location.pathname)
    params.delete('country')
    const qs = params.toString()
    navigate(`${target}${qs ? `?${qs}` : ''}`, { replace: true })
  }, [location.search, location.pathname, lang, navigate])

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify({ country, lang }))
    } catch {
      /* ignore */
    }
  }, [country, lang])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(LOCALE_SUGGEST_DISMISS_KEY)) return
    if (!isDefaultLocale(country, lang)) return

    const hinted = (window as Window & { __DM_COUNTRY_HINT__?: string }).__DM_COUNTRY_HINT__
    if (hinted) {
      queueMicrotask(() => {
        const slug = codeToCountrySlug(hinted)
        if (slug !== 'ae') setSuggestCountry(slug)
      })
      return
    }

    fetch('/api/public/locale-hint')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { countryCode?: string } | null) => {
        if (!data?.countryCode) return
        ;(window as Window & { __DM_COUNTRY_HINT__?: string }).__DM_COUNTRY_HINT__ = data.countryCode
        const slug = codeToCountrySlug(data.countryCode)
        if (slug !== 'ae') setSuggestCountry(slug)
      })
      .catch(() => {})
  }, [country, lang])

  const setLocale = useCallback(
    (nextCountry: LocaleCountrySlug, nextLang: LocaleLang, opts?: { replace?: boolean }) => {
      navigate(buildLocalizedHref(nextCountry, nextLang, parsed.restPath), { replace: opts?.replace ?? false })
      setLang(nextLang)
    },
    [navigate, parsed.restPath, setLang],
  )

  const dismissCountrySuggest = useCallback(() => {
    try {
      localStorage.setItem(LOCALE_SUGGEST_DISMISS_KEY, String(Date.now()))
    } catch {
      /* ignore */
    }
    setSuggestCountry(null)
  }, [])

  const acceptCountrySuggest = useCallback(() => {
    if (!suggestCountry) return
    setLocale(suggestCountry, lang, { replace: true })
    setSuggestCountry(null)
  }, [suggestCountry, lang, setLocale])

  const activeCountry = useMemo(
    () => countries.find((c) => c.code === countryCode) || countries.find((c) => c.isDefault) || countries[0] || null,
    [countries, countryCode],
  )

  const value = useMemo(
    (): LocaleContextValue => ({
      country,
      lang,
      countryCode,
      countries,
      activeCountry,
      isDefaultLocaleRoute: isDefaultLocale(country, lang),
      localePrefix: isDefaultLocale(country, lang) ? '' : `/${country}/${lang}`,
      editorialStatus: defaults.editorialStatus,
      noIndex: defaults.noIndex,
      setLocale,
      href: (internalPath: string) => buildLocalizedHref(country, lang, internalPath),
      loading: !data,
      suggestCountry,
      dismissCountrySuggest,
      acceptCountrySuggest,
    }),
    [country, lang, countryCode, countries, activeCountry, defaults, setLocale, data, suggestCountry, dismissCountrySuggest, acceptCountrySuggest],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useCountry() {
  const locale = useLocale()
  return {
    countryCode: locale.countryCode as 'AE' | 'SA' | 'KW' | 'QA' | 'BH' | 'OM',
    setCountryCode: (code: string) => locale.setLocale(codeToCountrySlug(code), locale.lang),
    countries: locale.countries,
    activeCountry: locale.activeCountry,
    loading: locale.loading,
  }
}

export function useCountryFlag(code: string): string {
  return GCC_COUNTRY_FLAGS[code] ?? code
}
