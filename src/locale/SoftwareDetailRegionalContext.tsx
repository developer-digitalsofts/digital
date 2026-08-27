import { createContext, useContext, type ReactNode } from 'react'
import type { DashboardRegionalPack } from '../components/hero/dashboards/dashboardRegionalData'

const SoftwareDetailRegionalContext = createContext<DashboardRegionalPack | null>(null)

export function SoftwareDetailRegionalProvider({
  value,
  children,
}: {
  value: DashboardRegionalPack | null
  children: ReactNode
}) {
  return (
    <SoftwareDetailRegionalContext.Provider value={value}>{children}</SoftwareDetailRegionalContext.Provider>
  )
}

export function useSoftwareDetailRegional(): DashboardRegionalPack | null {
  return useContext(SoftwareDetailRegionalContext)
}
