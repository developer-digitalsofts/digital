import { AdminLocaleEditorBanner } from './AdminLocaleEditorBanner'

/** @deprecated Use AdminLocaleEditorBanner */
export function AdminLocaleItemStatus(props: {
  contentType: string
  globalIdentity: string
  slug?: string
}) {
  return <AdminLocaleEditorBanner {...props} compact />
}
