import type { TranslationStatus } from '../locale/localeConfig'

export type LocaleInheritanceSource = 'locale_override' | 'country_default' | 'global' | 'missing'

export type LocaleContentRecord = {
  id: string
  contentType: string
  globalIdentity: string
  slug: string
  countryCode: string
  languageCode: 'en' | 'ar'
  translationGroupId: string
  sourceRecordId: string | null
  inheritanceMode: 'global' | 'inherit' | 'override'
  translationStatus: TranslationStatus
  publicationStatus: 'draft' | 'published' | 'unpublished' | 'archived'
  enabled: boolean
  publishedAt: string | null
  updatedAt: string
  sortOrder?: number
  seo?: Record<string, unknown> | null
  payload?: Record<string, unknown>
  baselineRef?: string
}

export type LocaleResolutionMeta = {
  resolvedFrom: LocaleInheritanceSource | 'missing'
  inherited: boolean
  customized: boolean
  sourceCountry: string
  sourceLanguage: string
  translationStatus: TranslationStatus
  publicationStatus: string
  fallbackUsed?: boolean
  missing?: boolean
}

export type LocalizedFieldMeta = {
  translationStatus: TranslationStatus
  inheritanceSource: LocaleInheritanceSource
  inherited: boolean
  customized: boolean
}

export type LocaleScopedDocument = {
  countryCode?: string
  languages?: Array<'en' | 'ar'>
  locales?: Record<string, unknown>
  translationStatus?: TranslationStatus
  status?: 'draft' | 'published'
}

export type CountrySetupMode = 'structure_only' | 'structure_shared_draft' | 'blank'

export type CountrySetupRequest = {
  countryCode: string
  languages: Array<'en' | 'ar'>
  mode: CountrySetupMode
}

export type CountrySetupReport = {
  country: string
  languages: string[]
  mode: CountrySetupMode
  countryCreated: boolean
  pagesPrepared: number
  sectionsPrepared: number
  sharedRecordsLinked: number
  draftRecordsCreated: number
  missingTranslations: string[]
  errors: string[]
  rolledBack: boolean
}

export const LOCALE_STATUS_LABELS: Record<string, string> = {
  inherited: 'Inherited',
  customized: 'Customized',
  missing: 'Missing translation',
  draft: 'Draft',
  needs_review: 'Needs Review',
  approved: 'Approved',
  published: 'Published',
  archived: 'Archived',
}
