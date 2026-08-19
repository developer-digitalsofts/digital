/**
 * Audit industry hero image mapping — paths, uniqueness, dimensions, portrait detection.
 * Usage: node scripts/audit-industry-hero-images.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const src = readFileSync('src/data/megaMenu.ts', 'utf8')
function slugify(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const slugs = []
for (const line of src.split('\n')) {
  const m = line.match(/^\s*ind\('([^']+)'(?:,\s*'([^']+)')?\),?\s*$/)
  if (m) slugs.push(m[2] ?? slugify(m[1]))
}

const manifest = JSON.parse(readFileSync('src/data/softwareDetail/softwareImageManifest.json', 'utf8'))

const SLOT_OVERRIDES = {
  'fleet-fuel-management-software': 'teamMeeting',
  'fabric-store-management-software': 'financialReports',
  'installment-management-software': 'teamMeeting',
  'logistics-transportation-software': 'teamMeeting',
  'motor-market-management-software': 'dashboard',
  'poultry-control-shed-management-software': 'teamMeeting',
  'plastic-pipes-fitting-industry-software': 'teamMeeting',
  'ceiling-and-wall-paneling-store-software': 'teamMeeting',
  'tiles-and-ceramics-store-software': 'teamMeeting',
  'computers-laptop-business-software': 'financialReports',
  'electric-store-management-software': 'teamMeeting',
  'mobile-accessories-business-software': 'ledgerOffice',
}

const slotFile = {
  heroTeam: 'hero',
  teamMeeting: 'meeting',
  ledgerOffice: 'ledger',
  financialReports: 'reports',
  dashboard: 'dashboard',
}

function mappedHero(slug) {
  const slot = SLOT_OVERRIDES[slug] ?? 'heroTeam'
  const file = slotFile[slot]
  return manifest[slug]?.[slot] ?? `/software-images/${slug}/${file}.jpg`
}

function probe(path) {
  const full = join('public', path.replace(/^\//, ''))
  if (!existsSync(full)) return { exists: false, w: 0, h: 0, portrait: false, hash: null }
  const buf = readFileSync(full)
  const hash = createHash('md5').update(buf).digest('hex')
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i < buf.length) {
      if (buf[i] !== 0xff) break
      const marker = buf[i + 1]
      const len = buf.readUInt16BE(i + 2)
      if (marker === 0xc0 || marker === 0xc2) {
        const h = buf.readUInt16BE(i + 5)
        const w = buf.readUInt16BE(i + 7)
        return { exists: true, w, h, portrait: h > w, hash, ratio: (w / h).toFixed(2) }
      }
      i += 2 + len
    }
  }
  return { exists: true, w: 0, h: 0, portrait: false, hash, ratio: '?' }
}

const rows = []
const hashMap = new Map()

for (const slug of slugs) {
  const hero = mappedHero(slug)
  const dim = probe(hero)
  if (dim.hash) {
    if (!hashMap.has(dim.hash)) hashMap.set(dim.hash, [])
    hashMap.get(dim.hash).push(slug)
  }
  rows.push({
    slug,
    hero,
    exists: dim.exists,
    width: dim.w,
    height: dim.h,
    portrait: dim.portrait,
    ratio: dim.ratio,
    slot: SLOT_OVERRIDES[slug] ?? 'heroTeam',
    issues: [
      !dim.exists ? 'missing' : null,
      dim.portrait ? 'portrait' : null,
      dim.w > 0 && dim.w < 1200 ? 'low-width' : null,
    ].filter(Boolean),
  })
}

console.log('INDUSTRY HERO AUDIT\n')
for (const row of rows) {
  console.log(`${row.slug}`)
  console.log(`  image: ${row.hero}`)
  console.log(`  slot: ${row.slot} | ${row.width}x${row.height} | ratio ${row.ratio} | portrait=${row.portrait}`)
  console.log(`  issues: ${row.issues.length ? row.issues.join(', ') : 'none'}`)
}

console.log('\nDUPLICATE IMAGE HASHES')
let dupCount = 0
for (const [hash, items] of hashMap) {
  if (items.length > 1) {
    dupCount += 1
    console.log(`  ${items.join(', ')}`)
  }
}
if (!dupCount) console.log('  none')

const issueCount = rows.filter((r) => r.issues.length).length
console.log(`\n${rows.length} industries audited — ${issueCount} with issues, ${dupCount} duplicate groups`)
if (issueCount) process.exitCode = 1
