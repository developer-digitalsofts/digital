import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider'
import { CmsProvider } from './cms/CmsContext'
import { LocaleProvider } from './locale/LocaleContext'
import { AdminToastProvider } from './admin/AdminToastContext'

createRoot(document.getElementById('root')!).render(
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
