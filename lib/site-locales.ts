import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { defaultLocale, localePath, supportedLocaleCodes } from '@/lib/i18n'
import { site } from '@/lib/site'

export const getEnabledLocales = cache(async (): Promise<string[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '')
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !tenantId || !key) throw new Error('Tenant locale configuration is missing')
  const query = new URL(`${url}/rest/v1/tenants`)
  query.searchParams.set('id', `eq.${tenantId}`)
  query.searchParams.set('select', 'default_language,supported_languages')
  const response = await fetch(query, { headers: { apikey: key, authorization: `Bearer ${key}` }, next: { revalidate: 60 } })
  if (!response.ok) throw new Error(`Tenant locale configuration HTTP ${response.status}`)
  const rows = await response.json() as { default_language: string; supported_languages: string[] }[]
  if (rows.length !== 1 || !Array.isArray(rows[0].supported_languages)) throw new Error('Tenant locale configuration is invalid')
  const enabled = rows[0].supported_languages.filter(code => (supportedLocaleCodes as readonly string[]).includes(code))
  if (!enabled.includes(defaultLocale) || rows[0].default_language !== defaultLocale) throw new Error('Tenant default locale is invalid')
  return enabled
})

export async function getRequestLocale(): Promise<string> {
  const candidate = (await headers()).get('x-hq-locale') || defaultLocale
  if (candidate === defaultLocale) return candidate
  if (!(await getEnabledLocales()).includes(candidate)) notFound()
  return candidate
}

export async function getLocaleAlternates(path: string) {
  const [locale, enabled] = await Promise.all([getRequestLocale(), getEnabledLocales()])
  const languages = Object.fromEntries(enabled.map(code => [code, `${site.url}${localePath(path, code)}`]))
  if (enabled.length > 1) languages['x-default'] = `${site.url}${path}`
  return { canonical: localePath(path, locale), ...(enabled.length > 1 ? { languages } : {}) }
}
