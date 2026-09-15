const isProd = process.env.NODE_ENV === 'production'

/** AUTH_SECRET (preferred) or JWT_SECRET — used for admin JWT signing. */
export function resolveAuthSecret() {
  const secret = (process.env.AUTH_SECRET || process.env.JWT_SECRET || '').trim()
  return secret || null
}

export function authSecretOrDevFallback() {
  return resolveAuthSecret() || 'dev-only-change-me-in-production'
}

export function isAuthSecretConfigured() {
  return Boolean(resolveAuthSecret())
}

export function isProduction() {
  return isProd
}

export function resolveDatabaseUrl() {
  return (process.env.DATABASE_URL || '').trim() || null
}

/**
 * SMTP config for UAE inquiry emails.
 * Port 587 uses STARTTLS (secure: false + requireTLS). SMTP_SECURE=true is for implicit TLS (465).
 * Password: SMTP_PASSWORD (preferred). Legacy SMTP_PASS still accepted.
 * Recipient: SMTP_TO_EMAIL (preferred). Legacy CONTACT_RECEIVER_EMAIL still accepted as fallback.
 */
export function resolveSmtpConfig() {
  const host = (process.env.SMTP_HOST || '').trim()
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true'
  const user = (process.env.SMTP_USER || '').trim()
  const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '').trim()
  const fromEmail = (process.env.SMTP_FROM_EMAIL || '').trim()
  const fromName = (process.env.SMTP_FROM_NAME || 'DigitalManager').trim() || 'DigitalManager'
  const toEmail = (process.env.SMTP_TO_EMAIL || process.env.CONTACT_RECEIVER_EMAIL || '').trim()

  const missing = []
  if (!host) missing.push('SMTP_HOST')
  if (!user) missing.push('SMTP_USER')
  if (!pass) missing.push('SMTP_PASSWORD')
  if (!fromEmail) missing.push('SMTP_FROM_EMAIL')
  if (!toEmail) missing.push('SMTP_TO_EMAIL')

  return {
    ok: missing.length === 0,
    missing,
    host,
    port: Number.isFinite(port) && port > 0 ? port : 587,
    secure,
    user,
    pass,
    fromEmail,
    fromName,
    toEmail,
    /** @deprecated use toEmail — kept for older admin checks */
    receiverEmail: toEmail,
  }
}

export function allowAdminBootstrap() {
  const raw = (process.env.ALLOW_ADMIN_BOOTSTRAP ?? 'true').toString().toLowerCase()
  return raw !== 'false' && raw !== '0' && raw !== 'no'
}

export function envConfigSummary() {
  return {
    authSecret: isAuthSecretConfigured(),
    databaseUrl: Boolean(resolveDatabaseUrl()),
    smtp: resolveSmtpConfig().ok,
    allowAdminBootstrap: allowAdminBootstrap(),
    apiPort: Number(process.env.PORT) || 3040,
  }
}
