import { defaultLocale, text, type Localized } from '@/lib/i18n'

export type ArticleRecord = {
  id: string
  slug: string
  title: Localized
  excerpt: Localized
  body: Localized<string[]>
  publishedAt: string
  coverImage?: { src: string; width: number; height: number; alt: Localized }
}

export type Article = {
  slug: string
  title: string
  excerpt: string
  body: string[]
  publishedAt: string
  coverImage?: { src: string; width: number; height: number; alt: string }
}

/** Populated from the admin back end. Empty until articles are published. */
const articleRecords: ArticleRecord[] = []

function localize(record: ArticleRecord, locale: string): Article {
  const body = record.body[locale] ?? record.body[defaultLocale] ?? Object.values(record.body)[0] ?? []
  return {
    slug: record.slug,
    title: text(record.title, locale),
    excerpt: text(record.excerpt, locale),
    body,
    publishedAt: record.publishedAt,
    coverImage: record.coverImage
      ? { ...record.coverImage, alt: text(record.coverImage.alt, locale) }
      : undefined,
  }
}

export function getArticles(locale: string = defaultLocale): Article[] {
  return [...articleRecords]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((a) => localize(a, locale))
}

export function getArticle(slug: string, locale: string = defaultLocale): Article | undefined {
  const record = articleRecords.find((a) => a.slug === slug)
  return record ? localize(record, locale) : undefined
}
