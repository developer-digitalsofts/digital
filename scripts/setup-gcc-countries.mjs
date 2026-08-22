/**
 * Run country setup for SA, KW, OM, BH (structure_only, en+ar).
 * Usage: node scripts/setup-gcc-countries.mjs
 */

const API = process.env.API_URL || 'http://127.0.0.1:3040'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

const COUNTRIES = ['SA', 'KW', 'OM', 'BH']

async function main() {
  const login = await fetch(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const { token } = await login.json()
  if (!token) throw new Error('Admin login failed')

  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  for (const countryCode of COUNTRIES) {
    const res = await fetch(`${API}/api/admin/countries/setup`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ countryCode, languages: ['en', 'ar'], mode: 'structure_only' }),
    })
    const body = await res.json()
    if (res.ok) {
      console.log(`✓ ${countryCode} setup — ${body.report?.draftRecordsCreated ?? 0} draft records`)
    } else if (String(body.error || '').includes('already set up')) {
      console.log(`• ${countryCode} already set up`)
    } else {
      console.error(`✗ ${countryCode}: ${body.error || res.status}`)
      process.exitCode = 1
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
