/**
 * Audit industry detail page section images for duplicates (hero vs sections).
 * Usage: node scripts/audit-industry-section-images.mjs
 */
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const manifest = JSON.parse(
  readFileSync('src/data/softwareDetail/softwareImageManifest.json', 'utf8'),
)

const mega = readFileSync('src/data/megaMenu.ts', 'utf8')
function slugify(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const slugs = []
for (const line of mega.split('\n')) {
  const m = line.match(/^\s*ind\('([^']+)'(?:,\s*'([^']+)')?\),?\s*$/)
  if (m) slugs.push(m[2] ?? slugify(m[1]))
}

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

const OPERATIONAL_OVERRIDES = {
  'cloud-erp-software-for-agriculture-business': [
    ['cloud-erp-software-for-agriculture-business', 'financialReports'],
    ['cloud-erp-software-for-agriculture-business', 'teamMeeting'],
    ['cloud-erp-software-for-agriculture-business', 'ledgerOffice'],
  ],
}

const BUSINESS_OVERRIDES = {
  'cloud-erp-software-for-agriculture-business': [
    ['cloud-erp-software-for-agriculture-business', 'dashboard'],
    ['cloud-erp-software-for-agriculture-business', 'financialReports'],
    ['inventory-management-software', 'ledgerOffice'],
    ['retail-management-software', 'teamMeeting'],
  ],
}

function pathFor(slug, slot) {
  const file = slotFile[slot]
  return manifest[slug]?.[slot] ?? `/software-images/${slug}/${file}.jpg`
}

function heroFor(slug) {
  const slot = SLOT_OVERRIDES[slug] ?? 'heroTeam'
  return pathFor(slug, slot)
}

function normalize(src) {
  try {
    return decodeURIComponent(src.split('?')[0].replace(/\\/g, '/').toLowerCase())
  } catch {
    return src.toLowerCase()
  }
}

function assignOperational(slug) {
  const override = OPERATIONAL_OVERRIDES[slug]
  if (override) return override.map(([s, slot]) => pathFor(s, slot))
  const slots = ['teamMeeting', 'ledgerOffice', 'financialReports']
  return slots.map((slot) => pathFor(slug, slot))
}

function assignBusiness(slug) {
  const override = BUSINESS_OVERRIDES[slug]
  if (override) return override.map(([s, slot]) => pathFor(s, slot))
  const slots = ['heroTeam', 'teamMeeting', 'ledgerOffice', 'dashboard']
  return slots.map((slot, i) => pathFor(slug, slots[i % slots.length]))
}

const issues = []

for (const slug of slugs) {
  const seen = new Map()
  const register = (src, section) => {
    const key = normalize(src)
    if (seen.has(key)) {
      issues.push({ slug, section, duplicateOf: seen.get(key), path: key })
    } else {
      seen.set(key, section)
    }
  }

  register(heroFor(slug), 'hero')
  assignOperational(slug).forEach((src, i) => register(src, `operational[${i}]`))
  assignBusiness(slug).forEach((src, i) => register(src, `businessType[${i}]`))
  register(pathFor(slug, 'teamMeeting'), 'testimonial')
}

console.log(`Audited ${slugs.length} industry pages for section image duplicates.`)
if (!issues.length) {
  console.log('No duplicate image paths detected in simplified audit.')
  process.exit(0)
}

console.log(`Found ${issues.length} duplicate assignments:`)
for (const row of issues.slice(0, 40)) {
  console.log(`- ${row.slug}: ${row.section} duplicates ${row.duplicateOf} (${row.path})`)
}
if (issues.length > 40) console.log(`… and ${issues.length - 40} more`)
process.exit(1)
