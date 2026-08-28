import {
  LOCALE_PREF_COOKIE,
  LOCALE_PREF_MAX_AGE_SEC,
  LOCALE_VIEW_STORAGE_KEY,
  type LocaleCountrySlug,
  type LocaleLang,
} from './localeConfig'

export type LocalePref = {
  country: LocaleCountrySlug
  lang: LocaleLang
  manual?: boolean
}

function readCookiePref(): LocalePref | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_PREF_COOKIE}=([^;]*)`))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1])) as LocalePref
  } catch {
    return null
  }
}

/** Routing preference — cookie only (mirrors server dm_locale_pref). */
export function readLocalePref(): LocalePref | null {
  return readCookiePref()
}

export function writeLocalePref(pref: LocalePref) {
  const payload = encodeURIComponent(
    JSON.stringify({
      country: pref.country,
      lang: pref.lang,
      manual: pref.manual === true,
    }),
  )
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${LOCALE_PREF_COOKIE}=${payload}; Path=/; Max-Age=${LOCALE_PREF_MAX_AGE_SEC}; SameSite=Lax${secure}`
}

/** UI snapshot of the active locale — does not drive redirects. */
export function writeLocaleViewSnapshot(country: LocaleCountrySlug, lang: LocaleLang) {
  try {
    localStorage.setItem(LOCALE_VIEW_STORAGE_KEY, JSON.stringify({ country, lang }))
  } catch {
    /* ignore */
  }
}

/** Explicit URL wins — sync saved preference after the route is active (clears stale manual override). */
export function syncLocalePrefFromUrl(country: LocaleCountrySlug, lang: LocaleLang) {
  writeLocalePref({ country, lang, manual: false })
  writeLocaleViewSnapshot(country, lang)
}

export function clearLocalePref() {
  document.cookie = `${LOCALE_PREF_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
  try {
    localStorage.removeItem(LOCALE_VIEW_STORAGE_KEY)
    localStorage.removeItem(LOCALE_PREF_COOKIE)
  } catch {
    /* ignore */
  }
}
