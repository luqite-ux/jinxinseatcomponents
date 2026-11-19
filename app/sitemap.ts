import type { MetadataRoute } from 'next'
import { getPublishedArticles } from '@/lib/articles-db'
import { fetchProductsData } from '@/lib/products-db'
import { site } from '@/lib/site'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['/', '/products', '/applications', '/manufacturing', '/about', '/news', '/contact']
  const [products, articles] = await Promise.all([
    fetchProductsData({ pageSize: 1000 }),
    getPublishedArticles(),
  ])
  return [
    ...staticPaths.map((path) => ({ url: `${site.url}${path}` })),
    ...products.items.map((product) => ({ url: `${site.url}/products/${product.slug}`, lastModified: product.updatedAt || undefined })),
    ...articles.map((article) => ({ url: `${site.url}/news/${article.slug}`, lastModified: article.publishedAt || undefined })),
  ]
}
