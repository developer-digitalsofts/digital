import {
  LOCALE_PREF_COOKIE,
  LOCALE_PREF_MAX_AGE_SEC,
  LOCALE_STORAGE_KEY,
  type LocaleCountrySlug,
  type LocaleLang,
} from './localeConfig'

export type LocalePref = {
  country: LocaleCountrySlug
  lang: LocaleLang
  manual?: boolean
}

export function readLocalePref(): LocalePref | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_PREF_COOKIE}=([^;]*)`))
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[1])) as LocalePref
    } catch {
      return null
    }
  }
  try {
    const raw = localStorage.getItem(LOCALE_PREF_COOKIE)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LocalePref
    return { ...parsed, manual: parsed.manual === true }
  } catch {
    return null
  }
}

export function clearLocaleStoragePref() {
  try {
    localStorage.removeItem(LOCALE_PREF_COOKIE)
    localStorage.removeItem(LOCALE_STORAGE_KEY)
  } catch {
    /* ignore */
  }
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
  try {
    localStorage.setItem(LOCALE_PREF_COOKIE, JSON.stringify(pref))
  } catch {
    /* ignore */
  }
}

export function clearLocalePref() {
  document.cookie = `${LOCALE_PREF_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
  clearLocaleStoragePref()
}
