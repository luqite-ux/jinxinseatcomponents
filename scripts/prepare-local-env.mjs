import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const adminRoot = String.raw`D:\Cursor\Grand\huanqiu-admin`
const env = {}
for (const file of ['.env', '.env.local']) {
  const path = join(adminRoot, file)
  if (!existsSync(path)) continue
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][\w]*)=(.*)$/)
    if (match) env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
  }
}
const identity = JSON.parse(readFileSync('.codex-delivery/tenant-identity.json', 'utf8'))
const keys = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']
for (const key of keys) if (!env[key]) throw Error(`Missing ${key}`)
const previous = existsSync('.env.local') ? Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).map((line) => line.split(/=(.*)/s).slice(0, 2)).filter((row) => row.length === 2)) : {}
const values = Object.fromEntries(keys.map((key) => [key, env[key]]))
Object.assign(values, {
  NEXT_PUBLIC_TENANT_ID: identity.tenantId,
  NEXT_PUBLIC_ADMIN_URL: 'https://admin.globle-trade.com',
  CAPTCHA_SITE_SCOPE: `jinxinseatcomponents-${identity.tenantId}`,
  CAPTCHA_SECRET: previous.CAPTCHA_SECRET || randomBytes(48).toString('base64url'),
})
writeFileSync('.env.local', Object.entries(values).map(([key, value]) => `${key}=${value}`).join('\n') + '\n')
console.log(`Prepared ignored local environment (${Object.keys(values).length} keys) for tenant ${identity.tenantId}`)
