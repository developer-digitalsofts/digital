/**
 * E2E: Demo Requests — submit, CMS list/detail/update, persistence, cleanup
 */
const BASE = 'http://127.0.0.1:3040'

async function req(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    /* non-json */
  }
  return { status: res.status, text, json }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function main() {
  const marker = `E2E-TEST-DEMO-${Date.now()}`
  const phone = `+971500${String(Date.now()).slice(-7)}`
  const email = `e2e.demo.${Date.now()}@digitalmanager.ae.test`

  // Public GET must not expose leads
  const publicLeads = await req('/api/leads')
  assert(publicLeads.status === 404 || publicLeads.status === 405, 'GET /api/leads must not be public')

  // Admin login (needed for cleanup + CMS checks)
  const login = await req('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@admin.com', password: 'Admin@123' }),
  })
  assert(login.status === 200 && login.json?.token, `login failed: ${login.text}`)
  const auth = { Authorization: `Bearer ${login.json.token}` }

  // Remove leftover E2E rows from prior failed runs
  const stale = await req('/api/admin/demo-requests?q=E2E-TEST-DEMO&pageSize=100', { headers: auth })
  if (stale.status === 200 && Array.isArray(stale.json?.items)) {
    for (const row of stale.json.items) {
      if (String(row.name || '').includes('E2E-TEST-DEMO')) {
        await req(`/api/admin/demo-requests/${row.id}`, { method: 'DELETE', headers: auth })
      }
    }
  }

  // Submit demo request (mirrors GetDemoModal payload)
  const submit = await req('/api/leads', {
    method: 'POST',
    body: JSON.stringify({
      name: `${marker} User`,
      phone,
      company: 'E2E Retail',
      topic: 'demo',
      source: 'Get Demo Modal',
      message: `${marker} — business type: E2E Retail`,
      email,
      sourcePage: `header-get-demo:/e2e-test`,
    }),
  })
  assert(submit.status === 201 && submit.json?.id, `submit failed: ${submit.status} ${submit.text}`)
  const id = submit.json.id
  console.log(`OK: submitted demo request ${id}`)

  // List — should include new request (newest first)
  const list = await req('/api/admin/demo-requests?page=1&pageSize=50', { headers: auth })
  assert(list.status === 200 && Array.isArray(list.json?.items), `list failed: ${list.text}`)
  const found = list.json.items.find((r) => r.id === id)
  assert(found, 'new demo request appears in admin list')
  assert(found.status === 'New', 'default status is New')
  assert(found.company === 'E2E Retail', 'company stored')
  console.log('OK: appears in admin list immediately')

  // Search by name
  const search = await req(`/api/admin/demo-requests?q=${encodeURIComponent(marker)}`, { headers: auth })
  assert(search.status === 200 && search.json.items.some((r) => r.id === id), 'search by name works')

  // Detail
  const detail = await req(`/api/admin/demo-requests/${id}`, { headers: auth })
  assert(detail.status === 200 && detail.json?.item?.id === id, `detail failed: ${detail.text}`)

  // Update status, note, follow-up
  const followUpAt = new Date(Date.now() + 86400000).toISOString()
  const patch = await req(`/api/admin/demo-requests/${id}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({
      status: 'Contacted',
      internalNote: `${marker} internal note`,
      followUpAt,
      assignedTo: 'admin@admin.com',
    }),
  })
  assert(patch.status === 200 && patch.json?.status === 'Contacted', `patch failed: ${patch.text}`)
  console.log('OK: status, note, follow-up updated')

  // Stats include demo counters
  const stats = await req('/api/admin/demo-requests/stats', { headers: auth })
  assert(stats.status === 200 && typeof stats.json?.new === 'number', `stats failed: ${stats.text}`)

  const dash = await req('/api/admin/summary', { headers: auth })
  assert(dash.status === 200 && dash.json?.cards?.demoRequests, `dashboard missing demoRequests: ${dash.text}`)
  console.log('OK: dashboard demo request counters present')

  // Persistence — re-read after patch
  const detail2 = await req(`/api/admin/demo-requests/${id}`, { headers: auth })
  assert(detail2.json.item.internalNote.includes(marker), 'note persisted')
  assert(detail2.json.item.followUpAt, 'follow-up persisted')
  console.log('OK: persistence verified')

  // Export CSV
  const exp = await fetch(`${BASE}/api/admin/demo-requests/export?status=Contacted`, { headers: auth })
  assert(exp.status === 200, `export failed: ${exp.status}`)
  const csv = await exp.text()
  assert(csv.includes('name') && csv.includes(marker), 'export CSV contains test row')
  console.log('OK: CSV export works')

  // Cleanup test record
  const del = await req(`/api/admin/demo-requests/${id}`, { method: 'DELETE', headers: auth })
  assert(del.status === 200, `delete failed: ${del.text}`)
  const gone = await req(`/api/admin/demo-requests/${id}`, { headers: auth })
  assert(gone.status === 404, 'test record removed')
  console.log('OK: test record deleted')

  console.log('\nAll demo-requests E2E checks passed.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
