import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { LocaleCountrySlug, LocaleLang, TranslationStatus } from '../locale/localeConfig'
import { DEFAULT_LOCALE } from '../locale/localeConfig'

type AdminLocaleContextValue = {
  country: LocaleCountrySlug
  lang: LocaleLang
  countryLabel: string
  langLabel: string
  dirty: boolean
  setDirty: (dirty: boolean) => void
  setCountry: (country: LocaleCountrySlug) => void
  setLang: (lang: LocaleLang) => void
  inheritanceLabel: string
  translationStatus: TranslationStatus
}

const LABELS: Record<LocaleCountrySlug, string> = {
  ae: 'UAE',
  sa: 'Saudi Arabia',
  kw: 'Kuwait',
  qa: 'Qatar',
  bh: 'Bahrain',
  om: 'Oman',
}

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null)

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<LocaleCountrySlug>(DEFAULT_LOCALE.country)
  const [lang, setLang] = useState<LocaleLang>(DEFAULT_LOCALE.lang)
  const [dirty, setDirty] = useState(false)

  const setCountry = useCallback(
    (next: LocaleCountrySlug) => {
      if (dirty && !window.confirm('You have unsaved changes. Switch locale context anyway?')) return
      setCountryState(next)
      setDirty(false)
    },
    [dirty],
  )

  const setLangWithGuard = useCallback(
    (next: LocaleLang) => {
      if (dirty && !window.confirm('You have unsaved changes. Switch locale context anyway?')) return
      setLang(next)
      setDirty(false)
    },
    [dirty],
  )

  const value = useMemo((): AdminLocaleContextValue => {
    const isDefault = country === 'ae' && lang === 'en'
    const translationStatus: TranslationStatus = lang === 'ar' && country !== 'ae' ? 'missing' : isDefault ? 'published' : 'draft'
    const inheritanceLabel = isDefault
      ? 'Global UAE English (published baseline)'
      : lang === 'ar'
        ? 'Inherited from country default → global (Arabic not auto-published)'
        : 'Inherited from global content where locale override missing'

    return {
      country,
      lang,
      countryLabel: LABELS[country],
      langLabel: lang === 'en' ? 'English' : 'Arabic',
      dirty,
      setDirty,
      setCountry,
      setLang: setLangWithGuard,
      inheritanceLabel,
      translationStatus,
    }
  }, [country, lang, dirty, setCountry, setLangWithGuard])

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext)
  if (!ctx) throw new Error('useAdminLocale must be used within AdminLocaleProvider')
  return ctx
}
