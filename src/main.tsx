import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider'
import { CmsProvider } from './cms/CmsContext'
import { LocaleProvider } from './locale/LocaleContext'
import { AdminToastProvider } from './admin/AdminToastContext'
import { parseLocalePath } from './locale/localePaths'
import { syncLocalePrefFromUrl } from './locale/localePref'

const initialLocale = parseLocalePath(window.location.pathname)
if (initialLocale.hasLocalePrefix) {
  syncLocalePrefFromUrl(initialLocale.country, initialLocale.lang)
}

function markAppReady() {
  document.documentElement.classList.add('dm-ready')
}

const rootEl = document.getElementById('root')!
const root = createRoot(rootEl)
root.render(
  <StrictMode>
    <BrowserRouter>
      <AdminToastProvider>
        <I18nProvider>
          <CmsProvider>
            <LocaleProvider>
              <App />
            </LocaleProvider>
          </CmsProvider>
        </I18nProvider>
      </AdminToastProvider>
    </BrowserRouter>
  </StrictMode>,
)

if (typeof requestAnimationFrame === 'function') {
  requestAnimationFrame(() => requestAnimationFrame(markAppReady))
} else {
  markAppReady()
}
