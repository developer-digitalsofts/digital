import { useCms } from '../cms/CmsContext'
import { useLocale } from '../locale/LocaleContext'

export function LocaleFallbackBanner() {
  const { localeMeta } = useCms()
  const { isDefaultLocaleRoute } = useLocale()

  if (isDefaultLocaleRoute || !localeMeta?.fallbackUsed) return null
  if (!import.meta.env.DEV && !import.meta.env.VITE_SHOW_LOCALE_FALLBACK) return null

  return (
    <div
      className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-950"
      role="status"
    >
      Showing Pakistan baseline content for this locale preview.
    </div>
  )
}
