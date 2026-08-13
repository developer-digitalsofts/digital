import { apiBase, fetchWithTimeout } from '../cms/api'

export const DETAIL_PAGE_INQUIRY_SOURCE = 'Detail Page Request'

export function buildDetailPageInquiryMessage(opts: {
  email: string
  pageTitle: string
  slug: string
  submittedAt?: Date
}): string {
  const when = (opts.submittedAt ?? new Date()).toISOString()
  const lines = [
    `Email: ${opts.email.trim()}`,
    `Source: ${DETAIL_PAGE_INQUIRY_SOURCE}`,
    `Page Title/Slug: ${opts.pageTitle} (${opts.slug})`,
    `Date/Time: ${when}`,
  ]
  return lines.join('\n')
}

export async function submitDetailPageInquiry(opts: {
  email: string
  pageTitle: string
  slug: string
  sourcePath: string
}): Promise<void> {
  const email = opts.email.trim()
  const submittedAt = new Date()
  const message = buildDetailPageInquiryMessage({
    email,
    pageTitle: opts.pageTitle,
    slug: opts.slug,
    submittedAt,
  })

  const res = await fetchWithTimeout(`${apiBase()}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      phone: '',
      name: '',
      company: '',
      topic: 'detail-page-request',
      message,
      source: DETAIL_PAGE_INQUIRY_SOURCE,
      sourcePage: opts.sourcePath.slice(0, 500),
    }),
  })

  if (!res.ok) {
    throw new Error('Detail page inquiry failed')
  }
}
