/**
 * Verify industry showcase image paths load.
 * Usage: node scripts/verify-industry-images.mjs [baseUrl]
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.argv[2] || 'http://127.0.0.1:4173'
const published = JSON.parse(
  readFileSync(join('server/data/published/industries.json'), 'utf8'),
)

const items = (published.items || []).filter((x) => x.active !== false)

async function check(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}

async function main() {
  let ok = 0
  for (const item of items) {
    const src = item.imageUrl?.startsWith('http') ? item.imageUrl : `${BASE}${item.imageUrl}`
    const loaded = await check(src)
    console.log(`${item.title?.en || item.id}: ${loaded ? 'loaded' : 'FAILED'} (${item.imageUrl})`)
    if (loaded) ok += 1
  }
  console.log(`\n${ok}/${items.length} industry images loaded`)
  if (ok < items.length) process.exitCode = 1
}

main()
