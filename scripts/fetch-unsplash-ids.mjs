/**
 * Fetch Unsplash search pages and extract free (non-plus) photo IDs.
 */
const QUERIES = [
  'fuel station gas pump',
  'textile factory fabric',
  'manufacturing factory production',
  'supermarket retail checkout',
  'hospital pharmacy healthcare',
  'poultry farm chicken',
  'agriculture farm crop',
  'construction site building',
  'real estate commercial building',
  'hotel restaurant hospitality',
  'electronics store laptop',
  'visa travel passport business',
  'warehouse logistics truck',
  'erp dashboard analytics laptop',
  'inventory warehouse shelves',
  'payroll office business',
  'pos terminal payment',
]

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=85`

async function fetchIds(query) {
  const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { 'User-Agent': 'DigitalManagerImageBot/1.0' } })
  const html = await res.text()
  const re = /images\.unsplash\.com\/photo-(\d+-[a-f0-9]+)/g
  const ids = new Set()
  let m
  while ((m = re.exec(html))) ids.add(m[1])
  return [...ids]
}

async function verify(id) {
  const r = await fetch(U(id), { method: 'HEAD' })
  return r.status === 200
}

const byQuery = {}
const verified = new Set()

for (const q of QUERIES) {
  const ids = await fetchIds(q)
  const ok = []
  for (const id of ids.slice(0, 25)) {
    if (await verify(id)) {
      ok.push(id)
      verified.add(id)
    }
  }
  byQuery[q] = ok
  console.log(q, ok.length)
  await new Promise((r) => setTimeout(r, 300))
}

import { writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
await writeFile(
  join(root, 'scripts', 'verified-unsplash-ids.json'),
  JSON.stringify({ verified: [...verified], byQuery }, null, 2),
)
console.log('total verified', verified.size)
