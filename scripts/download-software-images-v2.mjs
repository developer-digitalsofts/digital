/**
 * Download per-slug images from Pexels into public/software-images/{slug}/
 * Remote URLs are cached once under _cache/ then copied to each slug folder.
 */
import { copyFile, mkdir, writeFile, access } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const outRoot = join(root, 'public', 'software-images')
const cacheRoot = join(outRoot, '_cache')
const DELAY_MS = 400

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const P = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&fit=crop`
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`

/** Per-slug unique hero (Pexels photo id or local) */
const SLUG_HERO = {
  'accounts-management-software': { local: 'accounts/hero-finance-team.jpg' },
  'production-management-software': { url: P(3184292) },
  'point-of-sale-management-software': { url: P(264636) },
  'fbr-pos-integration-software': { url: U('1554224155-6726b3ff858f') },
  'inventory-management-software': { url: P(1267338) },
  'payroll-management-software': { url: P(1181406) },
  'integration-system': { url: P(210607) },
  'crm-software': { url: P(2219024) },
  'petrol-pump-software': { url: P(190979) },
  'petrol-gas-filling-station-software': { url: P(1117451) },
  'lpg-business-software': { url: P(325111) },
  'lpg-transport-management-software': { url: P(4391470) },
  'lpg-bowser-supply-chain-software': { url: P(5632401) },
  'fleet-fuel-management-software': { url: P(1709003) },
  'petrol-depot-management-software': { url: P(5632402) },
  'fuel-tank-lorry-management-software': { url: P(276724) },
  'cloud-erp-software-for-textile-industries': { url: P(3935331) },
  'knitting-dyeing-industry-software': { url: P(3935332) },
  'fabric-store-management-software': { url: P(3935341) },
  'garments-manufacturing-software': { url: P(3935350) },
  'candy-and-confectionery-manufacturing-software': { url: P(3935352) },
  'retail-management-software': { url: P(1076758) },
  'luggage-bags-store-software': { url: P(325185) },
  'toy-shop-management-software': { url: P(256541) },
  'crockery-store-management-software': { url: P(261181) },
  'grocery-store-management-software': { url: P(2280561) },
  'cloud-erp-software-for-services-business': { url: U('1552664730-d307ca884978') },
  'small-and-medium-business-erp-software': { url: U('1460925895917-afdab827c52f') },
  'installment-management-software': { url: U('1454165804606-c3d57bc86b40') },
  'pharmacy-business-management-software': { url: P(1571463) },
  'homeopathic-business-management-software': { url: P(1435904) },
  'hotel-management-software': { url: P(259924) },
  'tuc-shop-management-software': { url: P(532510) },
  'logistics-transportation-software': { url: P(448361) },
  'motor-market-management-software': { url: P(170811) },
  'auto-parts-business-software': { url: P(3807277) },
  'poultry-control-shed-management-software': { url: P(288620) },
  'poultry-chicken-supply-management-software': { url: P(1267329) },
  'poultry-waste-management-software': { url: P(1435733) },
  'poultry-arhat-software': { url: P(2252584) },
  'cloud-erp-software-for-agriculture-business': { url: P(164938) },
  'dairy-farm-management-software': { url: P(164938) },
  'marble-and-granite-factory-software': { url: P(1036654) },
  'plastic-pipes-fitting-industry-software': { url: P(276724) },
  'ceiling-and-wall-paneling-store-software': { url: P(1571460) },
  'tiles-and-ceramics-store-software': { url: P(1571461) },
  'hardware-sanitary-store-software': { url: P(1571462) },
  'erp-software-for-real-estate-business': { url: P(106399) },
  'erp-software-for-construction-business': { url: P(238779) },
  'software-for-visa-immigration-consultants': { url: P(4678422) },
  'computers-laptop-business-software': { url: P(3861969) },
  'electronics-management-software': { url: P(356056) },
  'electric-store-management-software': { url: P(257736) },
  'mobile-accessories-business-software': { url: P(607812) },
  'ev-charging-station-management-software': { url: P(3807388) },
}

const SLUG_SECTIONS = {
  'accounts-management-software': {
    reports: { local: 'accounts/financial-reports.jpg' },
    dashboard: { local: 'accounts/accounting-dashboard.jpg' },
    meeting: { local: 'accounts/finance-team-meeting.jpg' },
    ledger: { local: 'accounts/ledger-documents.jpg' },
  },
}

const DEFAULT_SECTIONS_BY_POOL = {
  energy: { reports: P(190979), dashboard: P(1117451), meeting: P(1709003), ledger: P(325111) },
  textile: { reports: P(3935341), dashboard: P(3935331), meeting: P(3935332), ledger: P(3935350) },
  factory: { reports: P(3184292), dashboard: P(3935350), meeting: P(3935352), ledger: P(3184292) },
  retail: { reports: P(1076758), dashboard: P(2280561), meeting: P(256541), ledger: P(264636) },
  medical: { reports: P(1571463), dashboard: P(1435904), meeting: P(1571463), ledger: P(1435904) },
  hospitality: { reports: P(259924), dashboard: P(261181), meeting: P(532510), ledger: P(256541) },
  logistics: { reports: P(4391470), dashboard: P(1267338), meeting: P(3807277), ledger: P(170811) },
  agrifood: { reports: P(164938), dashboard: P(288620), meeting: P(1267329), ledger: P(1435733) },
  construction: { reports: P(1036654), dashboard: P(238779), meeting: P(1571460), ledger: P(276724) },
  property: { reports: P(106399), dashboard: P(1571461), meeting: P(106399), ledger: U('1542744173-8e7e53415bb0') },
  electronics: { reports: P(356056), dashboard: P(3861969), meeting: P(607812), ledger: P(257736) },
  visa: { reports: P(4678422), dashboard: P(4678422), meeting: U('1521737604893-d14cc237f11d'), ledger: U('1542744173-8e7e53415bb0') },
  smb: { reports: U('1460925895917-afdab827c52f'), dashboard: U('1552664730-d307ca884978'), meeting: U('1521737604893-d14cc237f11d'), ledger: U('1542744173-8e7e53415bb0') },
  office: { reports: U('1554224155-6726b3ff858f'), dashboard: U('1551288049-bebda4e38f71'), meeting: U('1521737604893-d14cc237f11d'), ledger: U('1542744173-8e7e53415bb0') },
  warehouse: { reports: P(1267338), dashboard: U('1551288049-bebda4e38f71'), meeting: P(1267338), ledger: P(4391470) },
  hr: { reports: P(1181406), dashboard: U('1551288049-bebda4e38f71'), meeting: U('1521737604893-d14cc237f11d'), ledger: U('1542744173-8e7e53415bb0') },
  accounts: {
    reports: { local: 'accounts/financial-reports.jpg' },
    dashboard: { local: 'accounts/accounting-dashboard.jpg' },
    meeting: { local: 'accounts/finance-team-meeting.jpg' },
    ledger: { local: 'accounts/ledger-documents.jpg' },
  },
}

const SLUG_TO_POOL = {
  'accounts-management-software': 'accounts',
  'production-management-software': 'factory',
  'point-of-sale-management-software': 'retail',
  'fbr-pos-integration-software': 'office',
  'inventory-management-software': 'warehouse',
  'payroll-management-software': 'hr',
  'integration-system': 'office',
  'crm-software': 'office',
  'petrol-pump-software': 'energy',
  'petrol-gas-filling-station-software': 'energy',
  'lpg-business-software': 'energy',
  'lpg-transport-management-software': 'energy',
  'lpg-bowser-supply-chain-software': 'energy',
  'fleet-fuel-management-software': 'energy',
  'petrol-depot-management-software': 'energy',
  'fuel-tank-lorry-management-software': 'energy',
  'cloud-erp-software-for-textile-industries': 'textile',
  'knitting-dyeing-industry-software': 'textile',
  'fabric-store-management-software': 'textile',
  'garments-manufacturing-software': 'factory',
  'candy-and-confectionery-manufacturing-software': 'factory',
  'retail-management-software': 'retail',
  'luggage-bags-store-software': 'retail',
  'toy-shop-management-software': 'retail',
  'crockery-store-management-software': 'retail',
  'grocery-store-management-software': 'retail',
  'pharmacy-business-management-software': 'medical',
  'homeopathic-business-management-software': 'medical',
  'hotel-management-software': 'hospitality',
  'tuc-shop-management-software': 'hospitality',
  'logistics-transportation-software': 'logistics',
  'motor-market-management-software': 'logistics',
  'auto-parts-business-software': 'logistics',
  'poultry-control-shed-management-software': 'agrifood',
  'poultry-chicken-supply-management-software': 'agrifood',
  'poultry-waste-management-software': 'agrifood',
  'poultry-arhat-software': 'agrifood',
  'cloud-erp-software-for-agriculture-business': 'agrifood',
  'dairy-farm-management-software': 'agrifood',
  'marble-and-granite-factory-software': 'construction',
  'plastic-pipes-fitting-industry-software': 'construction',
  'ceiling-and-wall-paneling-store-software': 'construction',
  'tiles-and-ceramics-store-software': 'construction',
  'hardware-sanitary-store-software': 'construction',
  'erp-software-for-real-estate-business': 'property',
  'erp-software-for-construction-business': 'construction',
  'software-for-visa-immigration-consultants': 'visa',
  'computers-laptop-business-software': 'electronics',
  'electronics-management-software': 'electronics',
  'electric-store-management-software': 'electronics',
  'mobile-accessories-business-software': 'electronics',
  'ev-charging-station-management-software': 'electronics',
  'cloud-erp-software-for-services-business': 'smb',
  'small-and-medium-business-erp-software': 'smb',
  'installment-management-software': 'property',
}

function cachePathForUrl(url) {
  const hash = createHash('sha256').update(url).digest('hex').slice(0, 20)
  return join(cacheRoot, `${hash}.jpg`)
}

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function resolveSrc(entry) {
  if (!entry) return null
  if (entry.local) return join(root, 'public', entry.local)
  if (entry.url) return entry.url
  if (typeof entry === 'string') return entry
  return null
}

const urlCache = new Map()

async function fetchToCache(url) {
  if (urlCache.has(url)) return urlCache.get(url)
  const cached = cachePathForUrl(url)
  if (await fileExists(cached)) {
    urlCache.set(url, cached)
    return cached
  }
  const res = await fetch(url, { headers: { 'User-Agent': 'DigitalManagerImageBot/1.0 (local build)' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  await mkdir(cacheRoot, { recursive: true })
  await writeFile(cached, Buffer.from(await res.arrayBuffer()))
  urlCache.set(url, cached)
  await sleep(DELAY_MS)
  return cached
}

async function materialize(entry, dest, force = false) {
  const src = await resolveSrc(entry)
  if (!src) return false
  if (!force && (await fileExists(dest))) return true
  await mkdir(dirname(dest), { recursive: true })
  try {
    if (src.startsWith('http')) {
      const cached = await fetchToCache(src)
      await copyFile(cached, dest)
    } else {
      await copyFile(src, dest)
    }
    console.log('OK', dest.replace(root, ''))
    return true
  } catch (e) {
    console.error('FAIL', dest.replace(root, ''), e.message)
    return false
  }
}

const force = process.argv.includes('--force')
let ok = 0
let fail = 0

for (const [slug, hero] of Object.entries(SLUG_HERO)) {
  if (await materialize(hero, join(outRoot, slug, 'hero.jpg'), force)) ok++
  else fail++
}

for (const [slug, sections] of Object.entries(SLUG_SECTIONS)) {
  for (const [role, entry] of Object.entries(sections)) {
    if (await materialize(entry, join(outRoot, slug, `${role}.jpg`), force)) ok++
    else fail++
  }
}

for (const [slug, pool] of Object.entries(SLUG_TO_POOL)) {
  if (SLUG_SECTIONS[slug]) continue
  const poolSections = DEFAULT_SECTIONS_BY_POOL[pool]
  if (!poolSections) continue
  for (const [role, src] of Object.entries(poolSections)) {
    const entry = typeof src === 'string' ? { url: src } : src
    if (await materialize(entry, join(outRoot, slug, `${role}.jpg`), force)) ok++
    else fail++
  }
}

const manifest = {}
for (const slug of Object.keys(SLUG_HERO)) {
  manifest[slug] = {
    heroTeam: `/software-images/${slug}/hero.jpg`,
    financialReports: `/software-images/${slug}/reports.jpg`,
    dashboard: `/software-images/${slug}/dashboard.jpg`,
    teamMeeting: `/software-images/${slug}/meeting.jpg`,
    ledgerOffice: `/software-images/${slug}/ledger.jpg`,
  }
}
await writeFile(
  join(root, 'src/data/softwareDetail/softwareImageManifest.json'),
  JSON.stringify(manifest, null, 2),
)
console.log(`Done: ${ok} ok, ${fail} fail, manifest ${Object.keys(manifest).length} slugs`)
