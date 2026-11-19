import { getCategories, getProducts, getProduct, getRelatedProducts, type Category, type CategorySlug, type Product } from '@/lib/products'
import { defaultLocale, pickLocalized } from '@/lib/i18n'

type DbProduct = {
  id: string
  slug: string
  updated_at: string | null
  name_i18n: Record<string, string> | null
  description_i18n: Record<string, string> | null
  specs: Record<string, string> | null
  image_url: string | null
  extra_data: { images?: string[]; source_row?: number; subcategory?: string } | null
  category_slug: string | null
  sort_order: number | null
}

type DbCategory = {
  id: string
  slug: string
  parent_id: string | null
  name_i18n: Record<string, string> | null
  description_i18n: Record<string, string> | null
  icon: string | null
  sort_order: number | null
  extra_data: { tagline_i18n?: Record<string, string>; image_alt_i18n?: Record<string, string> } | null
}

export async function fetchCategoriesData(locale: string = defaultLocale): Promise<Category[]> {
  const fallback = getCategories(locale)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const tenant = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!url || !key || !tenant) return fallback
  const query = new URL(`${url}/rest/v1/product_categories`)
  query.searchParams.set('tenant_id', `eq.${tenant}`)
  query.searchParams.set('is_active', 'eq.true')
  query.searchParams.set('select', 'id,slug,parent_id,name_i18n,description_i18n,icon,sort_order,extra_data')
  query.searchParams.set('order', 'sort_order.asc,id.asc')
  query.searchParams.set('limit', '1000')
  try {
    const response = await fetch(query, { headers: { apikey: key, authorization: `Bearer ${key}` }, next: { revalidate: 60 } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const rows = await response.json() as DbCategory[]
    if (!rows.length) return fallback
    const byId = new Map(rows.map(row => [row.id, row]))
    const sourceDimensions = new Map(fallback.map(category => [category.slug, category.image]))
    return rows.map(row => {
      const name = pickLocalized(row.name_i18n ?? undefined, locale) || row.slug
      const dimensions = sourceDimensions.get(row.slug as CategorySlug)
      return {
        slug: row.slug as CategorySlug,
        parentSlug: (row.parent_id ? byId.get(row.parent_id)?.slug : undefined) as CategorySlug | undefined,
        name,
        tagline: pickLocalized(row.extra_data?.tagline_i18n, locale) || name,
        description: pickLocalized(row.description_i18n ?? undefined, locale) || name,
        image: {
          src: row.icon || '/brand/jx-logo.png',
          width: dimensions?.width ?? 1800,
          height: dimensions?.height ?? 1200,
          alt: pickLocalized(row.extra_data?.image_alt_i18n, locale) || name,
        },
      }
    })
  } catch {
    return fallback
  }
}

async function fetchRows(): Promise<DbProduct[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const tenant = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!url || !key || !tenant) return null
  const query = new URL(`${url}/rest/v1/products`)
  query.searchParams.set('tenant_id', `eq.${tenant}`)
  query.searchParams.set('is_active', 'eq.true')
  query.searchParams.set('select', 'id,slug,updated_at,name_i18n,description_i18n,specs,image_url,extra_data,category_slug,sort_order')
  query.searchParams.set('order', 'sort_order.asc')
  query.searchParams.set('limit', '1000')
  try {
    const response = await fetch(query, { headers: { apikey: key, authorization: `Bearer ${key}` }, next: { revalidate: 60 } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json() as DbProduct[]
  } catch {
    return null
  }
}

function localize(row: DbProduct, locale: string, categories: Category[]): Product {
  const category = categories.find((item) => item.slug === (row.extra_data?.subcategory ?? row.category_slug))
  const name = pickLocalized(row.name_i18n ?? undefined, locale) || row.slug
  const summary = pickLocalized(row.description_i18n ?? undefined, locale) || name
  const sourceImages = Array.isArray(row.extra_data?.images) ? row.extra_data.images : []
  const urls = [...new Set([row.image_url, ...sourceImages].filter((value): value is string => Boolean(value)))]
  return {
    id: row.id,
    slug: row.slug,
    updatedAt: row.updated_at ?? undefined,
    categorySlug: category?.slug ?? 'seat-assemblies',
    parentCategorySlug: (row.category_slug as Product['parentCategorySlug']) ?? undefined,
    categoryName: category?.name ?? 'Products',
    name,
    summary,
    images: urls.map((src) => ({ src, width: 1800, height: 1200, alt: `${name} product photo` })),
    specifications: Object.entries(row.specs ?? {}).map(([label, value]) => ({ label: label.replace(/^\d+\.\s*/, ''), value: String(value) })),
    applications: [],
    featured: [7,17,45,65].includes(row.extra_data?.source_row ?? 0),
  }
}

export async function fetchProductsData(options: { category?: string; page?: number; pageSize?: number; locale?: string } = {}) {
  const { category, page = 1, pageSize = 24, locale = defaultLocale } = options
  const [rows, categories] = await Promise.all([fetchRows(), fetchCategoriesData(locale)])
  if (!rows) return { ...getProducts(options), source: 'fallback' as const }
  const all = rows.filter((row) => !category || row.category_slug === category || row.extra_data?.subcategory === category)
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  return { items: all.slice((safePage - 1) * pageSize, safePage * pageSize).map((row) => localize(row, locale, categories)), total: all.length, totalPages, page: safePage, source: 'backend' as const }
}

export async function fetchProductBySlug(slug: string, locale = defaultLocale) {
  const [rows, categories] = await Promise.all([fetchRows(), fetchCategoriesData(locale)])
  if (!rows) return getProduct(slug, locale)
  const row = rows.find((item) => item.slug === slug)
  return row ? localize(row, locale, categories) : undefined
}

export async function fetchFeaturedProducts(limit = 4, locale = defaultLocale) {
  const [rows, categories] = await Promise.all([fetchRows(), fetchCategoriesData(locale)])
  if (!rows) return getProducts({ pageSize: 77, locale }).items.filter((item) => item.featured).slice(0, limit)
  return rows.filter((row) => [7,17,45,65].includes(row.extra_data?.source_row ?? 0)).slice(0, limit).map((row) => localize(row, locale, categories))
}

export async function fetchRelatedProducts(product: Product, limit = 3, locale = defaultLocale) {
  const [rows, categories] = await Promise.all([fetchRows(), fetchCategoriesData(locale)])
  if (!rows) return getRelatedProducts(product, limit, locale)
  return rows.filter((row) => (row.extra_data?.subcategory ?? row.category_slug) === product.categorySlug && row.slug !== product.slug).slice(0, limit).map((row) => localize(row, locale, categories))
}
