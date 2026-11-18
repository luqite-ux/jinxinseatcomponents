import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  .split(/\r?\n/).map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean)
  .map((match) => [match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]))
const tenantId = env.NEXT_PUBLIC_TENANT_ID
if (tenantId !== 'd189a65a-480c-4800-ab12-ac21a9d724d7') throw new Error('Unexpected tenant')
const catalog = JSON.parse(readFileSync(new URL('../lib/product-catalog.json', import.meta.url), 'utf8'))
const base = `${env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, '')}/rest/v1/products`
const headers = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
const query = new URL(base)
query.searchParams.set('tenant_id', `eq.${tenantId}`)
query.searchParams.set('select', 'id,slug,specs')
query.searchParams.set('limit', '1000')
const response = await fetch(query, { headers })
if (!response.ok) throw new Error(`Product read HTTP ${response.status}`)
const rows = await response.json()
const bySlug = new Map(rows.map((row) => [row.slug, row]))
const sameSpecs = (left, right) => JSON.stringify(Object.entries(left ?? {}).sort(([a], [b]) => a.localeCompare(b))) === JSON.stringify(Object.entries(right ?? {}).sort(([a], [b]) => a.localeCompare(b)))
if (rows.length !== catalog.length || bySlug.size !== catalog.length) throw new Error('Product count mismatch')
const changes = catalog.flatMap((item) => {
  const current = bySlug.get(item.slug)
  if (!current) throw new Error(`Missing ${item.slug}`)
  const specs = Object.fromEntries(item.specifications.map((spec, index) => [`${index + 1}. ${spec.label.en}`, spec.value.en]))
  return sameSpecs(specs, current.specs) ? [] : [{ id: current.id, slug: item.slug, specs }]
})
if (process.argv[2] !== '--apply') {
  console.log(JSON.stringify({ mode: 'dry-run', tenantId, products: rows.length, changes: changes.map((item) => item.slug) }))
  process.exit(0)
}
for (const item of changes) {
  const target = new URL(base)
  target.searchParams.set('tenant_id', `eq.${tenantId}`)
  target.searchParams.set('id', `eq.${item.id}`)
  const write = await fetch(target, { method: 'PATCH', headers: { ...headers, 'content-type': 'application/json', prefer: 'return=representation' }, body: JSON.stringify({ specs: item.specs }) })
  if (!write.ok) throw new Error(`Product update HTTP ${write.status}: ${item.slug}`)
  const [updated] = await write.json()
  if (!updated || !sameSpecs(updated.specs, item.specs)) throw new Error(`Product readback failed: ${item.slug}`)
}
console.log(JSON.stringify({ mode: 'applied', tenantId, updated: changes.length, withSourceParameters: catalog.filter((item) => item.specifications.length > 1).length }))
