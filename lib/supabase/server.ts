import 'server-only'

export function backendConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!url || !key || !tenantId || !/^[a-f0-9-]{36}$/i.test(tenantId)) throw new Error('Backend is not configured')
  if (new URL(url).protocol !== 'https:') throw new Error('HTTPS backend required')
  return { url, key, tenantId }
}

export async function adminRequest(table: string, query: Record<string, string>, method = 'GET', body?: unknown): Promise<unknown> {
  const { url, key } = backendConfig()
  const target = new URL(`/rest/v1/${table}`, url)
  for (const [name, value] of Object.entries(query)) target.searchParams.set(name, value)
  const response = await fetch(target, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    redirect: 'error',
  })
  if (!response.ok) throw new Error(`Backend request failed: ${response.status}`)
  return response.status === 204 || method !== 'GET' ? null : response.json()
}
