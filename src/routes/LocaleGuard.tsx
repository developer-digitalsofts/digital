import { Navigate, Outlet, useParams } from 'react-router-dom'
import { validateLocaleParams } from '../locale/localePaths'

/** Validates /:country/:lang — including /ae/en as a first-class UAE English route. */
export function LocaleGuard() {
  const { country = '', lang = '' } = useParams()
  const valid = validateLocaleParams(country, lang)
  if (!valid) return <Navigate to="/" replace />

  return <Outlet />
}
