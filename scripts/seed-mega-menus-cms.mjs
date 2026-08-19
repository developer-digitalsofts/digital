/**
 * Seed megaMenus.json from current approved frontend content.
 * Usage: node scripts/seed-mega-menus-cms.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

function bi(en, ar) {
  return { en, ar }
}

function item(id, titleEn, titleAr, descEn, descAr, href, imageUrl, imageAltEn, imageAltAr, sortOrder) {
  return {
    id,
    title: bi(titleEn, titleAr),
    description: bi(descEn, descAr),
    imageUrl,
    imageAlt: bi(imageAltEn, imageAltAr),
    href,
    featured: true,
    active: true,
    sortOrder,
  }
}

function category(id, titleEn, titleAr, items, sortOrder) {
  return { id, title: bi(titleEn, titleAr), items, sortOrder, active: true }
}

const industriesPanel = {
  heading: bi('Solutions for every type of business', 'حلول لكل نوع من الأعمال'),
  subheading: bi(
    'Choose your industry to explore software designed for your daily operations.',
    'اختر قطاعك لاستكشاف برمجيات مصممة لعملياتك اليومية.',
  ),
  viewAllLabel: bi('View All Industries →', 'عرض جميع القطاعات ←'),
  viewAllHref: '/industries',
  categories: [
    category('retailCommerce', 'RETAIL & COMMERCE', 'التجزئة والتجارة', [
      item('retailPos', 'Retail POS', 'نقطة بيع التجزئة', 'Billing, stock and customer management', 'الفوترة والمخزون وإدارة العملاء', '/software/industry/retail-management-software', '/software-images/retail-management-software/hero.jpg', 'Retail POS software', 'برمجيات نقطة بيع التجزئة', 0),
      item('supermarket', 'Supermarket Software', 'برمجيات السوبرماركت', 'Fast checkout and multi-branch control', 'دفع سريع وتحكم متعدد الفروع', '/software/industry/grocery-store-management-software', '/software-images/grocery-store-management-software/hero.jpg', 'Supermarket software', 'برمجيات السوبرماركت', 1),
      item('pharmacy', 'Pharmacy Management', 'إدارة الصيدليات', 'Inventory, expiry and sales tracking', 'المخزون والصلاحية وتتبع المبيعات', '/software/industry/pharmacy-business-management-software', '/software-images/pharmacy-business-management-software/hero.jpg', 'Pharmacy management software', 'برمجيات إدارة الصيدليات', 2),
    ], 0),
    category('manufacturing', 'MANUFACTURING & DISTRIBUTION', 'التصنيع والتوزيع', [
      item('manufacturingErp', 'Manufacturing ERP', 'ERP للتصنيع', 'Production, inventory and costing', 'الإنتاج والمخزون والتكلفة', '/software/industry/garments-manufacturing-software', '/software-images/garments-manufacturing-software/hero.jpg', 'Manufacturing ERP', 'ERP للتصنيع', 0),
      item('textileGarments', 'Textile & Garments', 'النسيج والملابس', 'Orders, production and dispatch', 'الطلبات والإنتاج والإرسال', '/software/industry/cloud-erp-software-for-textile-industries', '/software-images/cloud-erp-software-for-textile-industries/hero.jpg', 'Textile and garments ERP', 'ERP للنسيج والملابس', 1),
      item('warehouse', 'Warehouse Management', 'إدارة المستودعات', 'Locations, transfers and stock visibility', 'المواقع والتحويلات ورؤية المخزون', '/software/industry/hardware-sanitary-store-software', '/software-images/hardware-sanitary-store-software/hero.jpg', 'Warehouse management', 'إدارة المستودعات', 2),
    ], 1),
    category('specialized', 'SPECIALIZED INDUSTRIES', 'القطاعات المتخصصة', [
      item('petrolStation', 'Petrol Station Software', 'برمجيات محطات الوقود', 'Tanks, nozzles, shifts and accounts', 'الخزانات والفوهات والورديات والحسابات', '/software/industry/petrol-pump-software', '/software-images/petrol-pump-software/hero.jpg', 'Petrol station software', 'برمجيات محطات الوقود', 0),
      item('lpg', 'LPG Business Software', 'برمجيات أعمال الغاز', 'Cylinders, filling and distribution', 'الأسطوانات والتعبئة والتوزيع', '/software/industry/lpg-business-software', '/software-images/lpg-business-software/hero.jpg', 'LPG business software', 'برمجيات أعمال الغاز', 1),
      item('poultryAgri', 'Poultry & Agriculture', 'الدواجن والزراعة', 'Flocks, feed, production and finance', 'القطعان والعلف والإنتاج والمالية', '/software/industry/poultry-control-shed-management-software', '/software-images/poultry-control-shed-management-software/hero.jpg', 'Poultry and agriculture software', 'برمجيات الدواجن والزراعة', 2),
    ], 2),
  ],
  footer: {
    prompt: bi('Need a solution tailored to your workflow?', 'هل تحتاج حلاً مخصصاً لسير عملك؟'),
    linkLabel: bi('Talk to our experts →', 'تحدث إلى خبرائنا ←'),
    linkHref: '/contact',
    buttonLabel: bi('Get a Demo', 'احصل على عرض'),
    buttonHref: '/contact#contact-form',
  },
  status: 'published',
}

const modulesPanel = {
  heading: bi('Powerful modules for every business function', 'وحدات قوية لكل وظيفة أعمال'),
  subheading: bi(
    'Choose the tools you need and manage everything from one connected platform.',
    'اختر الأدوات التي تحتاجها وأدر كل شيء من منصة واحدة متصلة.',
  ),
  viewAllLabel: bi('View All Modules →', 'عرض جميع الوحدات ←'),
  viewAllHref: '/#modules',
  categories: [
    category('financeCompliance', 'FINANCE & COMPLIANCE', 'المالية والامتثال', [
      item('accountsFinance', 'Accounts & Finance', 'الحسابات والمالية', 'Ledgers, vouchers, cash flow and bank control', 'دفاتر وسندات وتدفق نقدي وبنوك', '/software/accounts-management-software', '/software-images/accounts-management-software/dashboard.jpg', 'Accounts and finance software', 'برمجيات الحسابات والمالية', 0),
      item('vatCompliance', 'UAE VAT & Tax Compliance', 'امتثال ضريبة القيمة المضافة في الإمارات', 'UAE VAT-compliant invoicing and tax reporting', 'فوترة متوافقة مع ضريبة القيمة المضافة وتقارير ضريبية', '/software/fbr-pos-integration-software', '/software-images/fbr-pos-integration-software/dashboard.jpg', 'UAE VAT and tax compliance software', 'برمجيات امتثال ضريبة القيمة المضافة', 1),
      item('reportsAnalytics', 'Reports & Analytics', 'التقارير والتحليلات', 'Real-time dashboards and business insights', 'لوحات معلومات فورية ورؤى الأعمال', '/software/accounts-management-software', '/software-images/accounts-management-software/reports.jpg', 'Business reports and analytics', 'تقارير وتحليلات الأعمال', 2),
    ], 0),
    category('operations', 'OPERATIONS', 'العمليات', [
      item('inventoryManagement', 'Inventory Management', 'إدارة المخزون', 'Stock levels, transfers and warehouse control', 'مستويات المخزون والتحويلات والمستودعات', '/software/inventory-management-software', '/software-images/inventory-management-software/hero.jpg', 'Inventory management software', 'برمجيات إدارة المخزون', 0),
      item('productionManagement', 'Production Management', 'إدارة الإنتاج', 'Work orders, BOM and shop-floor visibility', 'أوامر العمل وBOM ورؤية المصنع', '/software/production-management-software', '/software-images/production-management-software/dashboard.jpg', 'Production management software', 'برمجيات إدارة الإنتاج', 1),
      item('purchaseManagement', 'Purchase Management', 'إدارة المشتريات', 'Supplier orders, GRN and procurement control', 'طلبات الموردين وGRN ومراقبة الشراء', '/software/purchase-management-software', '/software-images/inventory-management-software/ledger.jpg', 'Purchase management software', 'برمجيات إدارة المشتريات', 2),
    ], 1),
    category('salesWorkforce', 'SALES & WORKFORCE', 'المبيعات والموارد', [
      item('pointOfSale', 'Point of Sale', 'نقطة البيع', 'Fast checkout, billing and retail sales', 'دفع سريع وفوترة ومبيعات التجزئة', '/software/point-of-sale-software', '/software-images/point-of-sale-management-software/hero.jpg', 'Point of sale software', 'برمجيات نقطة البيع', 0),
      item('crmSoftware', 'CRM Software', 'برمجيات CRM', 'Leads, follow-ups and customer pipeline', 'عملاء محتملون ومتابعات ومسار المبيعات', '/software/crm-software', '/software-images/crm-software/dashboard.jpg', 'CRM software', 'برمجيات CRM', 1),
      item('payrollManagement', 'Payroll Management', 'إدارة الرواتب', 'Salaries, attendance and workforce payroll', 'رواتب وحضور وموارد بشرية', '/software/payroll-management-software', '/software-images/payroll-management-software/hero.jpg', 'Payroll management software', 'برمجيات إدارة الرواتب', 2),
    ], 2),
  ],
  footer: {
    prompt: bi('Not sure which modules your business needs?', 'لست متأكداً أي وحدات يحتاجها عملك؟'),
    linkLabel: bi('Compare Solutions →', 'قارن الحلول ←'),
    linkHref: '/#modules',
    buttonLabel: bi('Talk to an Expert', 'تحدث إلى خبير'),
    buttonHref: '/contact',
  },
  status: 'published',
}

const doc = {
  modules: modulesPanel,
  industries: industriesPanel,
  _meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), updatedBy: 'seed-mega-menus-cms' },
}

writeFileSync(join(root, 'server/data/megaMenus.json'), JSON.stringify(doc, null, 2), 'utf8')
mkdirSync(join(root, 'server/data/published'), { recursive: true })
writeFileSync(join(root, 'server/data/published/megaMenus.json'), JSON.stringify(doc, null, 2), 'utf8')
mkdirSync(join(root, 'server/data/backups'), { recursive: true })
writeFileSync(join(root, 'server/data/backups', `megaMenus-${Date.now()}.json`), JSON.stringify(doc, null, 2), 'utf8')
console.log('Seeded megaMenus.json')
