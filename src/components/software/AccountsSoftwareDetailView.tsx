import type { ComponentProps } from 'react'
import { PremiumSoftwareDetailView } from './PremiumSoftwareDetailView'

type AccountsProps = Omit<ComponentProps<typeof PremiumSoftwareDetailView>, 'slug'>

/** @deprecated Prefer PremiumSoftwareDetailView with explicit slug */
export function AccountsSoftwareDetailView(props: AccountsProps) {
  return <PremiumSoftwareDetailView {...props} slug="accounts-management-software" />
}
