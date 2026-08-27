import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { IndustriesPage } from './pages/IndustriesPage'
import { ContactPage } from './pages/ContactPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { DevelopersPage } from './pages/DevelopersPage'
import { SoftwarePage } from './pages/SoftwarePage'
import { CmsPage } from './pages/CmsPage'
import { AdminLogin } from './admin/AdminLogin'
import { AdminLayout } from './admin/AdminLayout'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminSiteSettingsPage } from './admin/AdminSiteSettingsPage'
import { AdminWhatsAppPage } from './admin/AdminWhatsAppPage'
import { AdminEmailSettingsPage } from './admin/AdminEmailSettingsPage'
import { AdminLeads } from './admin/AdminLeads'
import { AdminDemoRequests } from './admin/AdminDemoRequests'
import { AdminMedia } from './admin/AdminMedia'
import { AdminSeo } from './admin/AdminSeo'
import { AdminProfile } from './admin/AdminProfile'
import { AdminChangePassword } from './admin/AdminChangePassword'
import { AdminBackup } from './admin/AdminBackup'
import { AdminActivity } from './admin/AdminActivity'
import { AdminHomePageEditor } from './admin/AdminHomePageEditor'
import { AdminHeaderEditor } from './admin/layout/AdminHeaderEditor'
import { AdminFooterEditor } from './admin/layout/AdminFooterEditor'
import { AdminPagesList } from './admin/AdminPagesList'
import { AdminPageForm } from './admin/AdminPageForm'
import { PageSectionsManager } from './admin/pages/PageSectionsManager'
import { AdminSoftwareDetailForm } from './admin/AdminSoftwareDetailForm'
import { AdminUsers } from './admin/AdminUsers'
import { AdminMegaMenusPage } from './admin/AdminMegaMenusPage'
import { TestimonialsPage } from './pages/TestimonialsPage'
import { BlogListingPage } from './pages/BlogListingPage'
import { BlogDetailPage } from './pages/BlogDetailPage'
import { AdminTestimonialsPage } from './admin/content/AdminTestimonialsPage'
import { AdminBlogPostsPage } from './admin/content/AdminBlogPostsPage'
import { AdminBlogPostEditor } from './admin/content/AdminBlogPostEditor'
import { AdminBlogCategoriesPage } from './admin/content/AdminBlogCategoriesPage'
import { AdminCountriesPage } from './admin/AdminCountriesPage'
import { AdminCountrySetupPage } from './admin/AdminCountrySetupPage'
import { AdminCitiesPage } from './admin/AdminCitiesPage'
import { LocaleGuard } from './routes/LocaleGuard'
import { ErpLocalePage, ContactLocalePage, SolutionsLocalePage, BusinessModelsLocalePage, FaqsLocalePage } from './pages/LocaleSlugPage'
import { LocaleSoftwarePage, LocaleIndustrySlugPage } from './pages/LocaleSoftwarePage'
import { LocaleFallbackPage } from './pages/LocaleFallbackPage'
import { CityPageGuard } from './routes/CityPageGuard'
import { AeEnCityRedirect } from './routes/CityPageGuard'

export default function App() {
  return (
    <Routes>
      <Route path="admin">
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="home" element={<Navigate to="/admin/pages/home" replace />} />

          <Route path="pages/home" element={<AdminHomePageEditor />} />
          <Route path="erp-modules" element={<AdminHomePageEditor />} />
          <Route path="industries" element={<AdminHomePageEditor />} />
          <Route path="pages-list" element={<AdminPagesList />} />
          <Route path="detail-pages" element={<Navigate to="/admin/pages-list" replace />} />
          <Route path="pages" element={<Navigate to="/admin/pages-list" replace />} />
          <Route path="pages/detail/new" element={<AdminSoftwareDetailForm mode="new" />} />
          <Route path="pages/detail/:kind/:slug/edit" element={<AdminSoftwareDetailForm mode="edit" />} />
          <Route path="pages/new" element={<AdminPageForm mode="new" />} />
          <Route path="pages/:id/sections" element={<PageSectionsManager />} />
          <Route path="pages/:id/edit" element={<AdminPageForm mode="edit" />} />

          <Route path="layout/header" element={<AdminHeaderEditor />} />
          <Route path="layout/footer" element={<AdminFooterEditor />} />
          <Route path="layout/navigation" element={<Navigate to="/admin/layout/header" replace />} />

          <Route path="content/testimonials" element={<AdminTestimonialsPage />} />
          <Route path="content/blog" element={<AdminBlogPostsPage />} />
          <Route path="content/blog/categories" element={<AdminBlogCategoriesPage />} />
          <Route path="content/blog/new" element={<AdminBlogPostEditor mode="new" />} />
          <Route path="content/blog/:id/edit" element={<AdminBlogPostEditor mode="edit" />} />
          <Route path="content/countries" element={<AdminCountriesPage />} />
          <Route path="content/countries/setup" element={<AdminCountrySetupPage />} />
          <Route path="content/cities" element={<AdminCitiesPage />} />

          <Route path="mega-menus" element={<AdminMegaMenusPage />} />
          <Route path="site-settings" element={<AdminSiteSettingsPage />} />
          <Route path="seo" element={<AdminSeo />} />
          <Route path="whatsapp" element={<AdminWhatsAppPage />} />
          <Route path="email-settings" element={<AdminEmailSettingsPage />} />
          <Route path="demo-requests" element={<AdminDemoRequests />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="backup" element={<AdminBackup />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="change-password" element={<AdminChangePassword />} />

          {/* Legacy URLs → new grouped routes */}
          <Route path="header" element={<Navigate to="/admin/layout/header" replace />} />
          <Route path="footer" element={<Navigate to="/admin/layout/footer" replace />} />
          <Route path="page-sections" element={<Navigate to="/admin/pages/home?panel=visibility" replace />} />
          <Route path="hero" element={<Navigate to="/admin/pages/home?panel=hero" replace />} />
          <Route path="stats" element={<Navigate to="/admin/pages/home?panel=stats" replace />} />
          <Route path="about" element={<Navigate to="/admin/pages/home?panel=about" replace />} />
          <Route path="valueChain" element={<Navigate to="/admin/pages/home?panel=features" replace />} />
          <Route path="modules" element={<Navigate to="/admin/erp-modules" replace />} />
          <Route path="workflow" element={<Navigate to="/admin/erp-modules?panel=workflow" replace />} />
          <Route path="industries" element={<Navigate to="/admin/industries" replace />} />
          <Route path="faqs" element={<Navigate to="/admin/pages/home?panel=faqs" replace />} />
          <Route path="cta" element={<Navigate to="/admin/pages/home?panel=cta" replace />} />
          <Route path="layout/top-bar" element={<Navigate to="/admin/layout/header" replace />} />
        </Route>
      </Route>
      <Route element={<Layout />}>
        {/* UAE English root — preserved exactly */}
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="developers" element={<DevelopersPage />} />
        <Route path="industries" element={<IndustriesPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="blog" element={<BlogListingPage />} />
        <Route path="blog/:slug" element={<BlogDetailPage />} />
        <Route path="erp" element={<ErpLocalePage />} />
        <Route path="solutions" element={<SolutionsLocalePage />} />
        <Route path="business-models" element={<BusinessModelsLocalePage />} />
        <Route path="faqs" element={<FaqsLocalePage />} />
        <Route path="software/:flatSlug" element={<SoftwarePage />} />
        <Route path="software/:kind/:slug" element={<SoftwarePage />} />
        <Route path=":citySlug/:pageSlug" element={<CityPageGuard />} />
        <Route path=":slug" element={<CmsPage />} />
      </Route>

      {/* GCC locale routes — /ae/ar, /sa/en, /qa/en/insights, etc. */}
      <Route path=":country/:lang" element={<LocaleGuard />}>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="developers" element={<DevelopersPage />} />
          <Route path="industries" element={<IndustriesPage />} />
          <Route path="industries/:slug" element={<LocaleIndustrySlugPage />} />
          <Route path="contact" element={<ContactLocalePage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="insights" element={<BlogListingPage />} />
          <Route path="insights/:slug" element={<BlogDetailPage />} />
          <Route path="erp" element={<ErpLocalePage />} />
          <Route path="solutions" element={<SolutionsLocalePage />} />
          <Route path="business-models" element={<BusinessModelsLocalePage />} />
          <Route path="faqs" element={<FaqsLocalePage />} />
          <Route path="software/:flatSlug" element={<LocaleSoftwarePage />} />
          <Route path="software/:kind/:slug" element={<LocaleSoftwarePage />} />
          <Route path=":citySlug/:pageSlug" element={<CityPageGuard />} />
          <Route path=":slug" element={<CmsPage />} />
          <Route path="*" element={<LocaleFallbackPage />} />
        </Route>
      </Route>

      <Route path="ae/en/:citySlug/:pageSlug" element={<AeEnCityRedirect />} />
    </Routes>
  )
}
