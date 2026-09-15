/**
 * Node built-in test runner for UAE lead/SMTP helpers.
 * Run: npm run test:mail
 */
import { afterEach, describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import {
  LEAD_EMAIL_SUBJECTS,
  buildLeadEmailHtml,
  buildLeadEmailText,
  classifyLeadEmailKind,
  containsHeaderInjection,
  escapeHtml,
  isInventedDemoEmail,
  isValidCustomerReplyTo,
  resolveLeadEmailSubject,
  resolveReplyTo,
  sendLeadInquiryEmail,
} from './leadMail.mjs'
import { resolveSmtpConfig } from './envConfig.mjs'

const SMTP_ENV_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_PASS',
  'SMTP_FROM_EMAIL',
  'SMTP_FROM_NAME',
  'SMTP_TO_EMAIL',
  'CONTACT_RECEIVER_EMAIL',
]

function clearSmtpEnv() {
  for (const k of SMTP_ENV_KEYS) delete process.env[k]
}

function setUaeSmtpEnv(overrides = {}) {
  clearSmtpEnv()
  Object.assign(process.env, {
    SMTP_HOST: 'mail.digitalmanager.ae',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: 'info@digitalmanager.ae',
    SMTP_PASSWORD: 'test-password-not-real',
    SMTP_FROM_EMAIL: 'info@digitalmanager.ae',
    SMTP_FROM_NAME: 'DigitalManager',
    SMTP_TO_EMAIL: 'sales@digitalsofts.com',
    ...overrides,
  })
}

afterEach(() => {
  clearSmtpEnv()
  mock.restoreAll()
})

describe('resolveSmtpConfig (UAE)', () => {
  it('requires SMTP_PASSWORD and SMTP_TO_EMAIL', () => {
    setUaeSmtpEnv({ SMTP_PASSWORD: '', SMTP_TO_EMAIL: '' })
    const cfg = resolveSmtpConfig()
    assert.equal(cfg.ok, false)
    assert.ok(cfg.missing.includes('SMTP_PASSWORD'))
    assert.ok(cfg.missing.includes('SMTP_TO_EMAIL'))
  })

  it('uses fixed From/To and STARTTLS port 587', () => {
    setUaeSmtpEnv()
    const cfg = resolveSmtpConfig()
    assert.equal(cfg.ok, true)
    assert.equal(cfg.toEmail, 'sales@digitalsofts.com')
    assert.equal(cfg.fromEmail, 'info@digitalmanager.ae')
    assert.equal(cfg.fromName, 'DigitalManager')
    assert.equal(cfg.port, 587)
    assert.equal(cfg.secure, false)
  })
})

describe('subjects and classification', () => {
  it('uses fixed UAE subjects without customer input', () => {
    assert.equal(
      resolveLeadEmailSubject({ source: 'Contact Form', topic: 'pricing', name: 'Evil\nBcc: x' }),
      LEAD_EMAIL_SUBJECTS.contact,
    )
    assert.equal(resolveLeadEmailSubject({ source: 'Get Demo Modal', topic: 'demo' }), LEAD_EMAIL_SUBJECTS.demo)
    assert.equal(
      resolveLeadEmailSubject({ source: 'Footer Newsletter', topic: 'newsletter' }),
      LEAD_EMAIL_SUBJECTS.newsletter,
    )
    assert.equal(classifyLeadEmailKind({ source: 'Contact Form', topic: 'support' }), 'contact')
  })
})

describe('header injection and sanitization', () => {
  it('detects CR/LF and escapes HTML', () => {
    assert.equal(containsHeaderInjection('ok'), false)
    assert.equal(containsHeaderInjection('bad\r\nBcc: evil@x.com'), true)
    assert.equal(escapeHtml('<script>x</script>'), '&lt;script&gt;x&lt;/script&gt;')
    const html = buildLeadEmailHtml({
      name: '<b>Hack</b>',
      email: 'a@b.com',
      message: 'Hello <img src=x>',
      source: 'Contact Form',
      id: 'abc',
    })
    assert.ok(!html.includes('<b>Hack</b>'))
    assert.ok(html.includes('&lt;b&gt;Hack&lt;/b&gt;'))
    assert.ok(html.includes('DigitalManager UAE'))
  })

  it('includes UAE identification in text body', () => {
    const text = buildLeadEmailText({
      source: 'Contact Form',
      email: 'c@example.com',
      sourcePage: '/contact',
      createdAt: '2026-09-09T00:00:00.000Z',
      id: 'id1',
    })
    assert.ok(text.includes('DigitalManager UAE'))
    assert.ok(text.includes('digitalmanager.ae'))
    assert.ok(text.includes('/contact'))
  })
})

describe('Reply-To rules', () => {
  it('accepts real customer email and rejects invented demo emails', () => {
    assert.equal(isValidCustomerReplyTo('buyer@company.com'), true)
    assert.equal(resolveReplyTo({ email: 'buyer@company.com' }), 'buyer@company.com')
    assert.equal(isInventedDemoEmail('demo+971501234567@digitalmanager.ae'), true)
    assert.equal(isValidCustomerReplyTo('demo+971501234567@digitalmanager.ae'), false)
    assert.equal(resolveReplyTo({ email: 'demo+971501234567@digitalmanager.ae' }), undefined)
    assert.equal(resolveReplyTo({ email: '' }), undefined)
  })
})

describe('sendLeadInquiryEmail', () => {
  const lead = {
    id: 'lead1',
    name: 'Aisha',
    email: 'aisha@example.com',
    phone: '+971501112233',
    topic: 'pricing',
    source: 'Contact Form',
    sourcePage: '/contact',
    message: 'Need ERP',
    createdAt: '2026-09-09T12:00:00.000Z',
  }

  it('sends to SMTP_TO_EMAIL with authenticated From and customer Reply-To', async () => {
    setUaeSmtpEnv()
    const smtp = resolveSmtpConfig()
    let mail
    let transportOpts
    const sendMail = async (payload) => {
      mail = payload
      return { messageId: '1' }
    }
    const createTransport = (opts) => {
      transportOpts = opts
      return { sendMail }
    }

    const result = await sendLeadInquiryEmail(lead, smtp, {
      nodemailer: { createTransport },
    })

    assert.equal(result.sent, true)
    assert.equal(transportOpts.host, 'mail.digitalmanager.ae')
    assert.equal(transportOpts.port, 587)
    assert.equal(transportOpts.secure, false)
    assert.equal(transportOpts.requireTLS, true)
    assert.equal(mail.to, 'sales@digitalsofts.com')
    assert.ok(String(mail.from).includes('info@digitalmanager.ae'))
    assert.ok(String(mail.from).includes('DigitalManager'))
    assert.equal(mail.replyTo, 'aisha@example.com')
    assert.equal(mail.subject, LEAD_EMAIL_SUBJECTS.contact)
    assert.ok(String(mail.subject).includes('DigitalManager UAE'))
    assert.ok(!String(mail.subject).includes('Aisha'))
  })

  it('ignores spoofed From/To on the lead object', async () => {
    setUaeSmtpEnv()
    let mail
    await sendLeadInquiryEmail(
      { ...lead, fromEmail: 'attacker@evil.com', to: 'attacker@evil.com' },
      resolveSmtpConfig(),
      {
        nodemailer: {
          createTransport: () => ({
            sendMail: async (payload) => {
              mail = payload
            },
          }),
        },
      },
    )
    assert.equal(mail.to, 'sales@digitalsofts.com')
    assert.ok(String(mail.from).includes('info@digitalmanager.ae'))
  })

  it('omits Reply-To when customer email is missing', async () => {
    setUaeSmtpEnv()
    let mail
    await sendLeadInquiryEmail(
      { ...lead, email: '', source: 'Get Demo Modal', topic: 'demo', name: 'Phone Only' },
      resolveSmtpConfig(),
      {
        nodemailer: {
          createTransport: () => ({
            sendMail: async (payload) => {
              mail = payload
            },
          }),
        },
      },
    )
    assert.equal(mail.replyTo, undefined)
    assert.equal(mail.subject, LEAD_EMAIL_SUBJECTS.demo)
  })

  it('returns delivery_failed without throwing when SMTP send fails', async () => {
    setUaeSmtpEnv()
    const result = await sendLeadInquiryEmail(lead, resolveSmtpConfig(), {
      nodemailer: {
        createTransport: () => ({
          sendMail: async () => {
            throw new Error('connection refused')
          },
        }),
      },
    })
    assert.equal(result.sent, false)
    assert.equal(result.reason, 'delivery_failed')
  })

  it('skips send when SMTP is incomplete', async () => {
    clearSmtpEnv()
    const result = await sendLeadInquiryEmail(lead, resolveSmtpConfig(), {
      nodemailer: { createTransport: () => ({ sendMail: async () => {} }) },
    })
    assert.equal(result.sent, false)
    assert.equal(result.reason, 'not_configured')
  })
})
