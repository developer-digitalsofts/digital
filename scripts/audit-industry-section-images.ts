/**
 * Audit resolved industry section images for duplicate paths per page.
 * Usage: npx vite-node scripts/audit-industry-section-images.ts
 */
import { industryCategories } from '../src/data/megaMenu.ts'
import { getIndustryRichPage } from '../src/data/industryRichPages.ts'
import { buildSoftwareDetailPageData } from '../src/data/softwareDetail/expandDetailPage.ts'
import { mapIndustryMasterSections } from '../src/data/softwareDetail/mapIndustryMasterSections.ts'

function normalize(src: string): string {
  try {
    return decodeURIComponent(src.split('?')[0].replace(/\\/g, '/').toLowerCase())
  } catch {
    return src.toLowerCase()
  }
}

const issues: { slug: string; section: string; duplicateOf: string; path: string }[] = []

for (const cat of industryCategories) {
  for (const link of cat.links) {
    const slug = link.slug
    const label = link.labelEn
    const rich = getIndustryRichPage(slug, label, 'en')
    const detail = buildSoftwareDetailPageData(slug, 'industry', label, rich, 'en')
    const sections = mapIndustryMasterSections(detail, slug, label, 'en')

    const seen = new Map<string, string>()
    const register = (src: string | undefined, section: string) => {
      if (!src?.trim()) return
      const key = normalize(src)
      if (seen.has(key)) {
        issues.push({ slug, section, duplicateOf: seen.get(key)!, path: key })
      } else {
        seen.set(key, section)
      }
    }

    register(sections.hero.heroImage, 'hero')
    sections.operationalCards.forEach((c, i) => register(c.image, `operational[${i}] ${c.title}`))
    sections.benefitRows.forEach((r, i) => register(r.image, `benefitRow[${i}] ${r.title}`))
    sections.businessTypes.cards.forEach((c, i) => register(c.image, `businessType[${i}] ${c.title}`))
    if (sections.testimonial) register(sections.testimonial.image, 'testimonial')
  }
}

console.log(`Audited ${industryCategories.flatMap((c) => c.links).length} industry pages.`)
if (!issues.length) {
  console.log('No duplicate image paths detected.')
  process.exit(0)
}

console.log(`Found ${issues.length} duplicate image paths:`)
for (const row of issues.slice(0, 50)) {
  console.log(`- ${row.slug}: ${row.section} duplicates ${row.duplicateOf}`)
}
if (issues.length > 50) console.log(`… and ${issues.length - 50} more`)
process.exit(1)
