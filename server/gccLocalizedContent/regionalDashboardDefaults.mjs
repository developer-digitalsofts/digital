/** Per-country illustrative dashboard defaults for software-detail locale CMS records. */
export const REGIONAL_COMPANIES = {
  AE: {
    en: ['Al Noor Trading', 'Gulf Retail LLC', 'Dubai Holdings', 'Emirates Supplies'],
    ar: ['Al Noor Trading', 'Gulf Retail LLC', 'Dubai Holdings', 'Emirates Supplies'],
  },
  SA: {
    en: ['Riyadh Trading Co.', 'Jeddah Retail Group', 'Eastern Supplies', 'Najd Holdings'],
    ar: ['Riyadh Trading Co.', 'Jeddah Retail Group', 'Eastern Supplies', 'Najd Holdings'],
  },
  QA: {
    en: ['Doha Trading LLC', 'West Bay Retail', 'Qatar Gulf Supplies', 'Al Rayyan Logistics'],
    ar: ['Doha Trading LLC', 'West Bay Retail', 'Qatar Gulf Supplies', 'Al Rayyan Logistics'],
  },
  OM: {
    en: ['Muscat Trading LLC', 'Sohar Retail Group', 'Gulf Oman Supplies', 'Salalah Holdings'],
    ar: ['Muscat Trading LLC', 'Sohar Retail Group', 'Gulf Oman Supplies', 'Salalah Holdings'],
  },
  KW: {
    en: ['Kuwait Trading Co.', 'Hawalli Retail Group', 'Gulf Supplies KW', 'Farwaniya Holdings'],
    ar: ['Kuwait Trading Co.', 'Hawalli Retail Group', 'Gulf Supplies KW', 'Farwaniya Holdings'],
  },
  BH: {
    en: ['Manama Trading Co.', 'Riffa Retail Group', 'Gulf Supplies BH', 'Muharraq Holdings'],
    ar: ['Manama Trading Co.', 'Riffa Retail Group', 'Gulf Supplies BH', 'Muharraq Holdings'],
  },
}

export const REGIONAL_DASHBOARD = {
  AE: {
    erpRevenue: '2.4M',
    erpGross: '612K',
    erpReceivables: '318K',
    branchAmounts: ['980K', '640K', '420K'],
    financeCash: '842K',
    posToday: '132,760',
    posBasket: '273',
    inventoryValue: '1.25M',
    hrPayroll: '428K',
    moduleCashFlow: '46.32M',
    modulePosSales: '1.24M',
    modulePayroll: '6.45M',
  },
  SA: {
    erpRevenue: '2.4M',
    erpGross: '612K',
    erpReceivables: '318K',
    branchAmounts: ['980K', '640K', '420K'],
    financeCash: '842K',
    posToday: '132,760',
    posBasket: '273',
    inventoryValue: '1.25M',
    hrPayroll: '428K',
    moduleCashFlow: '46.32M',
    modulePosSales: '1.24M',
    modulePayroll: '6.45M',
  },
  QA: {
    erpRevenue: '2.2M',
    erpGross: '580K',
    erpReceivables: '295K',
    branchAmounts: ['920K', '610K', '400K'],
    financeCash: '810K',
    posToday: '128,400',
    posBasket: '265',
    inventoryValue: '1.18M',
    hrPayroll: '410K',
    moduleCashFlow: '42.8M',
    modulePosSales: '1.18M',
    modulePayroll: '6.1M',
  },
  OM: {
    erpRevenue: '245K',
    erpGross: '62K',
    erpReceivables: '32K',
    branchAmounts: ['98K', '64K', '42K'],
    financeCash: '84K',
    posToday: '13,276',
    posBasket: '27',
    inventoryValue: '125K',
    hrPayroll: '42K',
    moduleCashFlow: '4.6M',
    modulePosSales: '124K',
    modulePayroll: '645K',
  },
  KW: {
    erpRevenue: '198K',
    erpGross: '52K',
    erpReceivables: '28K',
    branchAmounts: ['78K', '52K', '34K'],
    financeCash: '68K',
    posToday: '10,980',
    posBasket: '22',
    inventoryValue: '102K',
    hrPayroll: '35K',
    moduleCashFlow: '3.8M',
    modulePosSales: '98K',
    modulePayroll: '520K',
  },
  BH: {
    erpRevenue: '245K',
    erpGross: '62K',
    erpReceivables: '32K',
    branchAmounts: ['98K', '64K', '42K'],
    financeCash: '84K',
    posToday: '13,276',
    posBasket: '27',
    inventoryValue: '125K',
    hrPayroll: '42K',
    moduleCashFlow: '4.6M',
    modulePosSales: '124K',
    modulePayroll: '645K',
  },
}

export function buildRegionalBlock(profile) {
  const dashboard = REGIONAL_DASHBOARD[profile.code] || REGIONAL_DASHBOARD.AE
  const companies = REGIONAL_COMPANIES[profile.code] || REGIONAL_COMPANIES.AE
  const cities = profile.cities.en.slice(0, 3)
  return {
    currency: profile.currency,
    currencyName: profile.currencyName,
    countryCode: profile.code,
    countryName: profile.fullName,
    cityPhrase: profile.cityPhrase,
    cities: profile.cities,
    vatLabel: profile.vatLabel || { en: `${profile.name.en} VAT`, ar: profile.name.ar },
    companies,
    dashboard,
    branches: cities.map((city, i) => ({
      city,
      amount: `${profile.currency} ${dashboard.branchAmounts[i] ?? dashboard.branchAmounts[0]}`,
    })),
  }
}
