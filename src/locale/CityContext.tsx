import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  PK_CITY_NAMES,
  PK_CITY_SLUGS,
  buildCityHomePath,
  buildCitySoftwarePath,
  servingBusinessesIn,
  type PkCitySlug,
} from '../market/pakistanConfig'
import { parseCityPagePath } from './cityPaths'
import { clearCityPref, readCityPref, syncCityPrefFromUrl, writeCityPref } from './cityPref'

type CityContextValue = {
  citySlug: PkCitySlug | null
  cityName: string | null
  serviceArea: string
  isCityRoute: boolean
  savedCitySlug: PkCitySlug | null
  setCity: (next: PkCitySlug | null) => void
  cityHref: (internalPath: string) => string
}

const CityContext = createContext<CityContextValue | null>(null)

function stripCityPrefix(pathname: string): string {
  const parsed = parseCityPagePath(pathname)
  if (parsed.isCitySoftware && parsed.softwarePath) return parsed.softwarePath
  if (parsed.isCityHome) return '/'
  if (parsed.isLegacyCityProduct && parsed.softwarePath) return parsed.softwarePath
  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

export function CityProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const parsed = useMemo(() => parseCityPagePath(location.pathname), [location.pathname])
  const urlCity = parsed.isCityPage && parsed.citySlug ? (parsed.citySlug as PkCitySlug) : null
  const saved = readCityPref()?.citySlug
  const savedCitySlug = saved && PK_CITY_SLUGS.includes(saved as PkCitySlug) ? (saved as PkCitySlug) : null

  useEffect(() => {
    if (urlCity) syncCityPrefFromUrl(urlCity)
  }, [urlCity])

  const setCity = useCallback(
    (next: PkCitySlug | null) => {
      const rest = stripCityPrefix(location.pathname)
      if (!next) {
        clearCityPref()
        navigate(rest === '/' ? '/' : rest)
        return
      }
      writeCityPref({ citySlug: next, manual: true })
      navigate(rest === '/' ? buildCityHomePath(next) : buildCitySoftwarePath(next, rest))
    },
    [location.pathname, navigate],
  )

  const cityHref = useCallback(
    (internalPath: string) => {
      if (!urlCity) return internalPath.startsWith('/') ? internalPath : `/${internalPath}`
      return buildCitySoftwarePath(urlCity, internalPath)
    },
    [urlCity],
  )

  const value = useMemo((): CityContextValue => {
    const cityName = urlCity ? PK_CITY_NAMES[urlCity] : null
    return {
      citySlug: urlCity,
      cityName,
      serviceArea: cityName ? servingBusinessesIn(cityName) : 'Serving businesses across Pakistan',
      isCityRoute: Boolean(urlCity),
      savedCitySlug,
      setCity,
      cityHref,
    }
  }, [urlCity, savedCitySlug, setCity, cityHref])

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>
}

export function useCity() {
  const ctx = useContext(CityContext)
  if (!ctx) throw new Error('useCity must be used within CityProvider')
  return ctx
}

export function useOptionalCity() {
  return useContext(CityContext)
}
