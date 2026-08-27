/**
 * Live production probe for agentic regression diagnosis.
 */
const probes = [
  { label: 'apex-html', url: 'https://digitalmanager.ae/', headers: { Accept: 'text/html' } },
  { label: 'www-html', url: 'https://www.digitalmanager.ae/', headers: { Accept: 'text/html' } },
  { label: 'apex-md', url: 'https://digitalmanager.ae/', headers: { Accept: 'text/markdown' } },
  { label: 'www-md', url: 'https://www.digitalmanager.ae/', headers: { Accept: 'text/markdown' } },
  { label: 'default', url: 'https://www.digitalmanager.ae/', headers: {} },
  { label: 'browser', url: 'https://www.digitalmanager.ae/', headers: {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Site': 'none',
  }},
]

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function jsonLdTypes(html) {
  const types = []
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const block = JSON.parse(m[1])
      if (block['@type']) types.push(block['@type'])
    } catch { /* ignore */ }
  }
  return types
}

for (const probe of probes) {
  const res = await fetch(probe.url, { headers: probe.headers, redirect: 'follow' })
  const text = await res.text()
  const ct = res.headers.get('content-type') || ''
  const vary = res.headers.get('vary') || ''
  const cc = res.headers.get('cache-control') || ''
  const h1 = (text.match(/<h1[^>]*>/gi) || []).length
  const vis = visibleText(text)
  console.log(JSON.stringify({
    label: probe.label,
    status: res.status,
    finalUrl: res.url,
    contentType: ct,
    vary,
    cacheControl: cc,
    bodyLen: text.length,
    visibleChars: vis.length,
    h1Count: h1,
    hasModuleJs: /type="module"/.test(text),
    hasCss: /\/assets\/[^"']+\.css/.test(text),
    jsonLd: jsonLdTypes(text),
    prerender: text.includes('data-agentic-prerender'),
    emptyRoot: /<div id="root">\s*<\/div>/i.test(text),
    mdStartsH1: text.startsWith('# '),
    noscript: /<noscript>/i.test(text),
  }, null, 0))
}
