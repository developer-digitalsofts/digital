import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { WHATSAPP_URL } from '../constants'
import { WhatsAppIcon } from './WhatsAppIcon'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'

type WaSettings = {
  show?: boolean
  active?: boolean
  phoneDigits?: string
  defaultMessage?: { en: string; ar: string }
  position?: string
  buttonLabel?: { en: string; ar: string }
}

export function FloatingWhatsApp() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const w = data?.whatsappSettings as WaSettings | undefined
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const enabled = w ? w.show !== false && w.active !== false : true
  const digits = (w?.phoneDigits || '971581174911').replace(/\D/g, '')
  const preset = w?.defaultMessage ? pick(w.defaultMessage, lang) : ''
  const waUrl = `https://wa.me/${digits}${preset ? `?text=${encodeURIComponent(preset)}` : ''}`
  const fallbackUrl = WHATSAPP_URL
  const href = digits ? waUrl : fallbackUrl
  const posRight = (w?.position || 'bottom-right') !== 'bottom-left'
  const fabLabel = w?.buttonLabel && (pick(w.buttonLabel, lang) || '').trim()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  if (!enabled) return null

  return (
    <div
      ref={rootRef}
      className={`fixed bottom-6 z-[60] flex flex-col items-end gap-3 ${posRight ? 'right-6' : 'left-6 items-start'}`}
    >
      {open && (
        <div
          className="animate-fade-up w-[min(calc(100vw-3rem),20rem)] overflow-hidden rounded-lg border border-slate-200 bg-white motion-reduce:animate-none"
          role="dialog"
          aria-label={t('whatsapp.title')}
        >
          <div className="flex items-center justify-between gap-2 bg-[#25D366] px-3 py-2.5">
            <div className="flex items-center gap-2 text-white">
              <WhatsAppIcon className="size-5 shrink-0" />
              <span className="text-sm font-bold">{t('whatsapp.title')}</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20"
              aria-label={t('whatsapp.close')}
            >
              <X className="size-4" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
          <div className="bg-slate-50/80 px-3 py-4">
            <div className="rounded-lg rounded-tl-sm border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-700">
              {preset || t('whatsapp.greeting')}
            </div>
          </div>
          <div className="border-t border-emerald-100/80 bg-emerald-50/50 px-3 py-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#20bd5a]"
            >
              <WhatsAppIcon className="size-4" />
              {t('whatsapp.chatNow')}
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-14 items-center justify-center rounded-full border-2 border-emerald-600 bg-[#25D366] text-white transition-opacity hover:opacity-90 active:opacity-80"
        aria-expanded={open}
        aria-label={fabLabel || t('whatsapp.openLabel')}
        title={fabLabel || undefined}
      >
        <WhatsAppIcon className="size-7" />
        <span className="absolute -right-0.5 -top-0.5 flex size-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold leading-none text-white ring-2 ring-white">
          1
        </span>
      </button>
    </div>
  )
}
