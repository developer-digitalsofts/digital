import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { WHATSAPP_URL } from '../constants'
import { WhatsAppIcon } from './WhatsAppIcon'
import { apiBase, fetchWithTimeout } from '../cms/api'
import { btnPrimary, btnSecondary } from '../ui/saas'

type Props = {
  open: boolean
  onClose: () => void
}

const fieldClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15'

export function GetDemoModal({ open, onClose }: Props) {
  const titleId = useId()
  const descId = useId()
  const location = useLocation()
  const panelRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const resetForm = useCallback(() => {
    setName('')
    setPhone('')
    setBusinessType('')
    setStatus('idle')
    setErrorMsg(null)
  }, [])

  const handleClose = useCallback(() => {
    onClose()
    resetForm()
  }, [onClose, resetForm])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, handleClose])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLInputElement>('input[name="demo-name"]')?.focus()
    }, 50)
    return () => window.clearTimeout(t)
  }, [open])

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!name.trim() || phone.trim().length < 6 || !businessType.trim()) {
        setErrorMsg('Please fill in all fields with a valid phone number.')
        setStatus('error')
        return
      }
      setStatus('submitting')
      setErrorMsg(null)
      try {
        const digits = phone.replace(/\D/g, '')
        const res = await fetchWithTimeout(`${apiBase()}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            company: businessType.trim(),
            topic: 'demo',
            source: 'Get Demo Modal',
            message: `Header demo request — business type: ${businessType.trim()}`,
            email: `demo+${digits || Date.now()}@digitalmanager.ae`,
            sourcePage: `header-get-demo:${location.pathname}${location.search}`.slice(0, 500),
          }),
        })
        if (!res.ok) {
          let message = 'Could not submit your request. Please try again in a moment.'
          try {
            const data = (await res.json()) as { error?: string }
            if (data?.error?.trim()) message = data.error.trim()
          } catch {
            /* use default */
          }
          setErrorMsg(message)
          setStatus('error')
          return
        }
        setStatus('success')
      } catch {
        setErrorMsg('Network error — please check your connection and try again.')
        setStatus('error')
      }
    },
    [name, phone, businessType, location.pathname, location.search],
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px] motion-reduce:backdrop-blur-none"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/90 bg-white"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute end-3 top-3 z-10 rounded-lg p-1.5 text-brand transition-colors hover:bg-orange-50 hover:text-brand-dark"
          aria-label="Close"
          onClick={handleClose}
        >
          <X className="size-5" strokeWidth={2} aria-hidden />
        </button>

        <div className="px-6 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8">
          <h2 id={titleId} className="font-heading pe-8 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Get a Free Demo
          </h2>
          <p id={descId} className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
            Talk to our team and see how DigitalManager can help automate your business.
          </p>

          {status === 'success' ? (
            <div className="mt-6 rounded-xl border border-emerald-200/90 bg-emerald-50/80 px-4 py-4 text-sm text-emerald-900">
              <p className="font-semibold">Thank you — we received your request.</p>
              <p className="mt-1 text-emerald-800/90">Our team will contact you shortly.</p>
              <button type="button" className={`mt-4 w-full ${btnPrimary}`} onClick={handleClose}>
                Close
              </button>
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
              <div>
                <label htmlFor="demo-name" className="text-sm font-semibold text-slate-800">
                  Name
                </label>
                <input
                  id="demo-name"
                  name="demo-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClass}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="demo-phone" className="text-sm font-semibold text-slate-800">
                  Phone Number
                </label>
                <input
                  id="demo-phone"
                  name="demo-phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={fieldClass}
                  placeholder="+971 …"
                />
              </div>
              <div>
                <label htmlFor="demo-business" className="text-sm font-semibold text-slate-800">
                  Business Type
                </label>
                <input
                  id="demo-business"
                  name="demo-business"
                  type="text"
                  required
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className={fieldClass}
                  placeholder="e.g. Retail, Manufacturing, Pharmacy"
                />
              </div>

              {status === 'error' && errorMsg ? (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {errorMsg}
                </p>
              ) : null}

              <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`w-full sm:min-w-[10rem] sm:flex-1 ${btnPrimary} disabled:opacity-60`}
                >
                  {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
                </button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex w-full min-h-[44px] items-center justify-center gap-2 sm:min-w-[10rem] sm:flex-1 ${btnSecondary} border-[#25D366]/35 text-[#128C7E] hover:border-[#25D366] hover:bg-emerald-50/70`}
                >
                  <WhatsAppIcon className="size-5 shrink-0" />
                  Chat on WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
