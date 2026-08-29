/**
 * Sync Pakistan CMS contact fields to PK_OFFICIAL_CONTACT defaults.
 * Usage: node scripts/migrate-pk-contact.mjs
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PK_OFFICIAL_CONTACT, PK_CONTACT_PLACEHOLDERS } from '../server/pakistanConfig.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPk = path.join(root, 'server', 'data-pk')

const CONTACT = {
  primaryEmail: PK_CONTACT_PLACEHOLDERS.primaryEmail,
  salesEmail: PK_CONTACT_PLACEHOLDERS.salesEmail,
  supportEmail: PK_CONTACT_PLACEHOLDERS.supportEmail,
  phoneDisplay: PK_CONTACT_PLACEHOLDERS.phoneDisplay,
  phoneHref: PK_CONTACT_PLACEHOLDERS.phoneHref,
  whatsappNumber: PK_CONTACT_PLACEHOLDERS.whatsappNumber,
  officeAddress: PK_CONTACT_PLACEHOLDERS.officeAddress,
  workingHours: PK_CONTACT_PLACEHOLDERS.workingHours,
  facebookUrl: PK_OFFICIAL_CONTACT.socialLinks.facebook,
  linkedinUrl: PK_OFFICIAL_CONTACT.socialLinks.linkedin || '',
  instagramUrl: PK_OFFICIAL_CONTACT.socialLinks.instagram || '',
  youtubeUrl: PK_OFFICIAL_CONTACT.socialLinks.youtube || '',
  googleMapLink: PK_OFFICIAL_CONTACT.mapUrl || '',
}

async function readJson(rel) {
  const p = path.join(dataPk, rel)
  return JSON.parse(await fs.readFile(p, 'utf8'))
}

async function writeJson(rel, data) {
  const p = path.join(dataPk, rel)
  await fs.writeFile(p, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  console.log('updated', rel)
}

function patchSiteSettings(doc) {
  Object.assign(doc, {
    primaryEmail: CONTACT.primaryEmail,
    salesEmail: CONTACT.salesEmail,
    supportEmail: CONTACT.supportEmail,
    phoneDisplay: CONTACT.phoneDisplay,
    phoneHref: CONTACT.phoneHref,
    whatsappNumber: CONTACT.whatsappNumber,
    officeAddress: { en: CONTACT.officeAddress.en, ar: CONTACT.officeAddress.en },
    workingHours: { en: CONTACT.workingHours.en, ar: CONTACT.workingHours.en },
    facebookUrl: CONTACT.facebookUrl,
    linkedinUrl: CONTACT.linkedinUrl,
    instagramUrl: CONTACT.instagramUrl,
    youtubeUrl: CONTACT.youtubeUrl,
    googleMapLink: CONTACT.googleMapLink,
  })
  return doc
}

function patchCountries(doc) {
  for (const item of doc.items || []) {
    if (String(item.code).toUpperCase() !== 'PK') continue
    Object.assign(item, {
      primaryEmail: CONTACT.primaryEmail,
      salesEmail: CONTACT.salesEmail,
      supportEmail: CONTACT.supportEmail,
      phoneDisplay: CONTACT.phoneDisplay,
      phoneHref: CONTACT.phoneHref,
      whatsappNumber: CONTACT.whatsappNumber,
      officeAddress: { en: CONTACT.officeAddress.en, ar: CONTACT.officeAddress.en },
      workingHours: { en: CONTACT.workingHours.en, ar: CONTACT.workingHours.en },
    })
  }
  return doc
}

function patchHeader(doc) {
  doc.topBar = {
    ...(doc.topBar || {}),
    email: CONTACT.primaryEmail,
    phoneDisplay: CONTACT.phoneDisplay,
    phoneHref: CONTACT.phoneHref,
    hours: { en: CONTACT.workingHours.en, ar: CONTACT.workingHours.en },
  }
  return doc
}

function patchFooter(doc) {
  doc.contact = {
    ...(doc.contact || {}),
    email: CONTACT.primaryEmail,
    phoneDisplay: CONTACT.phoneDisplay,
    phoneHref: CONTACT.phoneHref,
    address: { en: CONTACT.officeAddress.en, ar: CONTACT.officeAddress.en },
  }
  doc.social = (doc.social || []).map((row) => {
    if (row.platform === 'facebook' && CONTACT.facebookUrl) return { ...row, href: CONTACT.facebookUrl }
    if (row.platform === 'linkedin' && !CONTACT.linkedinUrl) return { ...row, href: '' }
    return row
  })
  return doc
}

function patchWhatsapp(doc) {
  doc.phoneDigits = CONTACT.whatsappNumber
  return doc
}

function patchCta(doc) {
  if (doc.whatsapp) doc.whatsapp.href = `https://wa.me/${CONTACT.whatsappNumber}`
  return doc
}

function patchEmailSettings(doc) {
  doc.receiverEmail = CONTACT.primaryEmail
  return doc
}

function patchLocaleRecords(doc) {
  let count = 0
  for (const record of doc.records || []) {
    const contact = record.payload?.contact
    if (!contact || typeof contact !== 'object') continue
    contact.phoneDisplay = CONTACT.phoneDisplay
    contact.phoneHref = CONTACT.phoneHref
    contact.email = CONTACT.primaryEmail
    count++
  }
  console.log(`patched ${count} locale payload.contact blocks`)
  return doc
}

const pairs = [
  ['siteSettings.json', patchSiteSettings],
  ['published/siteSettings.json', patchSiteSettings],
  ['countries.json', patchCountries],
  ['published/countries.json', patchCountries],
  ['header.json', patchHeader],
  ['published/header.json', patchHeader],
  ['footer.json', patchFooter],
  ['published/footer.json', patchFooter],
  ['whatsappSettings.json', patchWhatsapp],
  ['published/whatsappSettings.json', patchWhatsapp],
  ['cta.json', patchCta],
  ['published/cta.json', patchCta],
  ['emailSettings.json', patchEmailSettings],
  ['localeRecords.json', patchLocaleRecords],
  ['published/localeRecords.json', patchLocaleRecords],
]

for (const [rel, patch] of pairs) {
  const doc = await readJson(rel)
  await writeJson(rel, patch(doc))
}

console.log('PK contact migration complete.')
