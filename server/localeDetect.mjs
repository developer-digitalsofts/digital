/** Geo country detection from request headers. */
export function detectCountryFromRequest(req) {
  const header =
    req.headers['cf-ipcountry'] ||
    req.headers['x-country-code'] ||
    req.headers['x-vercel-ip-country'] ||
    req.headers['cloudfront-viewer-country']
  const code = typeof header === 'string' ? header.trim().toUpperCase() : ''
  const allowed = new Set(['AE', 'SA', 'KW', 'QA', 'BH', 'OM'])
  return allowed.has(code) ? code : null
}
