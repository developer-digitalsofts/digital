/**
 * Validate generated OpenAPI spec structure (local CI helper).
 * Usage: node scripts/validate-openapi.mjs [baseUrl]
 */
import { buildPublicOpenApiSpec } from '../server/agenticOpenApi.mjs'

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:3040').replace(/\/$/, '')

function validateSpec(spec) {
  const errors = []
  if (spec.openapi !== '3.1.0') errors.push(`Expected openapi 3.1.0, got ${spec.openapi}`)
  if (!spec.info?.title) errors.push('Missing info.title')
  const ops = []
  const ids = new Set()
  for (const [path, methods] of Object.entries(spec.paths || {})) {
    for (const [method, op] of Object.entries(methods || {})) {
      if (!op.operationId) errors.push(`Missing operationId: ${method.toUpperCase()} ${path}`)
      else if (ids.has(op.operationId)) errors.push(`Duplicate operationId: ${op.operationId}`)
      else ids.add(op.operationId)
      if (!op.description) errors.push(`Missing description: ${op.operationId}`)
      if (!op.responses) errors.push(`Missing responses: ${op.operationId}`)
      if (path.includes('/api/admin')) errors.push(`Admin path leaked: ${path}`)
      ops.push(op)
    }
  }
  const requiredPaths = ['/api/health', '/api/leads', '/api/public/testimonials', '/openapi.json']
  for (const p of requiredPaths) {
    if (!spec.paths?.[p]) errors.push(`Missing required path: ${p}`)
  }
  if (JSON.stringify(spec).includes('/api/admin')) errors.push('Spec mentions /api/admin')
  return { errors, operationCount: ops.length, operationIds: [...ids] }
}

async function main() {
  const built = validateSpec(buildPublicOpenApiSpec())
  if (built.errors.length) {
    console.error('Built spec validation failed:')
    for (const e of built.errors) console.error(`  ✗ ${e}`)
    process.exit(1)
  }
  console.log(`✓ Built spec: ${built.operationCount} operations`)

  const live = await fetch(`${BASE}/openapi.json`)
  const liveSpec = await live.json()
  const liveResult = validateSpec(liveSpec)
  if (!live.ok) {
    console.error(`✗ Live openapi.json HTTP ${live.status}`)
    process.exit(1)
  }
  if (liveResult.errors.length) {
    console.error('Live spec validation failed:')
    for (const e of liveResult.errors) console.error(`  ✗ ${e}`)
    process.exit(1)
  }
  console.log(`✓ Live spec: ${liveResult.operationCount} operations`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
