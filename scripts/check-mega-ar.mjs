import { readFileSync } from 'fs'
import { industryCategories, moduleMegaItems } from '../src/data/megaMenu.ts'

const arSrc = readFileSync('src/i18n/megaMenuAr.ts', 'utf8')

function hasKey(slug) {
  return arSrc.includes(`'${slug}':`)
}

const missingMod = moduleMegaItems.filter((m) => !hasKey(m.slug)).map((m) => m.slug)
const missingInd = []
for (const cat of industryCategories) {
  for (const link of cat.links) {
    if (!hasKey(link.slug)) missingInd.push({ slug: link.slug, en: link.labelEn, cat: cat.id })
  }
}

console.log('Missing modules:', missingMod)
console.log('Missing industries:', missingInd.length)
missingInd.forEach((x) => console.log(x.slug, '|', x.en))
