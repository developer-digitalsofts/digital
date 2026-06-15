/** Solid circular icon backgrounds — white glyph inside (old-site style). */

export const moduleIconBg: Record<string, string> = {
  'accounts-management-software': 'bg-[#F5824A]',
  'production-management-software': 'bg-[#2563EB]',
  'point-of-sale-management-software': 'bg-[#7C3AED]',
  'fbr-pos-integration-software': 'bg-[#DC2626]',
  'inventory-management-software': 'bg-[#16A34A]',
  'payroll-management-software': 'bg-[#991B1B]',
  'integration-system': 'bg-[#0D9488]',
  'crm-software': 'bg-[#DB2777]',
}

export const industryIconBg: Record<string, string> = {
  retail: 'bg-[#DC2626]',
  'oil-gas': 'bg-[#1E293B]',
  manufacturing: 'bg-[#2563EB]',
  textile: 'bg-[#EA580C]',
  hospitality: 'bg-[#1E3A5F]',
  medical: 'bg-[#7C3AED]',
  smb: 'bg-[#0EA5E9]',
  logistics: 'bg-[#F97316]',
  'real-estate': 'bg-[#14B8A6]',
  poultry: 'bg-[#EC4899]',
  agriculture: 'bg-[#22C55E]',
  construction: 'bg-[#84CC16]',
  visa: 'bg-[#FB7185]',
  electronics: 'bg-[#171717]',
}

const defaultModuleBg = 'bg-[#F5824A]'
const defaultIndustryBg = 'bg-[#64748B]'

export function moduleIconBgClass(slug: string): string {
  return moduleIconBg[slug] ?? defaultModuleBg
}

export function industryIconBgClass(catId: string): string {
  return industryIconBg[catId] ?? defaultIndustryBg
}
