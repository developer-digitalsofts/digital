/**
 * Development helper — documents how to reset locale preference state.
 *
 * Usage:
 *   node scripts/clear-locale-pref.mjs
 *
 * Browser reset (recommended):
 *   1. Open DevTools → Application → Storage
 *   2. Delete cookie `dm_locale_pref`
 *   3. Delete localStorage key `dm_locale_pref`
 *   4. Hard refresh or click "Detect my country" in the site footer/mobile menu
 *
 * curl (server-side geo test only — does not clear browser storage):
 *   curl -sI -H "CF-IPCountry: QA" http://127.0.0.1:3040/
 *   curl -s "http://127.0.0.1:3040/api/public/locale-routing?path=/" -H "CF-IPCountry: QA"
 */

const BASE = (process.env.BASE_URL || 'http://127.0.0.1:3040').replace(/\/$/, '')

console.log(`
=== DigitalManager locale preference reset ===

Browser (clears saved country + language):
  • Footer or mobile menu → "Detect my country"
  • Or DevTools → Application → Cookies + Local Storage → remove "dm_locale_pref"

Production geo header check (Coolify/Cloudflare):
  curl -sI -H "CF-IPCountry: QA" ${BASE}/
  curl -sI -H "CF-IPCountry: SA" ${BASE}/
  curl -s "${BASE}/api/public/locale-routing?path=/" -H "CF-IPCountry: QA"

Explicit locale must not redirect:
  curl -sI -H "CF-IPCountry: QA" ${BASE}/bh/en

Crawler exemption:
  curl -sI -H "CF-IPCountry: QA" -A "Googlebot" ${BASE}/

SEO / indexability:
  curl -s "${BASE}/api/public/seo-page?path=/qa/en" | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8'))"
  curl -s "${BASE}/sitemap.xml" | findstr /i "qa/en"

Set TRUST_GEO_HEADERS=1 in development to test CF-IPCountry locally.
Set TRUST_GEO_HEADERS=0 to disable proxy geo headers in production (not recommended).
`)
