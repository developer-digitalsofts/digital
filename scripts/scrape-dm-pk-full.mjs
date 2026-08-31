const urls = [
  'https://digitalmanager.pk',
  'https://digitalmanager.pk/contact',
  'https://digitalmanager.pk/about-us',
]

for (const url of urls) {
  const html = await (await fetch(url)).text()
  console.log('\n===== ' + url + ' =====')

  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => {
    try {
      return JSON.parse(m[1])
    } catch {
      return null
    }
  }).filter(Boolean)

  for (const block of ldBlocks) {
    const graph = block['@graph'] || [block]
    for (const node of graph) {
      const type = node['@type']
      if (['Organization', 'LocalBusiness', 'Place', 'ContactPoint', 'WebSite', 'PostalAddress'].includes(type)) {
        console.log('JSON-LD ' + type + ':', JSON.stringify(node, null, 2))
      }
    }
  }

  const emails = [...new Set([...html.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map((m) => m[0]))]
  console.log('emails:', emails.join(', '))

  const tels = [...new Set([...html.matchAll(/href="(tel:[^"]+)"/gi)].map((m) => m[1]))]
  console.log('tels:', tels.join(', '))

  const phones = [...new Set([...html.matchAll(/\+92[\d\s\-]{7,22}/g)].map((m) => m[0].replace(/\s+/g, ' ').trim()))]
  console.log('phone text:', phones.join(' | '))

  const social = [...new Set([...html.matchAll(/https?:\/\/(?:www\.)?(facebook|linkedin|instagram|youtube|twitter|x)\.com[^"'\s>]*/gi)].map((m) => m[0]))]
  console.log('social:', social.join(', '))

  const maps = [...new Set([...html.matchAll(/https?:\/\/(?:www\.)?(?:google\.[^"'\s>]+|maps\.app\.goo\.gl[^"'\s>]+|goo\.gl\/maps[^"'\s>]+)/gi)].map((m) => m[0]))]
  console.log('maps:', maps.join(', '))

  const hours = [...new Set([...html.matchAll(/(?:Mon|Monday)[^<]{0,100}(?:am|pm)/gi)].map((m) => m[0].replace(/\s+/g, ' ').trim()))]
  console.log('hours:', hours.join(' | ') || 'none')
}
