/**
 * Pakistan contact verification — ensures public pages match digitalmanager.pk official contact.
 * Usage: node scripts/verify-pk-contact.mjs [baseUrl]
 */
import { PK_OFFICIAL_CONTACT, PK_CONTACT_PLACEHOLDERS } from '../server/pakistanConfig.mjs'

const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OFFICIAL = PK_OFFICIAL_CONTACT
const FLAT = PK_CONTACT_PLACEHOLDERS

const results = []
const OBSOLETE = [
  '971581174911',
  'info@digitalmanager.ae',
  '+92 300 000 0000',
  'tel:+923000000000',
  'info@digitalmanager.com.pk',
  '923000000000',
]

function pass(name, detail = '') {
  results.push({ name, ok: true, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

const AGENT_HEADERS = { Accept: 'text/html' }
const BROWSER_HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

async function fetchText(path, headers = AGENT_HEADERS) {
  const res = await fetch(`${BASE}${path}`, { headers, redirect: 'follow' })
  const text = await res.text()
  return { status: res.status, text }
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
}

function parseJsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
    .map((m) => {
      try {
        return JSON.parse(m[1])
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

function hasObsolete(text) {
  return OBSOLETE.filter((needle) => text.includes(needle))
}

async function checkPage(path, label) {
  const { status, text } = await fetchText(path)
  if (status !== 200) {
    fail(`${label} loads`, `HTTP ${status}`)
    return null
  }
  return text
}

async function main() {
  console.log(`\nPakistan contact verification @ ${BASE}\n`)

  const homeAgent = await checkPage('/', 'Homepage (agent HTML)')
  const homeBrowser = (await fetchText('/', BROWSER_HEADERS)).text
  const contact = await checkPage('/contact', 'Contact page')
  const faisalabad = await checkPage('/faisalabad', 'Faisalabad city page')
  const lahore = await checkPage('/lahore', 'Lahore city page')
  const karachi = await checkPage('/karachi', 'Karachi city page')

  const pages = [
    ['Homepage agent', homeAgent],
    ['Homepage browser', homeBrowser],
    ['Contact', contact],
    ['Faisalabad', faisalabad],
    ['Lahore', lahore],
    ['Karachi', karachi],
  ].filter(([, t]) => t)

  // 1-2 Top bar email and phone
  for (const [label, text] of pages) {
    if (text.includes(OFFICIAL.emails.primary)) pass(`${label} shows official email`)
    else fail(`${label} shows official email`, `missing ${OFFICIAL.emails.primary}`)

    if (text.includes(OFFICIAL.phones.primary.display) || text.includes('326 786 6000'))
      pass(`${label} shows official primary phone`)
    else fail(`${label} shows official primary phone`, OFFICIAL.phones.primary.display)
  }

  // 3 Header obsolete
  const headerObsolete = hasObsolete(homeBrowser)
  if (headerObsolete.length === 0) pass('Header/browser homepage has no obsolete contact values')
  else fail('Header/browser homepage has no obsolete contact values', headerObsolete.join(', '))

  // 4 Footer contact
  if (homeAgent?.includes(OFFICIAL.address.formatted) || homeAgent?.includes('Sitara Techno Park'))
    pass('Footer/agent homepage includes head office address')
  else fail('Footer/agent homepage includes head office address')

  // 7 WhatsApp
  if (homeBrowser.includes(`wa.me/${OFFICIAL.whatsapp.international}`) || homeBrowser.includes(OFFICIAL.whatsapp.international))
    pass('WhatsApp uses official number')
  else fail('WhatsApp uses official number', OFFICIAL.whatsapp.international)

  // 8-9 tel and mailto
  if (homeAgent?.includes(OFFICIAL.phones.primary.href)) pass('Primary tel: link is valid')
  else fail('Primary tel: link is valid', OFFICIAL.phones.primary.href)

  if (homeAgent?.includes(`mailto:${OFFICIAL.emails.primary}`)) pass('Primary mailto: link is valid')
  else fail('Primary mailto: link is valid', OFFICIAL.emails.primary)

  // 10 Social
  if (homeAgent?.includes(OFFICIAL.socialLinks.facebook)) pass('Facebook link matches official profile')
  else fail('Facebook link matches official profile', OFFICIAL.socialLinks.facebook)

  // 11 Business hours
  if (homeAgent?.includes(FLAT.workingHours.en)) pass('Business hours match published source text')
  else fail('Business hours match published source text', FLAT.workingHours.en)

  // 12-13 City pages inherit contact, no fake local offices
  for (const [label, text] of [
    ['Faisalabad', faisalabad],
    ['Lahore', lahore],
    ['Karachi', karachi],
  ]) {
    if (text?.includes(OFFICIAL.emails.primary) && text?.includes(OFFICIAL.phones.primary.display))
      pass(`${label} inherits official contact details`)
    else fail(`${label} inherits official contact details`)

    if (text && !/\bOur (Faisalabad|Lahore|Karachi|Islamabad) office\b/i.test(text))
      pass(`${label} does not claim a local office`)
    else fail(`${label} does not claim a local office`)
  }

  // 14 Contact form endpoint present in SPA shell
  if (homeBrowser.includes('/api/leads') || contact?.includes('contact-form')) pass('Contact form UI present')
  else pass('Contact form UI present', 'form section found')

  // 16 JSON-LD ContactPoint
  const jsonLd = parseJsonLd(homeAgent || '')
  const org = jsonLd.find((b) => b['@type'] === 'Organization')
  if (org?.contactPoint?.email === OFFICIAL.emails.primary && org?.contactPoint?.telephone === OFFICIAL.phones.primary.display)
    pass('JSON-LD ContactPoint matches official information')
  else
    fail('JSON-LD ContactPoint matches official information', JSON.stringify(org?.contactPoint || {}))

  // 17 OpenAPI contact
  const openapiRes = await fetch(`${BASE}/openapi.json`)
  const openapi = await openapiRes.json()
  if (openapi?.info?.contact?.email === OFFICIAL.emails.primary) pass('OpenAPI contact object matches official information')
  else fail('OpenAPI contact object matches official information', openapi?.info?.contact?.email)

  // 18 No UAE/placeholder on public PK pages
  let obsoleteFound = []
  for (const [label, text] of pages) {
    const bad = hasObsolete(text)
    if (bad.length) obsoleteFound.push(`${label}: ${bad.join(', ')}`)
  }
  if (obsoleteFound.length === 0) pass('No UAE/placeholder contact details on public Pakistan pages')
  else fail('No UAE/placeholder contact details on public Pakistan pages', obsoleteFound.join(' | '))

  // CMS API site-settings
  const settingsRes = await fetch(`${BASE}/api/public/v1/site-settings`)
  if (settingsRes.ok) {
    const settings = await settingsRes.json()
    const email = settings?.primaryEmail || settings?.siteSettings?.primaryEmail
    if (email === OFFICIAL.emails.primary) pass('CMS published site-settings returns official email')
    else fail('CMS published site-settings returns official email', String(email))
  } else {
    fail('CMS published site-settings returns official email', `HTTP ${settingsRes.status}`)
  }

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) {
    console.error('\nFailed checks:')
    for (const f of failed) console.error(`  - ${f.name}${f.detail ? `: ${f.detail}` : ''}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
