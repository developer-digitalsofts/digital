/** Geo country detection from trusted proxy request headers. */
const ALLOWED = new Set(['AE', 'SA', 'KW', 'QA', 'BH', 'OM'])

function fromTestEnv() {
  const code = String(process.env.TEST_COUNTRY_CODE || '').trim().toUpperCase()
  return ALLOWED.has(code) ? code : null
}

function fromTrustedTestHeader(req) {
  if (process.env.NODE_ENV === 'production') return null
  const header = req.headers['x-test-country-code']
  const code = typeof header === 'string' ? header.trim().toUpperCase() : ''
  return ALLOWED.has(code) ? code : null
}

/** Trust proxy geo headers unless explicitly disabled with TRUST_GEO_HEADERS=0. */
export function trustGeoHeaders() {
  return process.env.TRUST_GEO_HEADERS !== '0'
}

function readHeader(req, name) {
  const value = req.headers[name]
  return typeof value === 'string' ? value.trim().toUpperCase() : ''
}

function fromProxyHeaders(req) {
  if (!trustGeoHeaders()) return null

  const candidates = [
    readHeader(req, 'cf-ipcountry'),
    readHeader(req, 'x-country-code'),
    readHeader(req, 'x-vercel-ip-country'),
  ].filter(Boolean)

  for (const code of candidates) {
    if (ALLOWED.has(code)) return code
  }
  return null
}

export function detectCountryFromRequest(req) {
  const testEnv = fromTestEnv()
  if (testEnv) return testEnv

  const testHeader = fromTrustedTestHeader(req)
  if (testHeader) return testHeader

  return fromProxyHeaders(req)
}

export function geoHeaderDiagnostics(req) {
  return {
    trustGeoHeaders: trustGeoHeaders(),
    cfIpCountry: readHeader(req, 'cf-ipcountry') || null,
    xCountryCode: readHeader(req, 'x-country-code') || null,
    xVercelIpCountry: readHeader(req, 'x-vercel-ip-country') || null,
    detected: detectCountryFromRequest(req),
  }
}
