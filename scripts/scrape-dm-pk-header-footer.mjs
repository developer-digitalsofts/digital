const html = await (await fetch('https://digitalmanager.pk')).text()

// Strip scripts/styles to reduce noise
const stripped = html
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')

const text = stripped.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

const idx = (needle) => text.toLowerCase().indexOf(needle.toLowerCase())
for (const needle of ['sales@', 'info@', 'support@', 'Mon - Sat', 'Monday', 'Talk to Us', '10.00', '6.00', 'whatsapp', 'DigitalSofts']) {
  const i = idx(needle)
  console.log(needle + ':', i >= 0 ? text.slice(Math.max(0, i - 40), i + 120) : 'NOT FOUND')
}

// Elementor header area
const headerMatch = html.match(/elementor-location-header[\s\S]{0,8000}/i)
if (headerMatch) {
  const h = headerMatch[0].replace(/<script[\s\S]*?<\/script>/gi, '')
  const emails = [...new Set([...h.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map((m) => m[0]))]
  const tels = [...new Set([...h.matchAll(/href="(tel:[^"]+)"/gi)].map((m) => m[1]))]
  console.log('\nheader emails:', emails)
  console.log('header tels:', tels)
  const visible = h.replace(/<[^>]+>/g, '|').replace(/\|+/g, '|').split('|').filter((s) => s.trim().length > 2 && s.trim().length < 80)
  console.log('header visible snippets:', visible.slice(0, 30).join('\n'))
}

const footerMatch = html.match(/elementor-location-footer[\s\S]{0,12000}/i)
if (footerMatch) {
  const f = footerMatch[0]
  const emails = [...new Set([...f.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)].map((m) => m[0]))]
  const tels = [...new Set([...f.matchAll(/href="(tel:[^"]+)"/gi)].map((m) => m[1]))]
  const wa = [...new Set([...f.matchAll(/wa\.me\/\d+|api\.whatsapp\.com[^"'\s]+/gi)].map((m) => m[0]))]
  console.log('\nfooter emails:', emails)
  console.log('footer tels:', tels)
  console.log('footer wa:', wa)
  const visible = f.replace(/<[^>]+>/g, '|').replace(/\|+/g, '|').split('|').filter((s) => /\+92|@|Mon|Sat|am|pm|Canal|Faisal|Talk|sales/i.test(s))
  console.log('footer contact snippets:', visible.join('\n'))
}
