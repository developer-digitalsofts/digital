import { apiBase, fetchWithTimeout, ApiError } from '../cms/api'

/** Hidden honeypot field name — must match server/index.mjs lead handler. */
export const LEAD_HONEYPOT_FIELD = 'company_website'

export type LeadSubmitStatus = 'idle' | 'submitting' | 'success' | 'error' | 'validation' | 'temporary'

export type LeadPayload = {
  name?: string
  email?: string
  phone?: string
  company?: string
  topic?: string
  message?: string
  source?: string
  sourcePage?: string
  productService?: string
  countryCode?: string
  localeCountry?: string
  localeLang?: string
  /** Honeypot — leave empty for real users */
  company_website?: string
}

export class LeadSubmitError extends Error {
  kind: 'validation' | 'temporary' | 'error'

  constructor(message: string, kind: 'validation' | 'temporary' | 'error') {
    super(message)
    this.name = 'LeadSubmitError'
    this.kind = kind
  }
}

export async function submitLead(payload: LeadPayload): Promise<{ id: string; emailSent?: boolean }> {
  try {
    const res = await fetchWithTimeout(`${apiBase()}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        company_website: payload.company_website ?? '',
      }),
    })

    if (res.status === 400 || res.status === 409) {
      let message = 'Please check your details and try again.'
      try {
        const data = (await res.json()) as { error?: string }
        if (data?.error?.trim()) message = data.error.trim()
      } catch {
        /* default */
      }
      throw new LeadSubmitError(message, 'validation')
    }

    if (res.status === 429 || res.status === 503) {
      let message = 'Temporary issue — please try again in a few minutes.'
      try {
        const data = (await res.json()) as { error?: string }
        if (data?.error?.trim()) message = data.error.trim()
      } catch {
        /* default */
      }
      throw new LeadSubmitError(message, 'temporary')
    }

    if (!res.ok) {
      let message = 'Could not submit your request. Please try again.'
      try {
        const data = (await res.json()) as { error?: string }
        if (data?.error?.trim()) message = data.error.trim()
      } catch {
        /* default */
      }
      throw new LeadSubmitError(message, res.status >= 500 ? 'temporary' : 'error')
    }

    const data = (await res.json()) as { ok?: boolean; id?: string; emailSent?: boolean }
    return { id: data.id || '', emailSent: data.emailSent }
  } catch (e) {
    if (e instanceof LeadSubmitError) throw e
    if (e instanceof ApiError) {
      throw new LeadSubmitError(
        e.isTimeout || e.isOffline
          ? 'Temporary connection issue — please try again shortly.'
          : e.message || 'Could not submit your request.',
        'temporary',
      )
    }
    throw new LeadSubmitError('Could not submit your request. Please try again.', 'error')
  }
}

export function statusFromLeadError(e: unknown): LeadSubmitStatus {
  if (e instanceof LeadSubmitError) {
    if (e.kind === 'validation') return 'validation'
    if (e.kind === 'temporary') return 'temporary'
  }
  return 'error'
}
