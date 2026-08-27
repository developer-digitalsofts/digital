/** Geo country detection from trusted request headers. */
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

export function detectCountryFromRequest(req) {
  const testEnv = fromTestEnv()
  if (testEnv) return testEnv

  const testHeader = fromTrustedTestHeader(req)
  if (testHeader) return testHeader

  const cf = req.headers['cf-ipcountry']
  const xcc = req.headers['x-country-code']
  const raw =
    typeof cf === 'string' && cf.trim()
      ? cf
      : typeof xcc === 'string' && xcc.trim()
        ? xcc
        : ''
  const code = raw.trim().toUpperCase()
  return ALLOWED.has(code) ? code : null
}
