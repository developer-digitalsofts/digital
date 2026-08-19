import { useNavigate } from 'react-router-dom'
import { SectionLibraryModal } from '../pages/SectionLibraryModal'
import { adminHomeEditorTabUrl, type AdminHomeEditorTabId } from './adminHomeEditorTabs'
import type { SectionType } from '../../cms/sectionCatalog'
import { useAdminToast } from '../AdminToastContext'

const HOME_SECTION_TAB: Partial<Record<SectionType, string>> = {
  hero: 'hero',
  stats: 'stats',
  imageText: 'about',
  featureCards: 'features',
  featureStrip: 'features',
  comparison: 'features',
  modules: 'modules',
  industries: 'about',
  faqs: 'faqs',
  cta: 'demoCta',
  richText: 'about',
}

type Props = {
  open: boolean
  onClose: () => void
}

export function HomeSectionLibraryModal({ open, onClose }: Props) {
  const navigate = useNavigate()
  const toast = useAdminToast()

  const onSelect = (type: SectionType) => {
    const tab = HOME_SECTION_TAB[type]
    onClose()
    if (!tab) {
      toast.push('This section type is not available on the homepage.', 'info')
      return
    }
    navigate(adminHomeEditorTabUrl('homepage', tab as AdminHomeEditorTabId))
    toast.push('Opened the matching homepage section editor.', 'success')
  }

  return <SectionLibraryModal open={open} onClose={onClose} onSelect={onSelect} />
}
