import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  .split(/\r?\n/).map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/)).filter(Boolean)
  .map((match) => [match[1], match[2].trim().replace(/^['"]|['"]$/g, '')]))
const tenantId = env.NEXT_PUBLIC_TENANT_ID
if (tenantId !== 'd189a65a-480c-4800-ab12-ac21a9d724d7') throw new Error('Unexpected tenant')
const row = { tenant_id: tenantId, kind: 'faq', content_key: '*', page_path: '/', label: 'Procurement questions', is_enabled: true }
const endpoint = `${env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, '')}/rest/v1/tenant_content_scopes`
const headers = { apikey: env.SUPABASE_SERVICE_ROLE_KEY, authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
const write = await fetch(`${endpoint}?on_conflict=tenant_id,kind,content_key,page_path`, {
  method: 'POST', headers: { ...headers, 'content-type': 'application/json', prefer: 'resolution=merge-duplicates' }, body: JSON.stringify(row),
})
if (!write.ok) throw new Error(`Scope write HTTP ${write.status}`)
const query = new URL(endpoint)
for (const [key, value] of Object.entries({ tenant_id: tenantId, kind: 'faq', content_key: '*', page_path: '/' })) query.searchParams.set(key, `eq.${value}`)
query.searchParams.set('select', 'kind,content_key,page_path,label,is_enabled')
const read = await fetch(query, { headers })
if (!read.ok) throw new Error(`Scope read HTTP ${read.status}`)
const [scope] = await read.json()
if (!scope?.is_enabled) throw new Error('Scope readback failed')
console.log(JSON.stringify({ tenantId, scope }))
