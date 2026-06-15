import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseEnvFile(envPath) {
  const raw = fs.readFileSync(envPath, 'utf8')
  const pairs = []
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    if (!key) continue
    let val = trimmed.slice(idx + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    pairs.push([key, val])
  }
  return pairs
}

function collectEnvPaths() {
  const dirs = [path.join(__dirname, '..'), __dirname]
  const ordered = []

  for (const dir of dirs) {
    const candidates = ['.env', '.env.local']
    for (const name of candidates) {
      ordered.push(path.join(dir, name))
    }
    try {
      for (const entry of fs.readdirSync(dir)) {
        if (entry.startsWith('.env.') && entry.endsWith('.local') && entry !== '.env.local') {
          ordered.push(path.join(dir, entry))
        }
      }
    } catch {
      /* dir missing */
    }
  }

  return ordered
}

function applyAliases() {
  if (!process.env.JWT_SECRET?.trim() && process.env.AUTH_SECRET?.trim()) {
    process.env.JWT_SECRET = process.env.AUTH_SECRET.trim()
  }
  if (!process.env.AUTH_SECRET?.trim() && process.env.JWT_SECRET?.trim()) {
    process.env.AUTH_SECRET = process.env.JWT_SECRET.trim()
  }
  if (!process.env.VITE_API_URL?.trim() && process.env.NEXT_PUBLIC_CMS_API_URL?.trim()) {
    process.env.VITE_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL.trim()
  }
}

/** Load .env, .env.local, and .env.*.local from project root and server/. Later files override. */
export function loadEnv() {
  const loaded = []

  for (const envPath of collectEnvPaths()) {
    try {
      for (const [key, val] of parseEnvFile(envPath)) {
        process.env[key] = val
      }
      loaded.push(envPath)
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code !== 'ENOENT') {
        console.warn(`[env] failed to read ${envPath}:`, e.message || e)
      }
    }
  }

  applyAliases()

  if (loaded.length) {
    console.log(`[env] loaded ${loaded.length} file(s): ${loaded.map((p) => path.basename(p)).join(', ')}`)
  } else {
    console.log('[env] no .env files found — using process environment defaults')
  }

  return loaded
}
