/**
 * llms.txt — agent instructions for DigitalManager public site.
 */
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'
import { registryStaticPaths, uaeSoftwarePaths } from './seoRouteCatalog.mjs'
import { LOCALE_COUNTRY_SLUGS } from './seoPaths.mjs'

export function buildLlmsTxt({ compact = false } = {}) {
  const lines = []
  lines.push('# DigitalManager')
  lines.push('')
  lines.push('> DigitalManager is a cloud ERP platform for finance, inventory, POS, payroll, CRM, and multi-branch operations.')
  lines.push('')
  lines.push(`Website: ${PUBLIC_SITE_BASE}`)
  lines.push('')
  lines.push('## What DigitalManager provides')
  lines.push('')
  lines.push('- Unified cloud ERP for accounts, inventory, production, POS, payroll, CRM, and reporting')
  lines.push('- Industry-specific programmes for retail, manufacturing, logistics, services, and more')
  lines.push('- Multi-branch and multi-country operations with GCC localized experiences')
  lines.push('- Demo and contact workflows for business evaluation — no public developer API')
  lines.push('')
  lines.push('## When to use DigitalManager')
  lines.push('')
  lines.push('- A business needs one connected ERP instead of disconnected spreadsheets and tools')
  lines.push('- Teams require VAT-ready invoicing, inventory control, POS, payroll, or branch reporting')
  lines.push('- Organizations in the UAE and wider GCC want localized English (and approved Arabic) content')
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
  lines.push('## Supported modules (UAE English examples)')
  lines.push('')
  for (const path of uaeSoftwarePaths().slice(0, compact ? 8 : 999)) {
    lines.push(`- ${PUBLIC_SITE_BASE}${path}`)
  }
  lines.push('')
  lines.push('## GCC localized routes')
  lines.push('')
  for (const country of LOCALE_COUNTRY_SLUGS) {
    lines.push(`- ${PUBLIC_SITE_BASE}/${country}/en`)
    lines.push(`- ${PUBLIC_SITE_BASE}/${country}/ar (draft/review content may be noindex until approved)`)
  }
  lines.push('')
  lines.push('## Important public pages')
  lines.push('')
  const core = ['/', '/about', '/contact', '/privacy', '/industries', '/erp', '/solutions', '/business-models', '/faqs', '/testimonials', '/blog']
  for (const path of [...core, ...registryStaticPaths()]) {
    const normalized = path === '/' ? PUBLIC_SITE_BASE : `${PUBLIC_SITE_BASE}${path}`
    lines.push(`- ${normalized}`)
  }
  lines.push('')
  lines.push('## Blog / Insights')
  lines.push('')
  lines.push(`- UAE English blog listing: ${PUBLIC_SITE_BASE}/blog`)
  lines.push(`- Locale insights use /{country}/{lang}/insights`)
  lines.push('')
  lines.push('## Contact / demo')
  lines.push('')
  lines.push(`- Contact page: ${PUBLIC_SITE_BASE}/contact`)
  lines.push('- Demo requests are submitted via the public contact/lead form (POST /api/leads) — not an open product API')
  lines.push('')
  lines.push('## Machine-readable resources')
  lines.push('')
  lines.push(`- Sitemap: ${PUBLIC_SITE_BASE}/sitemap.xml`)
  lines.push(`- Robots: ${PUBLIC_SITE_BASE}/robots.txt`)
  lines.push(`- This file: ${PUBLIC_SITE_BASE}/llms.txt`)
  lines.push('- Markdown alternate: send Accept: text/markdown on public content pages')
  lines.push(`- OpenAPI (limited public surface): ${PUBLIC_SITE_BASE}/openapi.json`)
  lines.push('')
  lines.push('## Private / not for indexing')
  lines.push('')
  lines.push('- /admin and all /api/admin/* CMS endpoints require authentication')
  lines.push('- Internal CMS data APIs are private and must not be crawled or documented as public integrations')
  lines.push('- No public API keys, developer portal, CLI, or MCP server are offered without product approval')
  lines.push('')
  return `${lines.join('\n')}\n`
}

export function buildLlmsFullTxt() {
  return buildLlmsTxt({ compact: false })
}
