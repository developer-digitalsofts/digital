#!/usr/bin/env node
/**
 * Local-only CLI for DigitalManager public read API (not published to npm).
 * Usage: node tools/dm-public-cli/bin/dm-public.mjs <command> [baseUrl]
 */
const BASE = (process.argv[3] || process.env.DM_PUBLIC_API_BASE || 'http://127.0.0.1:3040').replace(/\/$/, '')
const cmd = process.argv[2] || 'help'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = null
  }
  if (!res.ok) {
    console.error(JSON.stringify(json || { status: res.status, body: text.slice(0, 200) }, null, 2))
    process.exit(1)
  }
  return json
}

const commands = {
  help: () => {
    console.log(`DigitalManager public API CLI (local only)

Commands:
  health [baseUrl]     GET /api/health
  erp [baseUrl]        GET /api/public/locale-content/erp?country=AE&lang=en
  blog [baseUrl]       GET /api/public/blog/posts?country=AE&lang=en&page=1&pageSize=3
  seo [baseUrl]        GET /api/public/seo-page?path=/erp
  openapi [baseUrl]    GET /openapi.json (prints operation count)

Default base: ${BASE}
`)
  },
  health: () => get('/api/health').then((d) => console.log(JSON.stringify(d, null, 2))),
  erp: () => get('/api/public/locale-content/erp?country=AE&lang=en').then((d) => console.log(JSON.stringify({ title: d.page?.heading, slug: 'erp' }, null, 2))),
  blog: () => get('/api/public/blog/posts?country=AE&lang=en&page=1&pageSize=3').then((d) => console.log(JSON.stringify({ total: d.pagination?.total, titles: (d.items || []).map((p) => p.title) }, null, 2))),
  seo: () => get('/api/public/seo-page?path=/erp').then((d) => console.log(JSON.stringify({ canonical: d.canonical, title: d.title, noIndex: d.noIndex }, null, 2))),
  openapi: async () => {
    const spec = await get('/openapi.json')
    const ops = Object.values(spec.paths || {}).flatMap((methods) => Object.values(methods || {}))
    console.log(JSON.stringify({ openapi: spec.openapi, title: spec.info?.title, operations: ops.length, operationIds: ops.map((o) => o.operationId).filter(Boolean) }, null, 2))
  },
}

;(async () => {
  const fn = commands[cmd]
  if (!fn) {
    console.error(`Unknown command: ${cmd}`)
    commands.help()
    process.exit(1)
  }
  await fn()
})().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
