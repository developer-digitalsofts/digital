import {
  Landmark,
  Box,
  MonitorSmartphone,
  Factory,
  Users,
  FileCheck,
  type LucideIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { CmsLink } from '../CmsLink'
import { useCms } from '../../cms/CmsContext'
import { resolveErpModulesHeader } from '../../cms/resolveHomepageCms'
import { useI18n } from '../../i18n/I18nProvider'
import { softwarePath } from '../../utils/slug'
import { ScrollReveal } from '../ScrollReveal'
import { sectionWhite } from '../../ui/saas'
import {
  AccountsFinancePreview,
  InventoryPreview,
  PosPreview,
  ProductionPreview,
  PayrollPreview,
  InvoicingPreview,
} from './ErpFunctionPreviews'
import './erp-modules.css'

type ModuleTile = {
  key: string
  titleKey: string
  descKey: string
  href: string
  icon: LucideIcon
  size: 'tall' | 'short'
  Preview: ComponentType
}

const modules: ModuleTile[] = [
  {
    key: 'accounts',
    titleKey: 'featured',
    descKey: 'featured',
    href: softwarePath('module', 'accounts-management-software'),
    icon: Landmark,
    size: 'tall',
    Preview: AccountsFinancePreview,
  },
  {
    key: 'inventory',
    titleKey: 'inventory',
    descKey: 'inventory',
    href: softwarePath('module', 'inventory-management-software'),
    icon: Box,
    size: 'tall',
    Preview: InventoryPreview,
  },
  {
    key: 'pos',
    titleKey: 'pos',
    descKey: 'pos',
    href: softwarePath('module', 'point-of-sale-management-software'),
    icon: MonitorSmartphone,
    size: 'tall',
    Preview: PosPreview,
  },
  {
    key: 'production',
    titleKey: 'production',
    descKey: 'production',
    href: softwarePath('module', 'production-management-software'),
    icon: Factory,
    size: 'short',
    Preview: ProductionPreview,
  },
  {
    key: 'payroll',
    titleKey: 'payroll',
    descKey: 'payroll',
    href: softwarePath('module', 'payroll-management-software'),
    icon: Users,
    size: 'short',
    Preview: PayrollPreview,
  },
  {
    key: 'invoicing',
    titleKey: 'invoicing',
    descKey: 'invoicing',
    href: softwarePath('module', 'fbr-pos-integration-software'),
    icon: FileCheck,
    size: 'short',
    Preview: InvoicingPreview,
  },
]

export function ErpModulesSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const header = resolveErpModulesHeader(data ?? undefined, t, lang)

  const titleFor = (titleKey: string) =>
    titleKey === 'featured' ? t('erpModules.featured.title') : t(`erpModules.cards.${titleKey}.title`)

  const descFor = (descKey: string) =>
    descKey === 'featured' ? t('erpModules.featured.desc') : t(`erpModules.cards.${descKey}.desc`)

  return (
    <section id="erp-modules" className={`erp-function-grid scroll-mt-28 ${sectionWhite} home-section home-section--erp-modules`}>
      <div className="industries-section__container">
        <ScrollReveal>
          <header className="erp-function-grid__header">
            <p className="erp-function-grid__eyebrow">{header.eyebrow}</p>
            <h2 className="erp-function-grid__title">{header.title}</h2>
          </header>
        </ScrollReveal>

        <div className="erp-function-grid__cards">
          {modules.map((mod, i) => {
            const Icon = mod.icon
            const Preview = mod.Preview
            return (
              <ScrollReveal key={mod.key} delayMs={i * 45} className="erp-function-grid__cell">
                <CmsLink
                  to={mod.href}
                  className={`erp-function-grid__card erp-function-grid__card--${mod.size}`}
                >
                  <div className="erp-function-grid__card-head">
                    <span className="erp-function-grid__icon-box" aria-hidden>
                      <Icon className="erp-function-grid__icon" strokeWidth={1.85} />
                    </span>
                    <div className="erp-function-grid__card-copy">
                      <h3 className="erp-function-grid__card-title">{titleFor(mod.titleKey)}</h3>
                      <p className="erp-function-grid__card-desc">{descFor(mod.descKey)}</p>
                    </div>
                  </div>
                  <Preview />
                </CmsLink>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
