import type { SoftwareDetailPageData, SoftwareFaqItem } from './types'

/** POS: `posManagementPageContent.ts`. UAE VAT POS: `fbrPosIntegrationPageContent.ts`. SMS / Integration System: `smsIntegrationPageContent.ts`. */

type PatchFn = (displayName: string, kind: 'module' | 'industry') => Partial<SoftwareDetailPageData> | undefined

const EDU_FAQ: SoftwareFaqItem[] = [
  {
    q: 'Can fee plans include instalments and sibling discounts?',
    a: 'Instalment schedules, concessions, and sibling or staff policies can be modelled with automated reminders and receipt posting to the correct income dimensions.',
  },
  {
    q: 'How are examinations tied to finance?',
    a: 'Exam fees can post to AR with clearing when students register; optional integration patterns keep academic and finance offices aligned.',
  },
]

const patches: Record<string, PatchFn> = {
  'education-institute-management-software': (_, kind) =>
    kind === 'industry'
      ? {
          faqs: [...EDU_FAQ],
        }
      : undefined,
}

export function getSlugDetailPatch(
  slug: string,
  displayName: string,
  kind: 'module' | 'industry',
): Partial<SoftwareDetailPageData> | undefined {
  const fn = patches[slug]
  if (!fn) return undefined
  return fn(displayName, kind)
}
