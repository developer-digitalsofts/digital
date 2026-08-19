/**
 * Verify Accounts prototype image paths resolve (local public files).
 * Usage: node scripts/verify-accounts-images.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const manifest = JSON.parse(
  readFileSync(join(root, 'src/data/softwareDetail/softwareImageManifest.json'), 'utf8'),
)

const industrySlugs = [
  'retail-management-software',
  'hotel-management-software',
  'garments-manufacturing-software',
  'small-and-medium-business-erp-software',
  'pharmacy-business-management-software',
  'erp-software-for-construction-business',
]

const paths = new Set([
  ...Object.values(manifest['accounts-management-software'] ?? {}),
  ...industrySlugs.flatMap((s) => Object.values(manifest[s] ?? {})),
])

let ok = 0
let fail = 0
for (const p of paths) {
  const file = join(root, 'public', p.replace(/^\//, ''))
  if (existsSync(file)) {
    ok++
  } else {
    console.error('MISSING:', p)
    fail++
  }
}
console.log(`Verified ${ok} images, ${fail} missing`)
process.exit(fail > 0 ? 1 : 0)
