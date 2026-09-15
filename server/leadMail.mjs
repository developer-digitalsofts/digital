/**
 * UAE lead / inquiry email helpers (server-side only).
 * From / To come from env; customer email is Reply-To only when real.
 */

export const LEAD_FIELD_LIMITS = {
  name: 200,
  email: 254,
  phone: 40,
  company: 200,
  topic: 80,
  message: 5000,
  source: 120,
  sourcePage: 500,
  productService: 200,
  countryCode: 3,
  localeCountry: 3,
  localeLang: 8,
  honeypot: 200,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INVENTED_DEMO_EMAIL_RE = /^demo\+\d+@digitalmanager\.(com\.pk|pk|ae)$/i
const HEADER_INJECTION_RE = /[\r\n\0]/

/** Safe fixed subjects — never interpolate customer input. */
export const LEAD_EMAIL_SUBJECTS = {
  contact: '[DigitalManager UAE] New Contact Inquiry',
  demo: '[DigitalManager UAE] New Demo Request',
  newsletter: '[DigitalManager UAE] New Newsletter Subscription',
  detail: '[DigitalManager UAE] New Detail Page Inquiry',
  other: '[DigitalManager UAE] New Website Inquiry',
}

export function containsHeaderInjection(value) {
  if (value == null) return false
  return HEADER_INJECTION_RE.test(String(value))
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function isInventedDemoEmail(email) {
  const e = String(email || '').trim()
  if (!e) return false
  return INVENTED_DEMO_EMAIL_RE.test(e)
}

export function isValidEmailFormat(email) {
  const e = String(email || '').trim()
  if (!e || e.length > LEAD_FIELD_LIMITS.email) return false
  if (containsHeaderInjection(e)) return false
  return EMAIL_RE.test(e)
}

/** Real customer address suitable for Reply-To (excludes invented placeholders). */
export function isValidCustomerReplyTo(email) {
  if (!isValidEmailFormat(email)) return false
  if (isInventedDemoEmail(email)) return false
  return true
}

export function clipField(value, max) {
  const s = typeof value === 'string' ? value.trim() : ''
  if (!s) return ''
  return s.slice(0, max)
}

export function classifyLeadEmailKind(lead) {
  const topic = String(lead?.topic || '')
    .trim()
    .toLowerCase()
  const source = String(lead?.source || '')
    .trim()
    .toLowerCase()
  const sourcePage = String(lead?.sourcePage || '')
    .trim()
    .toLowerCase()

  if (topic === 'newsletter' || source.includes('newsletter')) return 'newsletter'
  if (topic === 'detail-page-request' || source === 'detail page request') return 'detail'
  if (
    topic === 'demo' ||
    source.includes('demo') ||
    sourcePage.includes('get-demo') ||
    sourcePage.includes('personalized-demo')
  ) {
    return 'demo'
  }
  if (source.includes('contact') || sourcePage.includes('contact')) return 'contact'
  if (topic === 'pricing' || topic === 'support' || topic === 'other' || topic === '') return 'contact'
  return 'other'
}

export function resolveLeadEmailSubject(lead) {
  const kind = classifyLeadEmailKind(lead)
  return LEAD_EMAIL_SUBJECTS[kind] || LEAD_EMAIL_SUBJECTS.other
}

export function resolveReplyTo(lead) {
  const email = String(lead?.email || '').trim()
  if (!isValidCustomerReplyTo(email)) return undefined
  return email
}

function formSourceLabel(lead) {
  const kind = classifyLeadEmailKind(lead)
  const source = String(lead?.source || '').trim()
  if (source) return source
  if (kind === 'newsletter') return 'Footer Newsletter'
  if (kind === 'detail') return 'Detail Page Request'
  if (kind === 'demo') return 'Demo Request'
  return 'Contact Form'
}

export function buildLeadEmailText(lead) {
  const submittedAt = lead?.createdAt || new Date().toISOString()
  const lines = [
    'DigitalManager UAE — new website inquiry',
    '',
    `Form: ${formSourceLabel(lead)}`,
    `Submitted at: ${submittedAt}`,
    `Page URL: ${lead?.sourcePage || '(not provided)'}`,
    `Website: DigitalManager UAE (digitalmanager.ae)`,
    '',
    `Name: ${lead?.name || '(not provided)'}`,
    `Email: ${lead?.email || '(not provided)'}`,
    `Phone: ${lead?.phone || '(not provided)'}`,
    `Company: ${lead?.company || '(not provided)'}`,
    `Topic: ${lead?.topic || '(not provided)'}`,
    `Product / service: ${lead?.productService || '(not provided)'}`,
    `Country: ${lead?.countryCode || lead?.localeCountry || 'AE'}`,
    `Language: ${lead?.localeLang || 'en'}`,
    '',
    'Message:',
    lead?.message || '(none)',
    '',
    `Lead ID: ${lead?.id || ''}`,
  ]
  return lines.join('\n')
}

export function buildLeadEmailHtml(lead) {
  const row = (label, value) =>
    `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#475569;font-weight:600">${escapeHtml(label)}</td><td style="padding:6px 0;color:#0f172a">${escapeHtml(value || '(not provided)')}</td></tr>`

  const message = escapeHtml(lead?.message || '(none)').replace(/\n/g, '<br/>')

  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;color:#0f172a">
<p><strong>DigitalManager UAE</strong> — new website inquiry</p>
<table style="border-collapse:collapse">
${row('Form', formSourceLabel(lead))}
${row('Submitted at', lead?.createdAt || new Date().toISOString())}
${row('Page URL', lead?.sourcePage || '(not provided)')}
${row('Website', 'DigitalManager UAE (digitalmanager.ae)')}
${row('Name', lead?.name)}
${row('Email', lead?.email)}
${row('Phone', lead?.phone)}
${row('Company', lead?.company)}
${row('Topic', lead?.topic)}
${row('Product / service', lead?.productService)}
${row('Country', lead?.countryCode || lead?.localeCountry || 'AE')}
${row('Language', lead?.localeLang || 'en')}
${row('Lead ID', lead?.id)}
</table>
<p style="margin-top:16px"><strong>Message</strong></p>
<p>${message}</p>
</body></html>`
}

/**
 * @param {object} lead
 * @param {object} smtp — from resolveSmtpConfig()
 * @param {{ createTransport?: Function }} [deps] — injectable for tests
 * @returns {Promise<{ sent: boolean, reason?: string }>}
 */
export async function sendLeadInquiryEmail(lead, smtp, deps = {}) {
  if (!smtp?.ok) {
    console.warn(`[lead email] skipped — SMTP incomplete${smtp?.missing?.length ? `: ${smtp.missing.join(', ')}` : ''}`)
    return { sent: false, reason: 'not_configured' }
  }
  const to = String(smtp.toEmail || '').trim()
  if (!to) {
    console.warn('[lead email] skipped — SMTP_TO_EMAIL is not set')
    return { sent: false, reason: 'no_recipient' }
  }
  const fromEmail = String(smtp.fromEmail || '').trim()
  if (!fromEmail) {
    console.warn('[lead email] skipped — SMTP_FROM_EMAIL is not set')
    return { sent: false, reason: 'no_from' }
  }

  const fromName = String(smtp.fromName || 'DigitalManager').trim() || 'DigitalManager'
  const subject = resolveLeadEmailSubject(lead)
  const replyTo = resolveReplyTo(lead)
  const text = buildLeadEmailText(lead)
  const html = buildLeadEmailHtml(lead)

  const createTransport = deps.createTransport
  try {
    const nodemailer = deps.nodemailer || (await import('nodemailer')).default
    const transport = (createTransport || nodemailer.createTransport.bind(nodemailer))({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure === true,
      requireTLS: smtp.port === 587 && smtp.secure !== true,
      auth: { user: smtp.user, pass: smtp.pass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
    })

    const mail = {
      from: `"${fromName.replace(/[\r\n"]/g, '')}" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
    }
    if (replyTo) mail.replyTo = replyTo

    await transport.sendMail(mail)
    return { sent: true }
  } catch (e) {
    const msg = e && typeof e === 'object' && 'message' in e ? String(e.message) : 'send failed'
    // Never log credentials, auth objects, or full config
    console.error('[lead email] delivery failed:', msg.replace(/pass(word)?[=:]\S+/gi, 'pass=***'))
    return { sent: false, reason: 'delivery_failed' }
  }
}
