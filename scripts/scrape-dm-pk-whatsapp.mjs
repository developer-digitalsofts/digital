const html = await (await fetch('https://digitalmanager.pk')).text()
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
for (const s of scripts) {
  if (/joinchat|whatsapp|923/i.test(s)) {
    console.log(s.slice(0, 800).replace(/\s+/g, ' '))
    console.log('---')
  }
}

// Look for inline config
const inline = html.match(/var joinchat[^;]+;/gi)
console.log('inline vars:', inline?.join('\n'))

const jcPhone = html.match(/"phone"\s*:\s*"(\d+)"/)
console.log('phone json:', jcPhone?.[1])

const emailBlock = html.match(/mailto:[^"']+/gi)
console.log('mailto:', [...new Set(emailBlock || [])])

// Top bar area - search for sales@
const topSection = html.slice(0, 120000)
console.log('sales in top:', topSection.includes('sales@digitalmanager.pk'))
console.log('326 in top:', topSection.match(/326 786 6000/))
