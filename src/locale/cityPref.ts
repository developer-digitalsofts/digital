import { CITY_PREF_COOKIE, CITY_PREF_MAX_AGE_SEC, CITY_PREF_STORAGE_KEY, isPkCitySlug } from '../market/pakistanConfig'

export type CityPref = {
  citySlug: string
  manual?: boolean
}

function readCookiePref(): CityPref | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${CITY_PREF_COOKIE}=([^;]*)`))
  if (!match) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as CityPref
    if (!isPkCitySlug(parsed.citySlug)) return null
    return parsed
  } catch {
    return null
  }
}

export function readCityPref(): CityPref | null {
  return readCookiePref()
}

export function writeCityPref(pref: CityPref) {
  if (!isPkCitySlug(pref.citySlug)) return
  const payload = encodeURIComponent(JSON.stringify({ citySlug: pref.citySlug, manual: pref.manual === true }))
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CITY_PREF_COOKIE}=${payload}; Path=/; Max-Age=${CITY_PREF_MAX_AGE_SEC}; SameSite=Lax${secure}`
  try {
    localStorage.setItem(CITY_PREF_STORAGE_KEY, JSON.stringify({ citySlug: pref.citySlug }))
  } catch {
    /* ignore */
  }
}

/** Explicit city URL wins — sync saved preference after the route is active. */
export function syncCityPrefFromUrl(citySlug: string) {
  if (!isPkCitySlug(citySlug)) return
  writeCityPref({ citySlug, manual: false })
}

export function clearCityPref() {
  document.cookie = `${CITY_PREF_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
  try {
    localStorage.removeItem(CITY_PREF_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
