/**
 * Seeds the default local admin user into server/data/users.json.
 * Safe to run multiple times — skips if admin@admin.com already exists.
 */
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { nanoid } from 'nanoid'
import { loadEnv } from '../loadEnv.mjs'
import { allowAdminBootstrap, isProduction } from '../envConfig.mjs'

loadEnv()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE = path.join(__dirname, '../data/users.json')

const DEFAULT_EMAIL = 'admin@admin.com'
const DEFAULT_PASSWORD = 'Admin@123'
const DEFAULT_NAME = 'Super Admin'
const DEFAULT_ROLE = 'Super Admin'
const DEFAULT_STATUS = 'Active'

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') return []
    throw e
  }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true })
  await fs.writeFile(USERS_FILE, `${JSON.stringify(users, null, 2)}\n`, 'utf8')
}

async function main() {
  if (isProduction() && !allowAdminBootstrap()) {
    console.error('Admin bootstrap is disabled. Set ALLOW_ADMIN_BOOTSTRAP=true to seed in production.')
    process.exit(1)
  }

  const users = await readUsers()
  const emailNorm = DEFAULT_EMAIL.toLowerCase()
  const exists = users.some((u) => String(u?.email ?? '').toLowerCase() === emailNorm)

  if (exists) {
    console.log(`Default admin already exists (${DEFAULT_EMAIL}). Skipping seed.`)
    return
  }

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10)
  users.push({
    id: nanoid(12),
    email: DEFAULT_EMAIL,
    name: DEFAULT_NAME,
    profileImageUrl: '',
    passwordHash,
    role: DEFAULT_ROLE,
    status: DEFAULT_STATUS,
  })

  await writeUsers(users)
  console.log('Default admin created successfully.')
  console.log(`  Email:    ${DEFAULT_EMAIL}`)
  console.log(`  Password: ${DEFAULT_PASSWORD}`)
  console.log(`  Role:     ${DEFAULT_ROLE}`)
  console.log(`  Status:   ${DEFAULT_STATUS}`)
  console.log('Change this password before deploying to production.')
}

main().catch((e) => {
  console.error('Admin seed failed:', e)
  process.exit(1)
})
