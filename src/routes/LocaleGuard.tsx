import { Navigate, Outlet, useParams } from 'react-router-dom'
import { validateLocaleParams } from '../locale/localePaths'
import { isDefaultLocale } from '../locale/localeConfig'

/** Validates /:country/:lang and redirects /ae/en → root */
export function LocaleGuard() {
  const { country = '', lang = '' } = useParams()
  const valid = validateLocaleParams(country, lang)
  if (!valid) return <Navigate to="/" replace />

  if (isDefaultLocale(valid.country, valid.lang)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
