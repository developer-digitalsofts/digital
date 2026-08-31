import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { LocaleCountrySlug, LocaleLang, TranslationStatus } from '../locale/localeConfig'
import { DEFAULT_LOCALE } from '../locale/localeConfig'
import {
  ADMIN_FIXED_COUNTRY,
  ADMIN_FIXED_LANG,
  ADMIN_PK_ONLY,
  ADMIN_WEBSITE_CONTENT_LABEL,
} from './adminMarketConfig'

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
  ae: 'Pakistan',
}

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null)

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<LocaleCountrySlug>(ADMIN_PK_ONLY ? ADMIN_FIXED_COUNTRY : DEFAULT_LOCALE.country)
  const [lang, setLang] = useState<LocaleLang>(ADMIN_PK_ONLY ? ADMIN_FIXED_LANG : DEFAULT_LOCALE.lang)
  const [dirty, setDirty] = useState(false)

  const setCountry = useCallback(
    (next: LocaleCountrySlug) => {
      if (ADMIN_PK_ONLY) {
        if (next !== ADMIN_FIXED_COUNTRY) return
        return
      }
      if (dirty && !window.confirm('You have unsaved changes. Switch locale context anyway?')) return
      setCountryState(next)
      setDirty(false)
    },
    [dirty],
  )

  const setLangWithGuard = useCallback(
    (next: LocaleLang) => {
      if (ADMIN_PK_ONLY) {
        if (next !== ADMIN_FIXED_LANG) return
        return
      }
      if (dirty && !window.confirm('You have unsaved changes. Switch locale context anyway?')) return
      setLang(next)
      setDirty(false)
    },
    [dirty],
  )

  const value = useMemo((): AdminLocaleContextValue => {
    return {
      country: ADMIN_PK_ONLY ? ADMIN_FIXED_COUNTRY : country,
      lang: ADMIN_PK_ONLY ? ADMIN_FIXED_LANG : lang,
      countryLabel: LABELS[ADMIN_PK_ONLY ? ADMIN_FIXED_COUNTRY : country] || 'Pakistan',
      langLabel: 'English',
      dirty,
      setDirty,
      setCountry,
      setLang: setLangWithGuard,
      inheritanceLabel: ADMIN_WEBSITE_CONTENT_LABEL,
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
