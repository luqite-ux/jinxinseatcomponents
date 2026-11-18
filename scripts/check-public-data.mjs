import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).map((line) => line.split(/=(.*)/s).slice(0,2)).filter((pair) => pair.length === 2))
const url = new URL(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products`)
url.searchParams.set('tenant_id', `eq.${env.NEXT_PUBLIC_TENANT_ID}`)
url.searchParams.set('is_active', 'eq.true')
url.searchParams.set('select', 'id,slug,image_url')
const response = await fetch(url, { headers: { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY, authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}` } })
const data = response.ok ? await response.json() : []
console.log(JSON.stringify({ status: response.status, count: data.length, images: data.filter((item) => item.image_url).length }))
if (!response.ok || data.length !== 77) process.exitCode = 1
