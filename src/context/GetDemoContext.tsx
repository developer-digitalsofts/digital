import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { GetDemoModal } from '../components/GetDemoModal'

type GetDemoContextValue = {
  openDemo: () => void
  closeDemo: () => void
  demoOpen: boolean
}

const GetDemoContext = createContext<GetDemoContextValue | null>(null)

export function GetDemoProvider({ children }: { children: ReactNode }) {
  const [demoOpen, setDemoOpen] = useState(false)
  const openDemo = useCallback(() => setDemoOpen(true), [])
  const closeDemo = useCallback(() => setDemoOpen(false), [])
  const value = useMemo(() => ({ openDemo, closeDemo, demoOpen }), [openDemo, closeDemo, demoOpen])

  return (
    <GetDemoContext.Provider value={value}>
      {children}
      <GetDemoModal open={demoOpen} onClose={closeDemo} />
    </GetDemoContext.Provider>
  )
}

export function useGetDemo() {
  const ctx = useContext(GetDemoContext)
  if (!ctx) throw new Error('useGetDemo must be used within GetDemoProvider')
  return ctx
}

/** True when href should open the Get Demo modal instead of navigating. */
export function isGetDemoHref(href?: string) {
  const h = href?.trim().toLowerCase() ?? ''
  return h === '#get-demo' || h === 'get-demo' || h === '#demo' || h === 'demo'
}
