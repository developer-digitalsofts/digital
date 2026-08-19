#!/usr/bin/env node
/**
 * Audit project for Pakistan-specific content that should not appear on the public site.
 * Run: node scripts/audit-uae-content.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(new URL('..', import.meta.url)))
const SCAN_DIRS = ['src', 'server/data', 'public', 'index.html'].map((p) => join(ROOT, p))
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'screenshots', 'public/software-images', '.next', 'Arch'])

const PATTERNS = [
  { id: 'pakistan', re: /\bPakistan\b|\bPakistani\b/i, label: 'Pakistan/Pakistani' },
  { id: 'fbr', re: /\bFBR\b|\bPRAL\b|\bIRIS\b/i, label: 'FBR/PRAL/IRIS (display text)' },
  { id: 'pkr', re: /\bPKR\b|\bRupees\b|\bRs\.?\b/i, label: 'PKR/Rs/Rupees' },
  { id: 'phone92', re: /\+92\b/, label: '+92 phone code' },
  { id: 'pk-domain', re: /\.pk\b/i, label: '.pk domain' },
]

/** Slug/id paths where fbr in filename is allowed (URL compatibility). */
function isAllowedFbrPath(file, line) {
  if (!/fbr/i.test(line)) return false
  if (/fbr-pos-integration|fbr-digital-invoicing|'fbr-|"fbr-|\/fbr-|cardKey:\s*'fbr'|id:\s*'fbr|m-fbr|i-fbr|mergeFbr|FBR_IMPLEMENTATION|fbr-invoicing|fbrIntegration|fbr:/i.test(line)) {
    return true
  }
  if (/fbr-pos-integration|fbr-digital-invoicing|megaMenuAr|moduleRichPages|moduleDetailConfig|cardIconColors|megaMenuColors|unsplash|download-software|softwareImageManifest|expandDetailPage|premiumImagePacks|powerfulModulesCards|industryProgrammeCards|ErpModulesSection|DetailSoftwareMockup|migrate-original|image-replacement|seed-mega-menus|audit-uae-content/i.test(file)) {
    return /fbr-pos-integration|fbr-digital-invoicing|cardKey:\s*'fbr'|id:\s*'m-fbr'|id:\s*'i-fbr'|id:\s*'fbr-invoicing'|fbrIntegration|mergeFbr|FBR_IMPLEMENTATION|'fbr'|\"fbr\"/i.test(line)
  }
  return false
}

function walk(dir, out = []) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (SKIP_DIRS.has(name)) continue
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(tsx?|jsx?|mjs|json|html|css|md)$/i.test(name)) out.push(p)
  }
  return out
}

const files = []
for (const dir of SCAN_DIRS) {
  const st = statSync(dir, { throwIfNoEntry: false })
  if (!st) continue
  if (st.isDirectory()) walk(dir, files)
  else files.push(dir)
}
const hits = []

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  if (rel.includes('apply-uae-localization.mjs')) continue
  if (rel.includes('audit-uae-content.mjs')) continue
  if (rel.startsWith('scripts/migrate-original')) continue
  if (rel.startsWith('scripts/unsplash-image-catalog')) continue
  if (rel.startsWith('scripts/download-software-images')) continue
  if (rel.includes('image-replacement-report.json')) continue
  if (rel.includes('package-lock.json')) continue

  let text
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    continue
  }

  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const pat of PATTERNS) {
      if (!pat.re.test(line)) continue
      if (pat.id === 'fbr' && isAllowedFbrPath(rel, line)) continue
      if (pat.id === 'pk-domain' && /digitalmanager\.pk/i.test(line) && /replace|Pakistan|apply-uae/i.test(text.slice(0, 500))) continue
      hits.push({ file: rel, line: i + 1, pattern: pat.label, snippet: line.trim().slice(0, 120) })
    }
  }
}

console.log('# UAE content audit\n')
if (hits.length === 0) {
  console.log('No Pakistan-specific display content found.')
  process.exit(0)
}

console.log(`Found ${hits.length} potential issue(s):\n`)
for (const h of hits) {
  console.log(`- ${h.file}:${h.line} [${h.pattern}]`)
  console.log(`  ${h.snippet}\n`)
}
process.exit(1)
