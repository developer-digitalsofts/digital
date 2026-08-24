import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  codeToCountrySlug,
  countrySlugToCode,
  isDefaultLocale,
  localeDefaultsForCountry,
  type LocaleCountrySlug,
  type LocaleLang,
} from './localeConfig'
import { buildLocalizedHref, localePathFromQueryCountry, parseLocalePath } from './localePaths'
import { clearLocalePref, readLocalePref, writeLocalePref } from './localePref'

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
  resetAutoLocale: () => void
  hasManualLocalePref: boolean
  href: (internalPath: string) => string
  loading: boolean
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
  const { data, localeMeta } = useCms()
  const { lang: i18nLang, setLang } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const parsed = useMemo(() => parseLocalePath(location.pathname), [location.pathname])
  const autoRoutingChecked = useRef(false)

  const doc = (data?.countries ?? { items: [] }) as CountriesDoc
  const lang = parsed.hasLocalePrefix ? parsed.lang : (i18nLang as LocaleLang)
  const country = parsed.country
  const countryCode = countrySlugToCode(country)
  const defaults = localeDefaultsForCountry(country)
  const manualPref = useMemo(() => readLocalePref(), [location.pathname, location.key])

  const countries = useMemo(() => {
    const raw = [...(doc.items || [])]
      .filter((item) => item.enabled !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    const defaultItem = raw.find((item) => item.isDefault) || raw[0]
    const defaultResolved = defaultItem ? resolveProfile(defaultItem, lang) : null
    return raw.map((item) => resolveProfile(item, lang, defaultResolved ?? undefined))
  }, [doc.items, lang])

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
    if (autoRoutingChecked.current) return
    if (location.pathname !== '/') return
    autoRoutingChecked.current = true

    fetch('/api/public/locale-routing?path=/', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((payload: { redirect?: string | null } | null) => {
        const target = payload?.redirect
        if (target && target !== '/' && location.pathname === '/') {
          const localized = parseLocalePath(target)
          writeLocalePref({ country: localized.country, lang: localized.lang, manual: false })
          navigate(target, { replace: true })
        }
      })
      .catch(() => {})
  }, [location.pathname, navigate])

  const setLocale = useCallback(
    (nextCountry: LocaleCountrySlug, nextLang: LocaleLang, opts?: { replace?: boolean }) => {
      writeLocalePref({ country: nextCountry, lang: nextLang, manual: true })
      navigate(buildLocalizedHref(nextCountry, nextLang, parsed.restPath), { replace: opts?.replace ?? false })
      setLang(nextLang)
    },
    [navigate, parsed.restPath, setLang],
  )

  const resetAutoLocale = useCallback(() => {
    clearLocalePref()
    autoRoutingChecked.current = false
    navigate('/', { replace: true })
  }, [navigate])

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
      editorialStatus: localeMeta?.fallbackUsed ? ('draft' as const) : defaults.editorialStatus,
      noIndex: localeMeta?.noIndex ?? defaults.noIndex,
      setLocale,
      resetAutoLocale,
      hasManualLocalePref: manualPref?.manual === true,
      href: (internalPath: string) => buildLocalizedHref(country, lang, internalPath),
      loading: !data,
    }),
    [country, lang, countryCode, countries, activeCountry, defaults, setLocale, resetAutoLocale, manualPref, data, localeMeta],
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
