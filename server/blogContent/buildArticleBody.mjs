/**
 * Converts editorial section definitions into BlogBlock[] records.
 * Section types map to CMS block types: h2→heading2, h3→heading3, p→paragraph,
 * bullets→bulletList, quote→quote.
 */

/** @typedef {{ en: string; ar: string }} Bilingual */

/**
 * @typedef {'h2'|'h3'|'p'|'bullets'|'quote'} SectionType
 * @typedef {{ type: SectionType; en: string|string[]; ar?: string|string[] }} SectionDef
 * @typedef {{ id: string; question: string|Bilingual; answer: string|Bilingual }} FaqInput
 */

/**
 * Build a bilingual field pair.
 * @param {string} en
 * @param {string} [ar]
 * @returns {Bilingual}
 */
export function bi(en, ar = '') {
  return { en, ar: ar || '' }
}

/**
 * Generate a stable block id.
 * @param {string} prefix
 * @param {number|string} n
 * @returns {string}
 */
export function blockId(prefix, n) {
  return `${prefix}-${n}`
}

/**
 * Resolve bilingual text from a section field.
 * @param {string|string[]|undefined} en
 * @param {string|string[]|undefined} ar
 * @param {'en'|'ar'} lang
 * @returns {string|string[]}
 */
function resolveField(en, ar, lang) {
  if (lang === 'ar' && ar != null && ar !== '') return ar
  return en ?? ''
}

/**
 * Build BlogBlock[] from editorial sections.
 * When lang is 'ar', body text prefers section.ar with en fallback.
 * Blocks always carry both en and ar keys for CMS compatibility.
 *
 * @param {SectionDef[]} sections
 * @param {'en'|'ar'} [lang='en']
 * @returns {Array<Record<string, unknown>>}
 */
export function buildArticleBody(sections, lang = 'en') {
  /** @type {import('../../src/types/blogContent.ts').BlogBlock[]} */
  const blocks = []
  let counter = 0

  for (const section of sections) {
    counter += 1
    const id = blockId(section.type, counter)
    const enVal = section.en ?? ''
    const arVal = section.ar ?? ''

    switch (section.type) {
      case 'h2':
        blocks.push({
          id,
          type: 'heading2',
          text: bi(
            typeof enVal === 'string' ? enVal : enVal.join(' '),
            typeof arVal === 'string' ? arVal : Array.isArray(arVal) ? arVal.join(' ') : '',
          ),
        })
        break

      case 'h3':
        blocks.push({
          id,
          type: 'heading3',
          text: bi(
            typeof enVal === 'string' ? enVal : enVal.join(' '),
            typeof arVal === 'string' ? arVal : Array.isArray(arVal) ? arVal.join(' ') : '',
          ),
        })
        break

      case 'p':
        blocks.push({
          id,
          type: 'paragraph',
          text: bi(
            resolveField(enVal, arVal, lang),
            arVal || '',
          ),
        })
        break

      case 'bullets': {
        const enItems = Array.isArray(enVal) ? enVal : [enVal]
        const arItems = Array.isArray(arVal) ? arVal : arVal ? [arVal] : []
        blocks.push({
          id,
          type: 'bulletList',
          items: enItems.map((item, i) =>
            bi(item, arItems[i] || ''),
          ),
        })
        break
      }

      case 'quote':
        blocks.push({
          id,
          type: 'quote',
          text: bi(
            resolveField(enVal, arVal, lang),
            arVal || '',
          ),
        })
        break

      default:
        break
    }
  }

  return blocks
}

/**
 * Build FAQ items with bilingual question/answer pairs.
 * Accepts plain strings (English-only) or pre-built Bilingual objects.
 *
 * @param {FaqInput[]} items
 * @returns {Array<Record<string, unknown>>}
 */
export function buildFaq(items) {
  return items.map((item, index) => {
    const question =
      typeof item.question === 'string'
        ? bi(item.question, '')
        : { en: item.question.en, ar: item.question.ar || '' }

    const answer =
      typeof item.answer === 'string'
        ? bi(item.answer, '')
        : { en: item.answer.en, ar: item.answer.ar || '' }

    return {
      id: item.id || blockId('faq', index + 1),
      question,
      answer,
    }
  })
}
