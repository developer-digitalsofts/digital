import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { PK_CITY_SLUGS, PK_CITY_NAMES } from '../market/pakistanConfig'

type AdminCityContextValue = {
  citySlug: string | null
  cityName: string | null
  setCitySlug: (slug: string | null) => void
  cityRequired: boolean
  cities: { slug: string; name: string }[]
}

const AdminCityContext = createContext<AdminCityContextValue | null>(null)

const CITY_LIST = PK_CITY_SLUGS.map((slug) => ({ slug, name: PK_CITY_NAMES[slug] || slug }))

export function AdminCityProvider({
  children,
  initialCitySlug = null,
  cityRequired = false,
}: {
  children: ReactNode
  initialCitySlug?: string | null
  cityRequired?: boolean
}) {
  const [citySlug, setCitySlugState] = useState<string | null>(initialCitySlug ? initialCitySlug.toLowerCase() : null)

  const setCitySlug = useCallback((slug: string | null) => {
    setCitySlugState(slug ? slug.toLowerCase() : null)
  }, [])

  const value = useMemo((): AdminCityContextValue => {
    const name = citySlug ? (PK_CITY_NAMES[citySlug as keyof typeof PK_CITY_NAMES] || citySlug) : null
    return { citySlug, cityName: name, setCitySlug, cityRequired, cities: CITY_LIST }
  }, [citySlug, cityRequired, setCitySlug])

  return <AdminCityContext.Provider value={value}>{children}</AdminCityContext.Provider>
}

export function useAdminCity() {
  const ctx = useContext(AdminCityContext)
  if (!ctx) throw new Error('useAdminCity must be used within AdminCityProvider')
  return ctx
}

export function useOptionalAdminCity() {
  return useContext(AdminCityContext)
}
