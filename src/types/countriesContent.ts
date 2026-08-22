import type { Bilingual } from '../cms/types'
import type { GccCountryCode } from '../config/gccCountries'

export type CountryProfile = {
  code: GccCountryCode
  name: Bilingual
  shortName?: Bilingual
  enabled?: boolean
  isDefault?: boolean
  currency?: string
  phoneCode?: string
  primaryEmail?: string
  salesEmail?: string
  supportEmail?: string
  phoneDisplay?: string
  phoneHref?: string
  whatsappNumber?: string
  officeAddress?: Bilingual
  workingHours?: Bilingual
  sortOrder?: number
}

export type CountriesDoc = {
  schemaVersion?: number
  defaultCountryCode?: GccCountryCode
  items: CountryProfile[]
}

export type ResolvedCountryProfile = {
  code: GccCountryCode
  name: string
  shortName: string
  currency: string
  phoneCode: string
  primaryEmail: string
  salesEmail: string
  supportEmail: string
  phoneDisplay: string
  phoneHref: string
  whatsappNumber: string
  whatsappUrl: string
  officeAddress: string
  workingHours: string
  isDefault: boolean
}
