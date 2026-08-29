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
  pk: 'Pakistan',
  ae: 'UAE',
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
    return {
      country,
      lang,
      countryLabel: LABELS[country] || 'Pakistan',
      langLabel: 'English',
      dirty,
      setDirty,
      setCountry,
      setLang: setLangWithGuard,
      inheritanceLabel: 'Pakistan English (published baseline)',
      translationStatus: 'published',
    }
  }, [country, lang, dirty, setCountry, setLangWithGuard])

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext)
  if (!ctx) throw new Error('useAdminLocale must be used within AdminLocaleProvider')
  return ctx
}
