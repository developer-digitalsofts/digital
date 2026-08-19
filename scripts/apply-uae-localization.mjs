/**
 * Apply UAE localization replacements across source content (removes Pakistan-specific copy).
 * Usage: node scripts/apply-uae-localization.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = process.cwd()
const SKIP = new Set(['node_modules', 'dist', '.git', 'public/software-images', 'package-lock.json'])
const EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.html', '.md'])

const REPLACEMENTS = [
  [/across Pakistan/gi, 'across the UAE'],
  [/in Pakistan/gi, 'in the UAE'],
  [/for Pakistan/gi, 'for the UAE'],
  [/Pakistani businesses/gi, 'UAE businesses'],
  [/Pakistani tax regulations/gi, 'UAE VAT and Corporate Tax requirements'],
  [/Federal Board of Revenue \(FBR\)/gi, 'UAE tax compliance workflows'],
  [/Federal Board of Revenue/gi, 'UAE tax compliance'],
  [/FBR-compliant/gi, 'UAE VAT-compliant'],
  [/FBR compliant/gi, 'UAE VAT compliant'],
  [/FBR-aligned/gi, 'UAE VAT-aligned'],
  [/FBR-integrated/gi, 'UAE VAT-integrated'],
  [/FBR-Integrated/gi, 'UAE VAT-Integrated'],
  [/FBR Integration/gi, 'UAE VAT & Tax Compliance'],
  [/FBR POS/gi, 'UAE VAT POS'],
  [/FBR invoice/gi, 'VAT invoice'],
  [/FBR digital invoicing/gi, 'UAE VAT digital invoicing'],
  [/FBR \(POS\) Integration Software/gi, 'UAE VAT & Tax Compliance Software'],
  [/integrate with FBR/gi, 'support UAE VAT compliance'],
  [/FBR digital invoicing expectations/gi, 'UAE VAT invoicing requirements'],
  [/Seamlessly FBR-integrated/gi, 'UAE VAT-ready'],
  [/officially verified Point of Sale \(POS\) software integrated with the Federal Board of Revenue \(FBR\)/gi, 'Point of Sale software with UAE VAT-compliant invoicing workflows'],
  [/Petrol Station Management Software in Pakistan/gi, 'Petrol Station Management Software in the UAE'],
  [/STRNs/gi, 'TRNs'],
  [/\bPKR\b/g, 'AED'],
  [/\bRs\s+([\d.,]+[KMB]?)/g, 'AED $1'],
  [/value: 'Rs /g, "value: 'AED "],
  [/right: 'Rs /g, "right: 'AED "],
  [/Lead · Lahore distributor/g, 'Lead · Dubai distributor'],
  [/app\.digitalmanager\.pk/g, 'app.digitalmanager.ae'],
  [/phonePlaceholder: '\+92 …'/g, "phonePlaceholder: '+971 …'"],
  [/Oman and Pakistan/g, 'Oman and Kuwait'],
  [/تكامل FBR/g, 'امتثال ضريبة القيمة المضافة'],
]

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (EXT.has(extname(name))) out.push(p)
  }
  return out
}

const files = walk(join(ROOT, 'src')).concat(walk(join(ROOT, 'server/data')))
let changed = 0

for (const file of files) {
  if (file.includes('apply-uae-localization')) continue
  let src = readFileSync(file, 'utf8')
  let next = src
  for (const [re, rep] of REPLACEMENTS) {
    next = next.replace(re, (match, ...args) => {
      const idx = args[args.length - 2]
      const full = src
      const before = full.slice(Math.max(0, idx - 40), idx + match.length + 40)
      if (/fbr-pos-integration|fbr-digital-invoicing|'fbr-|\"fbr-|\/fbr-/i.test(before)) return match
      return typeof rep === 'function' ? rep(match, ...args) : rep
    })
  }
  if (next !== src) {
    writeFileSync(file, next, 'utf8')
    changed++
    console.log('updated:', file.replace(ROOT + '\\', '').replace(ROOT + '/', ''))
  }
}

console.log(`\nDone. ${changed} files updated.`)
