import type { LucideIcon } from 'lucide-react'
import {
  ArrowRightLeft,
  Banknote,
  BarChart3,
  Briefcase,
  Building2,
  Cpu,
  Factory,
  FileText,
  Fuel,
  Landmark,
  Layers,
  Package,
  ShoppingBag,
  Store,
  TabletSmartphone,
  Truck,
  Users,
  Wheat,
} from 'lucide-react'
import { moduleMegaItems } from './megaMenu'

const MODULE_CATEGORY_ICONS: Record<string, LucideIcon> = {
  financeCompliance: Landmark,
  operations: Package,
  salesWorkforce: Users,
}

const INDUSTRY_CATEGORY_ICONS: Record<string, LucideIcon> = {
  retailCommerce: Store,
  manufacturing: Factory,
  specialized: Fuel,
}

const ITEM_ICON_FALLBACKS: Record<string, LucideIcon> = {
  accountsFinance: Landmark,
  vatCompliance: FileText,
  reportsAnalytics: BarChart3,
  inventoryManagement: Package,
  productionManagement: Factory,
  purchaseManagement: ArrowRightLeft,
  pointOfSale: TabletSmartphone,
  crmSoftware: Users,
  payrollManagement: Banknote,
  retailPos: Store,
  supermarket: ShoppingBag,
  pharmacy: Briefcase,
  manufacturingErp: Factory,
  textileGarments: Layers,
  warehouse: Truck,
  petrolStation: Fuel,
  lpg: Fuel,
  poultryAgri: Wheat,
  integrationSystem: Cpu,
  realEstate: Building2,
}

const slugIconMap = new Map<string, LucideIcon>(
  moduleMegaItems.map((item) => [item.slug, item.icon]),
)

function slugFromHref(href: string): string {
  const match = href.match(/\/software\/([^/?#]+)/i)
  return match?.[1]?.trim() ?? ''
}

export function megaMenuCategoryIcon(
  kind: 'modules' | 'industries',
  categoryId: string,
): LucideIcon {
  const map = kind === 'modules' ? MODULE_CATEGORY_ICONS : INDUSTRY_CATEGORY_ICONS
  return map[categoryId] ?? Layers
}

export function megaMenuItemIcon(itemId: string, href: string): LucideIcon {
  if (ITEM_ICON_FALLBACKS[itemId]) return ITEM_ICON_FALLBACKS[itemId]
  const slug = slugFromHref(href)
  return slugIconMap.get(slug) ?? Layers
}
