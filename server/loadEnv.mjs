import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Load KEY=VALUE pairs from .env files without overwriting existing process.env. */
export function loadEnv() {
  const candidates = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env'),
  ]

  for (const envPath of candidates) {
    try {
      const raw = fs.readFileSync(envPath, 'utf8')
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const idx = trimmed.indexOf('=')
        if (idx <= 0) continue
        const key = trimmed.slice(0, idx).trim()
        if (!key || Object.hasOwn(process.env, key)) continue
        let val = trimmed.slice(idx + 1).trim()
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1)
        }
        process.env[key] = val
      }
      console.log(`[env] loaded ${envPath}`)
      return envPath
    } catch (e) {
      if (e && typeof e === 'object' && 'code' in e && e.code !== 'ENOENT') {
        console.warn(`[env] failed to read ${envPath}:`, e.message || e)
      }
    }
  }

  return null
}
