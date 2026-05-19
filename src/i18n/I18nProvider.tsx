import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from './messages'
import { messages } from './messages'

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
  t: (path: string) => string
}

const I18nContext = createContext<Ctx | null>(null)

function getByPath(obj: unknown, path: string): string {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = (cur as Record<string, unknown>)[p]
    else return path
  }
  return typeof cur === 'string' ? cur : path
}

const STORAGE_KEY = 'dm-lang'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en'
    const s = localStorage.getItem(STORAGE_KEY) as Lang | null
    return s === 'ar' ? 'ar' : 'en'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }, [])

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === 'en' ? 'ar' : 'en'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  useLayoutEffect(() => {
    const m = messages[lang]
    document.documentElement.lang = lang
    document.documentElement.dir = m.dir
  }, [lang])

  const t = useCallback(
    (path: string) => getByPath(messages[lang] as unknown as Record<string, unknown>, path),
    [lang],
  )

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

/** Translate mega column title by matching English title (fallback: original). */
export function translateColumnTitle(lang: Lang, enTitle: string): string {
  if (lang === 'en') return enTitle
  const map: Record<string, string> = {
    'Finance & operations': messages.ar.mega.moduleCol1,
    'Retail & point of sale': messages.ar.mega.moduleCol2,
    'People & integration': messages.ar.mega.moduleCol3,
    'Retail industry': 'قطاع التجزئة',
    'Oil & gas': 'النفط والغاز',
    'Manufacturing & textile': 'التصنيع والنسيج',
    'Hospitality & medical': 'الضيافة والطب',
    'SMB & services': 'الشركات الصغيرة والخدمات',
    'Logistics & real estate': 'اللوجستيات والعقارات',
    'Poultry & agriculture': 'الدواجن والزراعة',
    'Electronics & construction': 'الإلكترونيات والإنشاءات',
  }
  return map[enTitle] ?? enTitle
}
