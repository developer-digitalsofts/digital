/**
 * Field-level locale inheritance helpers.
 */
import { readBilingualText } from './contentHelpers.mjs'

export function ensureFieldMeta(payload = {}) {
  const next = { ...payload }
  if (!next.fieldMeta || typeof next.fieldMeta !== 'object') next.fieldMeta = {}
  if (!next.fields || typeof next.fields !== 'object') next.fields = {}
  return next
}

export function getFieldMeta(payload, fieldName) {
  const p = ensureFieldMeta(payload)
  const meta = p.fieldMeta[fieldName]
  if (meta && typeof meta === 'object') return meta
  return { status: 'inherited', inherited: true }
}

export function resetFieldToInherited(payload, fieldName) {
  const p = ensureFieldMeta(payload)
  if (p.fields && fieldName in p.fields) {
    const fields = { ...p.fields }
    delete fields[fieldName]
    p.fields = fields
  }
  p.fieldMeta[fieldName] = { status: 'inherited', inherited: true, updatedAt: new Date().toISOString() }
  return p
}

export function copyFieldFromSource(payload, fieldName, sourcePayload) {
  const p = ensureFieldMeta(payload)
  const source = ensureFieldMeta(sourcePayload)
  const sourceVal = source.fields?.[fieldName] ?? source[fieldName]

  if (sourceVal === undefined) {
    p.fieldMeta[fieldName] = { status: 'missing', inherited: false, updatedAt: new Date().toISOString() }
    return p
  }

  p.fields = { ...p.fields, [fieldName]: structuredClone(sourceVal) }
  p.fieldMeta[fieldName] = { status: 'customized', inherited: false, updatedAt: new Date().toISOString() }
  return p
}

export function listFieldMeta(payload) {
  const p = ensureFieldMeta(payload)
  const keys = new Set([...Object.keys(p.fieldMeta || {}), ...Object.keys(p.fields || {})])
  return [...keys].map((fieldName) => ({
    fieldName,
    ...getFieldMeta(p, fieldName),
  }))
}

export function mergeFieldIntoPayload(payload, fieldName, lang) {
  const p = ensureFieldMeta(payload)
  const meta = getFieldMeta(p, fieldName)
  if (meta.status === 'inherited' || meta.inherited) return p
  const val = p.fields?.[fieldName]
  if (val === undefined) return p
  if (val && typeof val === 'object' && ('en' in val || 'ar' in val)) {
    return { ...p, [fieldName]: readBilingualText(val, lang) }
  }
  return { ...p, [fieldName]: val }
}
