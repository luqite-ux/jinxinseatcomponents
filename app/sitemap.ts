import type { MetadataRoute } from 'next'
import { getPublishedArticles } from '@/lib/articles-db'
import { fetchProductsData } from '@/lib/products-db'
import { site } from '@/lib/site'
import { localePath } from '@/lib/i18n'
import { getEnabledLocales } from '@/lib/site-locales'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['/', '/products', '/applications', '/manufacturing', '/about', '/news', '/contact']
  const [products, articles, enabled] = await Promise.all([
    fetchProductsData({ pageSize: 1000, locale: 'en' }),
    getPublishedArticles('en'),
    getEnabledLocales(),
  ])
  const paths = [
    ...staticPaths.map((path) => ({ path, lastModified: undefined as string | undefined })),
    ...products.items.map((product) => ({ path: `/products/${product.slug}`, lastModified: product.updatedAt || undefined })),
    ...articles.map((article) => ({ path: `/news/${article.slug}`, lastModified: article.publishedAt || undefined })),
  ]
  return paths.flatMap(({ path, lastModified }) => {
    const languages = Object.fromEntries(enabled.map(locale => [locale, `${site.url}${localePath(path, locale)}`]))
    if (enabled.length > 1) languages['x-default'] = `${site.url}${path}`
    return enabled.map(locale => ({
      url: `${site.url}${localePath(path, locale)}`,
      lastModified,
      ...(enabled.length > 1 ? { alternates: { languages } } : {}),
    }))
  })
}
