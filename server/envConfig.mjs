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
 * SMTP config for Pakistan inquiry emails.
 * Port 587 uses STARTTLS (secure: false + requireTLS). SMTP_SECURE=true is for implicit TLS (465).
 * Password: SMTP_PASS (Pakistan branch primary). SMTP_PASSWORD accepted as fallback.
 */
export function resolveSmtpConfig() {
  const host = (process.env.SMTP_HOST || '').trim()
  const portRaw = Number(process.env.SMTP_PORT || 587)
  const port = Number.isFinite(portRaw) && portRaw > 0 ? portRaw : 587
  const secure = process.env.SMTP_SECURE === 'true'
  const user = (process.env.SMTP_USER || '').trim()
  const pass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '').trim()
  const fromEmail = (process.env.SMTP_FROM_EMAIL || '').trim()
  const fromName = (process.env.SMTP_FROM_NAME || 'DigitalManager Pakistan').trim() || 'DigitalManager Pakistan'
  const receiverEmail = (process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_TO_EMAIL || '').trim()

  const missing = []
  if (!host) missing.push('SMTP_HOST')
  if (!user) missing.push('SMTP_USER')
  if (!pass) missing.push('SMTP_PASS')
  if (!fromEmail) missing.push('SMTP_FROM_EMAIL')
  if (!receiverEmail) missing.push('CONTACT_RECEIVER_EMAIL')

  return {
    ok: missing.length === 0,
    missing,
    host,
    port,
    secure,
    user,
    pass,
    fromEmail,
    fromName,
    receiverEmail,
    toEmail: receiverEmail,
  }
}

/** Nodemailer transport options — STARTTLS on port 587. */
export function buildNodemailerTransportOptions(smtp) {
  const port = Number(smtp?.port) || 587
  const secure = smtp?.secure === true
  return {
    host: smtp?.host,
    port,
    secure,
    requireTLS: port === 587 && !secure,
    auth: { user: smtp?.user, pass: smtp?.pass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
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
