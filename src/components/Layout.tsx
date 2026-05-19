import { useState, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { FloatingWhatsApp } from './FloatingWhatsApp'
import { SearchModal } from './SearchModal'
import { ScrollToTop } from './ScrollToTop'
import { SeoHead } from './SeoHead'
import { useCms } from '../cms/CmsContext'
import { isSectionVisible, parsePageSections } from '../cms/pageSections'

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const { data } = useCms()
  const sections = useMemo(() => parsePageSections(data?.pageSections), [data?.pageSections])
  const showFooter = isSectionVisible(sections, 'footer')

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <SeoHead />
      <ScrollToTop />
      <Header
        onOpenSearch={() => {
          setSearchOpen(true)
        }}
      />
      <div key={location.pathname} className="animate-page-enter motion-reduce:animate-none">
        <Outlet />
      </div>
      {showFooter ? <Footer /> : null}
      <FloatingWhatsApp />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
