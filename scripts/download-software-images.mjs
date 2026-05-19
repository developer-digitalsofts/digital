/**
 * One-time: download curated Unsplash photos into public/software-images/
 * Run: node scripts/download-software-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const outRoot = join(root, 'public', 'software-images')

const u = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`

/** Unique hero image per software slug */
const SLUG_HERO = {
  'accounts-management-software': null,
  'production-management-software': '1565519929963-4f4eee94d2d9',
  'point-of-sale-management-software': '1556742049-0cfed4f6a45c',
  'fbr-pos-integration-software': '1554224155-6726b3ff858f',
  'inventory-management-software': '1586528116311-ad8dd3c8310d',
  'payroll-management-software': '1522071820081-190bfd318084',
  'integration-system': '1516321318523-799f791d195a',
  'crm-software': '1521737604893-d14cc237f11d',

  'petrol-pump-software': '1545239351-1141bd42e8a8',
  'petrol-gas-filling-station-software': '1477959836854-222efbc12e05',
  'lpg-business-software': '1606851866123-1b9bb09b3524',
  'lpg-transport-management-software': '1586528116311-ad8dd3c8310d',
  'lpg-bowser-supply-chain-software': '1581091226825-a6a2a5aeead0',
  'fleet-fuel-management-software': '1558618666-fcd25c85cd64',
  'petrol-depot-management-software': '1541339907198-e08756ddb8d2',
  'fuel-tank-lorry-management-software': '1601581875929-484b9c9b1c8f',

  'cloud-erp-software-for-textile-industries': '1558171813-09f97779b4b4',
  'knitting-dyeing-industry-software': '1582735369839-f6f7e67ac214',
  'fabric-store-management-software': '1616628188465-3c7fa4d5a9c4',

  'garments-manufacturing-software': '1562157873-818c60868f18',
  'candy-and-confectionery-manufacturing-software': '1582055251543-795381bea83e',

  'retail-management-software': '1556740757-90c9da6e683c',
  'luggage-bags-store-software': '1553062407-98aebc8faec7',
  'toy-shop-management-software': '1515488042361-efe10e253bca',
  'crockery-store-management-software': '1556911220-bff31c812dba',
  'grocery-store-management-software': '1578915973276-09712a4569ad',

  'cloud-erp-software-for-services-business': '1552664730-d307ca884978',
  'small-and-medium-business-erp-software': '1460925895917-afdab827c52f',
  'installment-management-software': '1560518883-ce09059eeffa',

  'pharmacy-business-management-software': '1576091160399-112ba8d25d1f',
  'homeopathic-business-management-software': '1587854691874-8639c334fb8a',

  'hotel-management-software': '1566073770559-75fbad4d6b8e',
  'tuc-shop-management-software': '1441986300917-64668bd77668',

  'logistics-transportation-software': '1601581875929-484b9c9b1c8f',
  'motor-market-management-software': '1492144534657-ae79c964c9d7',
  'auto-parts-business-software': '1486262715619-67b85e5bca94',

  'poultry-control-shed-management-software': '1548555685-7710b02b1c6b',
  'poultry-chicken-supply-management-software': '1607623818031-690003a8af2a',
  'poultry-waste-management-software': '1583337311889-8d1e88a2f2c8',
  'poultry-arhat-software': '1612818560380-888a349c1101',

  'cloud-erp-software-for-agriculture-business': '1500595040803-f08327d1d088',
  'dairy-farm-management-software': '1560497559-90279c73d322',

  'marble-and-granite-factory-software': '1504307651254-35680f356dfd',
  'plastic-pipes-fitting-industry-software': '1503387762-592deb58ef26',
  'ceiling-and-wall-paneling-store-software': '1621902031509-0817e0c9e703',
  'tiles-and-ceramics-store-software': '1615877247373-707f43f071a3',
  'hardware-sanitary-store-software': '1581578731540-c64695cc6952',

  'erp-software-for-real-estate-business': '1560518883-ce09059eeffa',
  'erp-software-for-construction-business': '1541888943205-cb9e29e3b26e',

  'software-for-visa-immigration-consultants': '1436450183531-7fa93bded806',

  'computers-laptop-business-software': '1496181133096-943cead58d17',
  'electronics-management-software': '1550009619-dc94d21b5b08',
  'electric-store-management-software': '1625046330114-4ccf0f2e6e6c',
  'mobile-accessories-business-software': '1511707171634-5f897ffaaae4',
  'ev-charging-station-management-software': '1593941707882-63e4409ad012',
}

/** Category pools — 4 supporting images each (unique per category) */
const POOL_IMAGES = {
  accounts: {
    reports: null,
    dashboard: null,
    meeting: null,
    ledger: null,
  },
  factory: {
    reports: '1581091226825-a6a2a5aeead0',
    dashboard: '1565519929963-4f4eee94d2d9',
    meeting: '1581092162533-c1804bb8bec4',
    ledger: '1554224155-6726b3ff858f',
  },
  retail: {
    reports: '1556740757-90c9da6e683c',
    dashboard: '1551288049-bebda4e38f71',
    meeting: '1556761175-b413da4b16f2',
    ledger: '1556742049-0cfed4f6a45c',
  },
  office: {
    reports: '1554224155-6726b3ff858f',
    dashboard: '1551288049-bebda4e38f71',
    meeting: '1521737604893-d14cc237f11d',
    ledger: '1542744173-8e7e53415bb0',
  },
  warehouse: {
    reports: '1586528116311-ad8dd3c8310d',
    dashboard: '1553413077-721040181e8f',
    meeting: '1586528116311-ad8dd3c8310d',
    ledger: '1586528116311-ad8dd3c8310d',
  },
  hr: {
    reports: '1522071820081-190bfd318084',
    dashboard: '1551288049-bebda4e38f71',
    meeting: '1521737604893-d14cc237f11d',
    ledger: '1542744173-8e7e53415bb0',
  },
  energy: {
    reports: '1545239351-1141bd42e8a8',
    dashboard: '1477959836854-222efbc12e05',
    meeting: '1541339907198-e08756ddb8d2',
    ledger: '1606851866123-1b9bb09b3524',
  },
  textile: {
    reports: '1558171813-09f97779b4b4',
    dashboard: '1582735369839-f6f7e67ac214',
    meeting: '1616628188465-3c7fa4d5a9c4',
    ledger: '1558171813-09f97779b4b4',
  },
  medical: {
    reports: '1576091160399-112ba8d25d1f',
    dashboard: '1584308666134-dc5f62a2c1b0',
    meeting: '1587854691874-8639c334fb8a',
    ledger: '1576091160399-112ba8d25d1f',
  },
  hospitality: {
    reports: '1566073770559-75fbad4d6b8e',
    dashboard: '1551882547-ff40c63fe5fa',
    meeting: '1564507592333-60612e96f399',
    ledger: '1441986300917-64668bd77668',
  },
  logistics: {
    reports: '1601581875929-484b9c9b1c8f',
    dashboard: '1586528116311-ad8dd3c8310d',
    meeting: '1492144534657-ae79c964c9d7',
    ledger: '1486262715619-67b85e5bca94',
  },
  agrifood: {
    reports: '1500595040803-f08327d1d088',
    dashboard: '1560497559-90279c73d322',
    meeting: '1548555685-7710b02b1c6b',
    ledger: '1607623818031-690003a8af2a',
  },
  construction: {
    reports: '1504307651254-35680f356dfd',
    dashboard: '1503387762-592deb58ef26',
    meeting: '1581578731540-c64695cc6952',
    ledger: '1615877247373-707f43f071a3',
  },
  property: {
    reports: '1560518883-ce09059eeffa',
    dashboard: '1560518883-ce09059eeffa',
    meeting: '1560518883-ce09059eeffa',
    ledger: '1560518883-ce09059eeffa',
  },
  electronics: {
    reports: '1550009619-dc94d21b5b08',
    dashboard: '1496181133096-943cead58d17',
    meeting: '1511707171634-5f897ffaaae4',
    ledger: '1593941707882-63e4409ad012',
  },
  visa: {
    reports: '1436450183531-7fa93bded806',
    dashboard: '1436450183531-7fa93bded806',
    meeting: '1521737604893-d14cc237f11d',
    ledger: '1436450183531-7fa93bded806',
  },
  smb: {
    reports: '1460925895917-afdab827c52f',
    dashboard: '1552664730-d307ca884978',
    meeting: '1521737604893-d14cc237f11d',
    ledger: '1542744173-8e7e53415bb0',
  },
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await mkdir(dirname(dest), { recursive: true })
  await writeFile(dest, buf)
  console.log('OK', dest.replace(root, ''))
}

async function copyLocal(src, dest) {
  const { copyFile } = await import('node:fs/promises')
  await mkdir(dirname(dest), { recursive: true })
  await copyFile(join(root, 'public', src.replace(/^\//, '')), dest)
  console.log('COPY', dest.replace(root, ''))
}

const LOCAL_ACCOUNTS = {
  hero: 'accounts/hero-finance-team.jpg',
  reports: 'accounts/financial-reports.jpg',
  dashboard: 'accounts/accounting-dashboard.jpg',
  meeting: 'accounts/finance-team-meeting.jpg',
  ledger: 'accounts/ledger-documents.jpg',
}

for (const [slug, id] of Object.entries(SLUG_HERO)) {
  const dest = join(outRoot, slug, 'hero.jpg')
  if (slug === 'accounts-management-software') {
    await copyLocal(LOCAL_ACCOUNTS.hero, dest)
    continue
  }
  if (!id) continue
  try {
    await download(u(id), dest)
  } catch (e) {
    console.error('FAIL hero', slug, e.message)
  }
}

for (const [pool, files] of Object.entries(POOL_IMAGES)) {
  for (const [role, id] of Object.entries(files)) {
    const dest = join(outRoot, '_pools', pool, `${role}.jpg`)
    if (pool === 'accounts' && id === null) {
      const key = role === 'reports' ? 'reports' : role === 'dashboard' ? 'dashboard' : role === 'meeting' ? 'meeting' : 'ledger'
      await copyLocal(LOCAL_ACCOUNTS[key], dest)
      continue
    }
    if (!id) continue
    try {
      await download(u(id), dest)
    } catch (e) {
      console.error('FAIL pool', pool, role, e.message)
    }
  }
}

console.log('Done.')
