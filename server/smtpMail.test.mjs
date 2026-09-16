/**
 * Pakistan SMTP config / STARTTLS unit tests.
 * Run: npm run test:mail
 */
import { afterEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildNodemailerTransportOptions, resolveSmtpConfig } from './envConfig.mjs'

const SMTP_ENV_KEYS = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_PASSWORD',
  'SMTP_FROM_EMAIL',
  'SMTP_FROM_NAME',
  'CONTACT_RECEIVER_EMAIL',
  'SMTP_TO_EMAIL',
]

function clearSmtpEnv() {
  for (const k of SMTP_ENV_KEYS) delete process.env[k]
}

function setPkSmtpEnv(overrides = {}) {
  clearSmtpEnv()
  Object.assign(process.env, {
    SMTP_HOST: 'mail.digitalmanager.ae',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: 'noreply@digitalmanager.ae',
    SMTP_PASS: 'test-password-not-real',
    SMTP_FROM_EMAIL: 'noreply@digitalmanager.ae',
    SMTP_FROM_NAME: 'DigitalManager Pakistan',
    CONTACT_RECEIVER_EMAIL: 'sales@digitalsofts.com',
    ...overrides,
  })
}

afterEach(() => {
  clearSmtpEnv()
})

describe('resolveSmtpConfig (Pakistan)', () => {
  it('requires SMTP_PASS and CONTACT_RECEIVER_EMAIL', () => {
    setPkSmtpEnv({ SMTP_PASS: '', CONTACT_RECEIVER_EMAIL: '' })
    const cfg = resolveSmtpConfig()
    assert.equal(cfg.ok, false)
    assert.ok(cfg.missing.includes('SMTP_PASS'))
    assert.ok(cfg.missing.includes('CONTACT_RECEIVER_EMAIL'))
  })

  it('accepts SMTP_PASSWORD as fallback while preferring SMTP_PASS', () => {
    setPkSmtpEnv({ SMTP_PASS: '', SMTP_PASSWORD: 'legacy-fallback-not-real' })
    const cfg = resolveSmtpConfig()
    assert.equal(cfg.ok, true)
    assert.equal(cfg.pass, 'legacy-fallback-not-real')
  })

  it('uses Pakistan From/To defaults from env', () => {
    setPkSmtpEnv()
    const cfg = resolveSmtpConfig()
    assert.equal(cfg.ok, true)
    assert.equal(cfg.host, 'mail.digitalmanager.ae')
    assert.equal(cfg.port, 587)
    assert.equal(cfg.secure, false)
    assert.equal(cfg.user, 'noreply@digitalmanager.ae')
    assert.equal(cfg.fromEmail, 'noreply@digitalmanager.ae')
    assert.equal(cfg.fromName, 'DigitalManager Pakistan')
    assert.equal(cfg.receiverEmail, 'sales@digitalsofts.com')
  })
})

describe('STARTTLS transport options', () => {
  it('sets requireTLS true for port 587 with secure false', () => {
    setPkSmtpEnv()
    const opts = buildNodemailerTransportOptions(resolveSmtpConfig())
    assert.equal(opts.port, 587)
    assert.equal(opts.secure, false)
    assert.equal(opts.requireTLS, true)
    assert.equal(opts.host, 'mail.digitalmanager.ae')
  })

  it('does not force requireTLS when secure true (implicit TLS / 465)', () => {
    setPkSmtpEnv({ SMTP_PORT: '465', SMTP_SECURE: 'true' })
    const opts = buildNodemailerTransportOptions(resolveSmtpConfig())
    assert.equal(opts.port, 465)
    assert.equal(opts.secure, true)
    assert.equal(opts.requireTLS, false)
  })
})
