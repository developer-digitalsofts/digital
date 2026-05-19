import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { HomepagePayload } from './types'

type CmsState = {
  data: HomepagePayload | null
  loading: boolean
  error: string | null
  reload: () => void
}

const CmsContext = createContext<CmsState | null>(null)

/** Public site uses built-in i18n/static content; no remote CMS fetch. */
const STATIC_CMS: CmsState = {
  data: null,
  loading: false,
  error: null,
  reload: () => {},
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => STATIC_CMS, [])
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
