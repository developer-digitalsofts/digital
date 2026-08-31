const url = process.argv[2] || 'https://digitalmanager.pk'
const res = await fetch(url)
const html = await res.text()

const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  .map((m) => {
    try {
      return JSON.parse(m[1])
    } catch {
      return null
    }
  })
  .filter(Boolean)

console.log('=== JSON-LD ===')
console.log(JSON.stringify(jsonLd, null, 2))

const emails = [...html.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map((m) => m[0])
console.log('\n=== emails ===')
console.log([...new Set(emails)].join('\n'))

const tels = [...html.matchAll(/href="(tel:[^"]+)"/gi)].map((m) => m[1])
console.log('\n=== tel hrefs ===')
console.log([...new Set(tels)].join('\n'))

const wa = [...html.matchAll(/https?:\/\/(?:api\.)?whatsapp\.com\/[^"'\s]+|https?:\/\/wa\.me\/\d+/gi)].map((m) => m[0])
console.log('\n=== whatsapp ===')
console.log([...new Set(wa)].join('\n'))

const social = [...html.matchAll(/https?:\/\/(?:www\.)?(facebook|linkedin|instagram|youtube|twitter|x)\.com[^"'\s>]*/gi)].map((m) => m[0])
console.log('\n=== social ===')
console.log([...new Set(social)].join('\n'))

const talk = html.match(/Talk to Us[^<]{0,120}/i)?.[0]
console.log('\n=== talk to us ===')
console.log(talk || 'n/a')

const footerPhone = html.match(/\+92 326 786 6000[\s\S]{0,200}/)?.[0]?.replace(/<[^>]+>/g, ' ')
console.log('\n=== footer phone context ===')
console.log(footerPhone?.trim() || 'n/a')
