import { readFileSync } from 'fs'

const slugify = (t) =>
  t
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const src = readFileSync('src/data/megaMenu.ts', 'utf8')
const ar = readFileSync('src/i18n/megaMenuAr.ts', 'utf8')

const modSlugs = [...src.matchAll(/mod\('[^']+',\s*'([^']+)'/g)].map((m) => m[1])
const indSlugs = []
for (const m of src.matchAll(/ind\('([^']+)'(?:,\s*'([^']+)')?\)/g)) {
  indSlugs.push(m[2] || slugify(m[1]))
}

const modMissing = modSlugs.filter((s) => !ar.includes(`'${s}':`))
const indMissing = indSlugs.filter((s) => !ar.includes(`'${s}':`))

console.log('modules', modSlugs.length, 'missing', modMissing)
console.log('industries', indSlugs.length, 'missing', indMissing.length)
indMissing.forEach((s) => console.log(' -', s))
