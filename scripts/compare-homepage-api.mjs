/**
 * Compare local vs production /api/homepage hero payload (read-only diagnostic).
 * Usage:
 *   node scripts/compare-homepage-api.mjs
 *   LOCAL_BASE=http://127.0.0.1:3040 PROD_BASE=https://www.digitalmanager.ae node scripts/compare-homepage-api.mjs
 */
const LOCAL_BASE = (process.env.LOCAL_BASE || 'http://127.0.0.1:3040').replace(/\/$/, '')
const PROD_BASE = (process.env.PROD_BASE || 'https://www.digitalmanager.ae').replace(/\/$/, '')

async function probe(base) {
  const url = `${base}/api/homepage?v=${Date.now()}`
  const row = {
    base,
    url,
    ok: false,
    status: null,
    contentType: null,
    isHtml: false,
    error: null,
    slideCount: null,
    visibleSlides: null,
    slideIds: [],
    pill0: null,
    headline0: null,
    carouselEnabled: null,
    schemaVersion: null,
    updatedAt: null,
    publishedAt: null,
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      redirect: 'follow',
      signal: AbortSignal.timeout(45000),
    })
    row.status = res.status
    row.contentType = res.headers.get('content-type') || ''
    const text = await res.text()
    row.isHtml = /<!doctype html/i.test(text.slice(0, 200))
    if (!res.ok) {
      row.error = text.slice(0, 200)
      return row
    }
    let json
    try {
      json = JSON.parse(text)
    } catch {
      row.error = 'Invalid JSON body'
      return row
    }
    const hero = json?.hero
    const slides = Array.isArray(hero?.slides) ? hero.slides : []
    row.ok = true
    row.slideCount = slides.length
    row.visibleSlides = slides.filter((s) => s && s.visible !== false && s.enabled !== false).length
    row.slideIds = slides.map((s) => s?.id).filter(Boolean)
    row.pill0 = slides[0]?.pill?.en ?? hero?.pill?.en ?? null
    row.headline0 = slides[0]?.titleBefore?.en ?? slides[0]?.headline?.en ?? null
    row.carouselEnabled = hero?.carouselEnabled ?? null
    row.schemaVersion = hero?.schemaVersion ?? json?.meta?.schemaVersion ?? null
    row.updatedAt = json?.meta?.updatedAt ?? hero?._meta?.updatedAt ?? null
    row.publishedAt = json?.meta?.publishedAt ?? null
  } catch (e) {
    row.error = e instanceof Error ? e.message : String(e)
  }
  return row
}

function printTable(rows) {
  const headers = [
    'Environment',
    'Status',
    'Content-Type',
    'HTML?',
    'Slides',
    'Visible',
    'schemaVersion',
    'carouselEnabled',
    'pill[0]',
    'publishedAt',
    'Error',
  ]
  console.log(headers.join('\t'))
  for (const r of rows) {
    console.log(
      [
        r.base,
        r.status ?? '—',
        (r.contentType || '—').replace(/;.*$/, ''),
        r.isHtml ? 'yes' : 'no',
        r.slideCount ?? '—',
        r.visibleSlides ?? '—',
        r.schemaVersion ?? '—',
        r.carouselEnabled ?? '—',
        r.pill0 ?? '—',
        r.publishedAt ?? '—',
        r.error ?? '—',
      ].join('\t'),
    )
  }
}

const rows = await Promise.all([probe(LOCAL_BASE), probe(PROD_BASE)])
printTable(rows)
process.exit(rows.some((r) => !r.ok) ? 1 : 0)
