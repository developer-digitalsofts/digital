/** Locale-aware software/industry detail — renders the rich template with regional context from LocaleProvider. */
import { useParams } from 'react-router-dom'
import { SoftwarePage } from './SoftwarePage'

export function LocaleSoftwarePage() {
  return <SoftwarePage />
}

/** Industry detail alias: /:country/:lang/industries/:slug → industry software page */
export function LocaleIndustrySlugPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  return <SoftwarePage forceKind="industry" forceSlug={slug} />
}
