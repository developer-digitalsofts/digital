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

export function resolveSmtpConfig() {
  const host = (process.env.SMTP_HOST || '').trim()
  if (!host) return { ok: false, missing: ['SMTP_HOST'], transport: null }

  const port = Number(process.env.SMTP_PORT || 587)
  const secure = process.env.SMTP_SECURE === 'true'
  const user = (process.env.SMTP_USER || '').trim()
  const pass = (process.env.SMTP_PASS || '').trim()

  const missing = []
  if (!user) missing.push('SMTP_USER')
  if (!pass) missing.push('SMTP_PASS')

  return {
    ok: missing.length === 0,
    missing,
    host,
    port,
    secure,
    user,
    pass,
    fromEmail: (process.env.SMTP_FROM_EMAIL || user || '').trim(),
    receiverEmail: (process.env.CONTACT_RECEIVER_EMAIL || '').trim(),
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
