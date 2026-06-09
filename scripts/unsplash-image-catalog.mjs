/**
 * Curated Unsplash photo IDs — landscape, ≥1600px via download URL.
 * Pools are built from scripts/verified-unsplash-ids.json (HEAD-verified).
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const verifiedData = JSON.parse(
  readFileSync(join(root, 'scripts', 'verified-unsplash-ids.json'), 'utf8'),
)

export const U = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=85`

const Q = verifiedData.byQuery

/** SaaS / ERP dashboard & analytics (reports, dashboard, ledger slots) */
export const SAAS = Q['erp dashboard analytics laptop'] ?? []

const POOL_QUERIES = {
  energy: ['fuel station gas pump'],
  textile: ['textile factory fabric'],
  factory: ['manufacturing factory production'],
  retail: ['supermarket retail checkout', 'pos terminal payment'],
  medical: ['hospital pharmacy healthcare'],
  hospitality: ['hotel restaurant hospitality'],
  logistics: ['warehouse logistics truck'],
  agrifood: ['agriculture farm crop'],
  poultry: ['poultry farm chicken'],
  construction: ['construction site building'],
  property: ['real estate commercial building'],
  electronics: ['electronics store laptop'],
  visa: ['visa travel passport business'],
  smb: ['erp dashboard analytics laptop', 'pos terminal payment'],
  warehouse: ['inventory warehouse shelves', 'warehouse logistics truck'],
  accounts: ['erp dashboard analytics laptop'],
  office: ['erp dashboard analytics laptop', 'pos terminal payment'],
  pos: ['pos terminal payment', 'supermarket retail checkout'],
}

function buildPool(queryKeys) {
  const keys = Array.isArray(queryKeys) ? queryKeys : [queryKeys]
  const ids = [...new Set(keys.flatMap((k) => Q[k] ?? []))]
  return { heroes: ids, ops: ids }
}

export const POOLS = Object.fromEntries(
  Object.entries(POOL_QUERIES).map(([name, query]) => [name, buildPool(query)]),
)

export const ALL_VERIFIED = verifiedData.verified

export const SLUG_POOL = {
  'accounts-management-software': 'accounts',
  'production-management-software': 'factory',
  'point-of-sale-management-software': 'pos',
  'fbr-pos-integration-software': 'pos',
  'inventory-management-software': 'warehouse',
  'payroll-management-software': 'office',
  'integration-system': 'office',
  'crm-software': 'office',
  'petrol-pump-software': 'energy',
  'petrol-gas-filling-station-software': 'energy',
  'lpg-business-software': 'energy',
  'lpg-transport-management-software': 'logistics',
  'lpg-bowser-supply-chain-software': 'energy',
  'fleet-fuel-management-software': 'energy',
  'petrol-depot-management-software': 'energy',
  'fuel-tank-lorry-management-software': 'logistics',
  'cloud-erp-software-for-textile-industries': 'textile',
  'knitting-dyeing-industry-software': 'textile',
  'fabric-store-management-software': 'textile',
  'garments-manufacturing-software': 'factory',
  'candy-and-confectionery-manufacturing-software': 'factory',
  'retail-management-software': 'retail',
  'luggage-bags-store-software': 'retail',
  'toy-shop-management-software': 'retail',
  'crockery-store-management-software': 'retail',
  'grocery-store-management-software': 'retail',
  'cloud-erp-software-for-services-business': 'smb',
  'small-and-medium-business-erp-software': 'smb',
  'installment-management-software': 'property',
  'pharmacy-business-management-software': 'medical',
  'homeopathic-business-management-software': 'medical',
  'hotel-management-software': 'hospitality',
  'tuc-shop-management-software': 'hospitality',
  'logistics-transportation-software': 'logistics',
  'motor-market-management-software': 'retail',
  'auto-parts-business-software': 'logistics',
  'poultry-control-shed-management-software': 'poultry',
  'poultry-chicken-supply-management-software': 'poultry',
  'poultry-waste-management-software': 'poultry',
  'poultry-arhat-software': 'poultry',
  'cloud-erp-software-for-agriculture-business': 'agrifood',
  'dairy-farm-management-software': 'agrifood',
  'marble-and-granite-factory-software': 'construction',
  'plastic-pipes-fitting-industry-software': 'construction',
  'ceiling-and-wall-paneling-store-software': 'construction',
  'tiles-and-ceramics-store-software': 'construction',
  'hardware-sanitary-store-software': 'construction',
  'erp-software-for-real-estate-business': 'property',
  'erp-software-for-construction-business': 'construction',
  'software-for-visa-immigration-consultants': 'visa',
  'computers-laptop-business-software': 'electronics',
  'electronics-management-software': 'electronics',
  'electric-store-management-software': 'electronics',
  'mobile-accessories-business-software': 'electronics',
  'ev-charging-station-management-software': 'electronics',
}

export const SLUG_LABELS = {
  'accounts-management-software': 'Accounts Management Software',
  'production-management-software': 'Production Management Software',
  'point-of-sale-management-software': 'Point of Sale Management Software',
  'fbr-pos-integration-software': 'FBR POS Integration Software',
  'inventory-management-software': 'Inventory Management Software',
  'payroll-management-software': 'Payroll Management Software',
  'integration-system': 'Integration System',
  'crm-software': 'CRM Software',
  'petrol-pump-software': 'Petrol Pump Software',
  'petrol-gas-filling-station-software': 'Petrol & Gas Filling Station Software',
  'lpg-business-software': 'LPG Business Software',
  'lpg-transport-management-software': 'LPG Transport Management Software',
  'lpg-bowser-supply-chain-software': 'LPG Bowser Supply Chain Software',
  'fleet-fuel-management-software': 'Fleet Fuel Management Software',
  'petrol-depot-management-software': 'Petrol Depot Management Software',
  'fuel-tank-lorry-management-software': 'Fuel Tank Lorry Management Software',
  'cloud-erp-software-for-textile-industries': 'Cloud ERP for Textile Industries',
  'knitting-dyeing-industry-software': 'Knitting & Dyeing Industry Software',
  'fabric-store-management-software': 'Fabric Store Management Software',
  'garments-manufacturing-software': 'Garments Manufacturing Software',
  'candy-and-confectionery-manufacturing-software': 'Candy & Confectionery Manufacturing Software',
  'retail-management-software': 'Retail Management Software',
  'luggage-bags-store-software': 'Luggage & Bags Store Software',
  'toy-shop-management-software': 'Toy Shop Management Software',
  'crockery-store-management-software': 'Crockery Store Management Software',
  'grocery-store-management-software': 'Grocery Store Management Software',
  'cloud-erp-software-for-services-business': 'Cloud ERP for Services Business',
  'small-and-medium-business-erp-software': 'Small & Medium Business ERP Software',
  'installment-management-software': 'Installment Management Software',
  'pharmacy-business-management-software': 'Pharmacy Business Management Software',
  'homeopathic-business-management-software': 'Homeopathic Business Management Software',
  'hotel-management-software': 'Hotel Management Software',
  'tuc-shop-management-software': 'Tuc Shop Management Software',
  'logistics-transportation-software': 'Logistics & Transportation Software',
  'motor-market-management-software': 'Motor Market Management Software',
  'auto-parts-business-software': 'Auto Parts Business Software',
  'poultry-control-shed-management-software': 'Poultry Control Shed Management Software',
  'poultry-chicken-supply-management-software': 'Poultry Chicken Supply Management Software',
  'poultry-waste-management-software': 'Poultry Waste Management Software',
  'poultry-arhat-software': 'Poultry Arhat Software',
  'cloud-erp-software-for-agriculture-business': 'Cloud ERP for Agriculture Business',
  'dairy-farm-management-software': 'Dairy Farm Management Software',
  'marble-and-granite-factory-software': 'Marble & Granite Factory Software',
  'plastic-pipes-fitting-industry-software': 'Plastic Pipes & Fitting Industry Software',
  'ceiling-and-wall-paneling-store-software': 'Ceiling & Wall Paneling Store Software',
  'tiles-and-ceramics-store-software': 'Tiles & Ceramics Store Software',
  'hardware-sanitary-store-software': 'Hardware & Sanitary Store Software',
  'erp-software-for-real-estate-business': 'ERP for Real Estate Business',
  'erp-software-for-construction-business': 'ERP for Construction Business',
  'software-for-visa-immigration-consultants': 'Visa & Immigration Consultants Software',
  'computers-laptop-business-software': 'Computers & Laptop Business Software',
  'electronics-management-software': 'Electronics Management Software',
  'electric-store-management-software': 'Electric Store Management Software',
  'mobile-accessories-business-software': 'Mobile Accessories Business Software',
  'ev-charging-station-management-software': 'EV Charging Station Management Software',
}

const POOL_REASONS = {
  energy: 'fuel station / pump operations',
  textile: 'textile factory and fabric production',
  factory: 'manufacturing production line',
  retail: 'retail store and checkout operations',
  medical: 'healthcare and pharmacy operations',
  hospitality: 'hotel and restaurant hospitality',
  logistics: 'warehouse and transport logistics',
  agrifood: 'agriculture and crop management',
  poultry: 'poultry farm and flock operations',
  construction: 'construction site and building project',
  property: 'commercial real estate and property',
  electronics: 'electronics retail and inventory',
  visa: 'business travel and immigration consulting',
  smb: 'modern SaaS business operations',
  warehouse: 'warehouse inventory and shelving',
  accounts: 'ERP financial dashboard and analytics',
  office: 'business management and ERP workflow',
  pos: 'POS terminal and retail payment',
}

/** Prefer unused IDs; when pool is exhausted, reuse within same pool (keeps industry relevance). */
function pickFromPool(used, list, start) {
  for (let i = 0; i < list.length; i++) {
    const id = list[(start + i) % list.length]
    if (!used.has(id)) {
      used.add(id)
      return id
    }
  }
  const reused = list[start % list.length]
  used.add(reused)
  return reused
}

/**
 * Build unique 5-image set per slug: hero + reports + dashboard + meeting + ledger.
 */
export function buildSlugImagePlan() {
  const used = new Set()
  const poolCursor = {}
  const plan = {}
  const report = []
  const saasAll = [...SAAS]

  const nextFromPool = (poolName, key) => {
    const pool = POOLS[poolName]
    const list = pool?.[key]?.length ? pool[key] : saasAll
    if (!poolCursor[poolName]) poolCursor[poolName] = 0
    const start = poolCursor[poolName]++
    return pickFromPool(used, list, start)
  }

  let saasIdx = 0
  const nextSaas = () => {
    const start = saasIdx++
    return pickFromPool(used, saasAll, start)
  }

  for (const [slug, poolName] of Object.entries(SLUG_POOL)) {
    const reasonBase = POOL_REASONS[poolName] ?? poolName
    const hero = nextFromPool(poolName, 'heroes')
    const reports = nextSaas()
    const dashboard = nextSaas()
    const meeting = nextFromPool(poolName, 'ops')
    const ledger = nextSaas()

    plan[slug] = {
      hero: U(hero),
      reports: U(reports),
      dashboard: U(dashboard),
      meeting: U(meeting),
      ledger: U(ledger),
      _ids: { hero, reports, dashboard, meeting, ledger },
      _pool: poolName,
    }

    report.push({
      page: SLUG_LABELS[slug] ?? slug,
      slug,
      pool: poolName,
      oldImage: 'Generic Pexels stock / accounts fallback / mismatched industry photo',
      images: {
        hero: {
          unsplashId: hero,
          url: U(hero),
          reason: `Hero matches page title — ${reasonBase}`,
        },
        reports: {
          unsplashId: reports,
          url: U(reports),
          reason: 'Financial reports section — SaaS analytics dashboard',
        },
        dashboard: {
          unsplashId: dashboard,
          url: U(dashboard),
          reason: 'Industries/KPI section — modern ERP dashboard',
        },
        meeting: {
          unsplashId: meeting,
          url: U(meeting),
          reason: `Why-choose workflow — ${reasonBase}`,
        },
        ledger: {
          unsplashId: ledger,
          url: U(ledger),
          reason: 'Documents section — business records / ERP management context',
        },
      },
    })
  }

  return { plan, report }
}

/** Fallback URL list for a slug+role when primary download fails */
export function fallbackUrlsFor(slug, role) {
  const poolName = SLUG_POOL[slug] ?? 'office'
  const pool = POOLS[poolName]
  const saas = SAAS
  const industry = pool?.heroes ?? []
  const ops = pool?.ops ?? []
  const pick =
    role === 'hero' ? industry
    : role === 'meeting' ? ops
    : saas
  const extra = ALL_VERIFIED.filter((id) => !pick.includes(id))
  return [...pick, ...saas, ...extra].map((id) => U(id))
}
