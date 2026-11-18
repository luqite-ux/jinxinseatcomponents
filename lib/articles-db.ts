import { defaultLocale, pickLocalized } from '@/lib/i18n'
import type { Article } from '@/lib/news'

type DbArticle = {
  slug: string
  title_i18n: Record<string, string> | null
  excerpt_i18n: Record<string, string> | null
  content_i18n: Record<string, string> | null
  featured_image: string | null
  published_at: string | null
  updated_at: string | null
}

function toArticle(row: DbArticle, locale: string): Article {
  const title = pickLocalized(row.title_i18n ?? undefined, locale) || row.slug
  const content = pickLocalized(row.content_i18n ?? undefined, locale) ?? ''
  const body = content
    .replace(/<\s*\/(?:p|div|h[1-6]|li)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
  return {
    slug: row.slug,
    title,
    excerpt: pickLocalized(row.excerpt_i18n ?? undefined, locale) ?? '',
    body,
    publishedAt: row.published_at ?? row.updated_at ?? '',
    coverImage: row.featured_image
      ? { src: row.featured_image, width: 1600, height: 900, alt: title }
      : undefined,
  }
}

export async function getPublishedArticles(locale = defaultLocale): Promise<Article[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const tenant = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!base || !key || !tenant) return []
  const url = new URL(`${base}/rest/v1/articles`)
  url.searchParams.set('tenant_id', `eq.${tenant}`)
  url.searchParams.set('is_published', 'eq.true')
  url.searchParams.set('select', 'slug,title_i18n,excerpt_i18n,content_i18n,featured_image,published_at,updated_at')
  url.searchParams.set('order', 'published_at.desc.nullslast')
  url.searchParams.set('limit', '1000')
  try {
    const response = await fetch(url, { headers: { apikey: key, authorization: `Bearer ${key}` }, next: { revalidate: 60 } })
    if (!response.ok) throw new Error(`articles HTTP ${response.status}`)
    return ((await response.json()) as DbArticle[]).map((row) => toArticle(row, locale))
  } catch {
    return []
  }
}

export async function getPublishedArticle(slug: string, locale = defaultLocale): Promise<Article | undefined> {
  return (await getPublishedArticles(locale)).find((article) => article.slug === slug)
}
