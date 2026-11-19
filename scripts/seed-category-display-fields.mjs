import { readFileSync, writeFileSync } from 'node:fs'
import { getCategories } from '../lib/products.ts'

const tenantId = 'd189a65a-480c-4800-ab12-ac21a9d724d7'
const apply = process.argv.includes('--apply')
const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split(/\r?\n/)
  .map(line => line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)).filter(Boolean)
  .map(row => [row[1], row[2].trim().replace(/^['"]|['"]$/g, '')]))
if (env.NEXT_PUBLIC_TENANT_ID !== tenantId || !env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Customer tenant identity unavailable')
}
const base = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, '')
const headers = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json', Prefer: 'return=representation' }
async function table(name, query, method = 'GET', body) {
  const response = await fetch(`${base}/rest/v1/${name}?${query}`, { method, headers,
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`${name} ${method} HTTP ${response.status}`)
  return response.json()
}
const [categories, products] = await Promise.all([
  table('product_categories', `tenant_id=eq.${tenantId}&select=id,slug,name_i18n,description_i18n,extra_data,icon,updated_at&limit=1000`),
  table('products', `tenant_id=eq.${tenantId}&is_active=eq.true&select=extra_data,image_url&limit=1000`),
])
const source = getCategories('en')
if (categories.length !== source.length || source.length !== 17 || products.length !== 77) throw new Error('Catalog/category inventory changed')
const bySlug = new Map(categories.map(row => [row.slug, row]))
const plans = source.map(item => {
  const row = bySlug.get(item.slug)
  const sourceRow = Number(item.image.src.match(/product-row-(\d+)\.webp$/)?.[1])
  const product = products.find(entry => entry.extra_data?.source_row === sourceRow)
  if (!row?.id || row.name_i18n?.en !== item.name || !Number.isInteger(sourceRow) || !product?.image_url?.startsWith('https://')) {
    throw new Error(`Category source/backend identity mismatch: ${item.slug}`)
  }
  const description = { ...(row.description_i18n ?? {}) }
  const extra = { ...(row.extra_data ?? {}) }
  const tagline = { ...(extra.tagline_i18n ?? {}) }
  const imageAlt = { ...(extra.image_alt_i18n ?? {}) }
  for (const [existing, expected, label] of [
    [description.en, item.description, 'description'],
    [tagline.en, item.tagline, 'tagline'],
    [imageAlt.en, item.image.alt, 'image alt'],
    [row.icon, product.image_url, 'image'],
  ]) if (existing && existing !== expected) throw new Error(`Existing ${label} differs for ${item.slug}`)
  description.en = item.description
  tagline.en = item.tagline
  imageAlt.en = item.image.alt
  extra.tagline_i18n = tagline
  extra.image_alt_i18n = imageAlt
  return { id: row.id, slug: item.slug, sourceRow, updatedAt: row.updated_at,
    changed: !row.description_i18n?.en || !row.extra_data?.tagline_i18n?.en || !row.extra_data?.image_alt_i18n?.en || !row.icon,
    payload: { description_i18n: description, extra_data: extra, icon: product.image_url } }
})
const changed = plans.filter(plan => plan.changed)
if (apply) {
  for (const plan of changed) {
    const saved = await table('product_categories', `tenant_id=eq.${tenantId}&id=eq.${plan.id}&updated_at=eq.${encodeURIComponent(plan.updatedAt)}`,
      'PATCH', plan.payload)
    if (saved.length !== 1 || saved[0].id !== plan.id) throw new Error(`Conditional category update failed: ${plan.slug}`)
  }
  const after = await table('product_categories', `tenant_id=eq.${tenantId}&select=id,slug,description_i18n,extra_data,icon&limit=1000`)
  for (const plan of plans) {
    const row = after.find(item => item.id === plan.id)
    if (row?.description_i18n?.en !== plan.payload.description_i18n.en || row.icon !== plan.payload.icon ||
      row.extra_data?.tagline_i18n?.en !== plan.payload.extra_data.tagline_i18n.en ||
      row.extra_data?.image_alt_i18n?.en !== plan.payload.extra_data.image_alt_i18n.en) {
      throw new Error(`Category readback mismatch: ${plan.slug}`)
    }
  }
}
const report = { schemaVersion: 1, tenantId, mode: apply ? 'apply' : 'dry-run', source: 'customer site verified category records and corresponding active product cutouts',
  categoryCount: plans.length, changedCount: changed.length, checkedAt: new Date().toISOString(), pass: true,
  rows: plans.map(({ id, slug, sourceRow, changed }) => ({ id, slug, sourceRow, changed })) }
if (apply) writeFileSync(new URL('../deliverables/category-display-backend-2026-11-19.json', import.meta.url), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ mode: report.mode, categories: plans.length, changed: changed.length, pass: true }))
