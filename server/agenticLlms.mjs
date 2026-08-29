/**
 * llms.txt — agent instructions for DigitalManager public site.
 */
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'
import { registryStaticPaths, uaeSoftwarePaths } from './seoRouteCatalog.mjs'
import { ALL_CITY_SLUGS } from './cityRegistry.mjs'
import { CITY_PRODUCT_PAGE_SLUGS } from './pakistanConfig.mjs'
import { PUBLIC_API_VERSION_POLICY } from './publicApiVersioning.mjs'

export function buildLlmsTxt({ compact = false } = {}) {
  const lines = []
  lines.push('# DigitalManager')
  lines.push('')
  lines.push('> DigitalManager is a cloud ERP platform for finance, inventory, POS, payroll, CRM, and multi-branch operations.')
  lines.push('')
  lines.push(`Website (canonical): ${PUBLIC_SITE_BASE}`)
  lines.push('')
  lines.push('## What DigitalManager provides')
  lines.push('')
  lines.push('- Unified cloud ERP for accounts, inventory, production, POS, payroll, CRM, and reporting')
  lines.push('- Industry-specific programmes for retail, manufacturing, logistics, services, and more')
  lines.push('- Multi-branch and multi-city operations with Pakistan localized experiences')
  lines.push('- Demo and contact workflows via POST /api/public/v1/leads; read-only public content API documented at /developers')
  lines.push('')
  lines.push('## DigitalManager Developer Platform')
  lines.push('')
  lines.push(`- Developer overview (DigitalManager Developer Platform): ${PUBLIC_SITE_BASE}/developers`)
  lines.push(`- OpenAPI 3.1 specification (DigitalManager public API): ${PUBLIC_SITE_BASE}/openapi.json`)
  lines.push(`- Agent instructions (llms.txt): ${PUBLIC_SITE_BASE}/llms.txt`)
  lines.push(`- Full agent index: ${PUBLIC_SITE_BASE}/llms-full.txt`)
  lines.push('- Stable public JSON routes: /api/public/v1/*')
  lines.push('- Authentication: no API keys for documented public endpoints; /api/admin/* requires CMS login')
  lines.push('- Versioning: legacy /api/public/* aliases remain until Sunset; prefer /api/public/v1/* for new integrations')
  lines.push('- Local CLI (repo only): node tools/dm-public-cli/bin/dm-public.mjs')
  lines.push('- Not offered: hosted MCP server, webhooks product, public sandbox, or npm SDK')
  lines.push('')
  lines.push('## When agents should call the public API')
  lines.push('')
  lines.push('- Use GET /api/public/v1/locale-content/erp (or /solutions, /faqs) to fetch published ERP programme copy programmatically')
  lines.push('- Use GET /api/public/v1/blog/posts and /api/public/v1/testimonials for published insights and social proof')
  lines.push('- Use GET /api/public/v1/site-settings for company contact details (email, phone, address)')
  lines.push('- Use GET /api/public/v1/seo-page?path=... to resolve canonical URLs, hreflang, and robots metadata')
  lines.push('- Use POST /api/public/v1/leads only for human demo/contact submissions (rate limited; no API key today)')
  lines.push('- Do NOT call /api/admin/* — those routes require CMS authentication')
  lines.push('')
  lines.push('## API versioning policy')
  lines.push('')
  for (const row of PUBLIC_API_VERSION_POLICY.split('\n')) lines.push(`- ${row}`)
  lines.push('')
  lines.push('## When to use DigitalManager')
  lines.push('')
  lines.push('- A business needs one connected ERP instead of disconnected spreadsheets and tools')
  lines.push('- Teams require VAT-ready invoicing, inventory control, POS, payroll, or branch reporting')
  lines.push('- Organizations in Pakistan want localized English content for city and national pages')
  lines.push('- Users want product information, module overviews, industry pages, blog insights, or demo requests')
  lines.push('')
  lines.push('## Main ERP use cases')
  lines.push('')
  lines.push('- Financial management: ledger, vouchers, AR/AP, statements')
  lines.push('- Inventory and warehouse operations')
  lines.push('- Retail POS and branch sales')
  lines.push('- Payroll and HRM')
  lines.push('- Production and manufacturing workflows')
  lines.push('- CRM and customer operations')
  lines.push('')
  lines.push('## Supported modules (Pakistan English examples)')
  lines.push('')
  for (const path of uaeSoftwarePaths().slice(0, compact ? 8 : 999)) {
    lines.push(`- ${PUBLIC_SITE_BASE}${path}`)
  }
  lines.push('')
  lines.push('## Pakistan city routes')
  lines.push('')
  for (const city of ALL_CITY_SLUGS) {
    lines.push(`- ${PUBLIC_SITE_BASE}/${city}`)
    for (const product of CITY_PRODUCT_PAGE_SLUGS) {
      lines.push(`- ${PUBLIC_SITE_BASE}/${city}/software/${product}`)
    }
  }
  lines.push('')
  lines.push('## Important public pages')
  lines.push('')
  const core = ['/', '/about', '/contact', '/privacy', '/developers', '/industries', '/erp', '/solutions', '/business-models', '/faqs', '/testimonials', '/blog']
  for (const path of [...core, ...registryStaticPaths()]) {
    const normalized = path === '/' ? PUBLIC_SITE_BASE : `${PUBLIC_SITE_BASE}${path}`
    lines.push(`- ${normalized}`)
  }
  lines.push('')
  lines.push('## Blog / Insights')
  lines.push('')
  lines.push(`- Pakistan English blog listing: ${PUBLIC_SITE_BASE}/blog`)
  lines.push('')
  lines.push('## Contact / demo')
  lines.push('')
  lines.push(`- Contact page: ${PUBLIC_SITE_BASE}/contact`)
  lines.push('- Demo/contact: POST /api/public/v1/leads (public, rate limited, documented in /openapi.json)')
  lines.push('')
  lines.push('## Machine-readable resources')
  lines.push('')
  lines.push(`- Developer overview: ${PUBLIC_SITE_BASE}/developers`)
  lines.push(`- OpenAPI 3.1: ${PUBLIC_SITE_BASE}/openapi.json`)
  lines.push(`- Sitemap: ${PUBLIC_SITE_BASE}/sitemap.xml`)
  lines.push(`- Robots: ${PUBLIC_SITE_BASE}/robots.txt`)
  lines.push(`- This file: ${PUBLIC_SITE_BASE}/llms.txt`)
  lines.push('- Markdown alternate: send Accept: text/markdown on public content pages')
  lines.push('')
  lines.push('## Private / not for indexing')
  lines.push('')
  lines.push('- /admin and all /api/admin/* CMS endpoints require authentication')
  lines.push('- Internal CMS data APIs are private and must not be crawled or documented as public integrations')
  lines.push('- No public API keys, hosted MCP server, webhooks product, or npm SDK without product approval')
  lines.push('')
  return `${lines.join('\n')}\n`
}

export function buildLlmsFullTxt() {
  return buildLlmsTxt({ compact: false })
}
