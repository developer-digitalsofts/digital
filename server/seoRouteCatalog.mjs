/**
 * Public UAE English routes mirrored from App.tsx + megaMenu module paths.
 * Industry detail pages are discovered from public/software-images at runtime.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LOCALE_ROUTE_REGISTRY } from './localeContentModel.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Flat module URLs (canonical UAE English routes). */
export const UAE_MODULE_PATHS = [
  '/software/accounts-management-software',
  '/software/production-management-software',
  '/software/point-of-sale-software',
  '/software/fbr-pos-integration-software',
  '/software/inventory-management-software',
  '/software/payroll-management-software',
  '/software/sms-integration-system',
  '/software/crm-software',
]

const MODULE_FOLDER_TO_PATH = {
  'accounts-management-software': '/software/accounts-management-software',
  'production-management-software': '/software/production-management-software',
  'point-of-sale-management-software': '/software/point-of-sale-software',
  'fbr-pos-integration-software': '/software/fbr-pos-integration-software',
  'inventory-management-software': '/software/inventory-management-software',
  'payroll-management-software': '/software/payroll-management-software',
  'integration-system': '/software/sms-integration-system',
  'crm-software': '/software/crm-software',
}

export function registryStaticPaths() {
  return LOCALE_ROUTE_REGISTRY.map((r) => `/${r.slug}`)
}

export function discoverIndustryPaths() {
  const imageRoot = path.resolve(__dirname, '../public/software-images')
  if (!fs.existsSync(imageRoot)) return []
  const moduleFolders = new Set(Object.keys(MODULE_FOLDER_TO_PATH))
  const paths = []
  for (const entry of fs.readdirSync(imageRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue
    if (moduleFolders.has(entry.name)) continue
    paths.push(`/software/industry/${entry.name}`)
  }
  return paths.sort()
}

export function uaeSoftwarePaths() {
  const industry = discoverIndustryPaths()
  return [...new Set([...UAE_MODULE_PATHS, ...industry])].sort()
}

export function uaeCorePaths() {
  return ['/', '/contact', '/blog', '/industries', ...registryStaticPaths()]
}
