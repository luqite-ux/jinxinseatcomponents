import type { Metadata } from 'next'
import Link from '@/components/site/locale-link'
import { PackageSearch } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { PageHeader } from '@/components/site/page-header'
import { fetchCategoriesData, fetchProductsData } from '@/lib/products-db'
import { siteCopy } from '@/lib/site-content/copy'
import { getEditablePage } from '@/lib/site-content/page-data'
import { siteContentMetadata } from '@/lib/site-content/site-content'
import { getLocaleAlternates } from '@/lib/site-locales'

export const revalidate = 60
import { buttonPrimary, site } from '@/lib/site'
import { getRequestLocale } from '@/lib/site-locales'
import { localePath } from '@/lib/i18n'

type SearchParams = Promise<{ category?: string | string[]; page?: string | string[] }>

const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category } = await searchParams
  const categories = await fetchCategoriesData()
  const current = categories.find((item) => item.slug === first(category))
  const contentMetadata = current ? {} : await siteContentMetadata('/products')
  const path = current ? `/products?category=${current.slug}` : '/products'
  const locale = await getRequestLocale()
  return {
    title: current ? current.name : 'Products',
    description: current
      ? `${current.name}: ${current.description}`
      : 'Seat assemblies, seat frames and molded foam components from Zhoushan Jinxin Auto Parts.',
    alternates: await getLocaleAlternates(path),
    openGraph: { type: 'website', title: current?.name ?? 'Products', description: current?.description ?? 'Seat assemblies, seat frames and molded foam components.', url: `${site.url}${localePath(path, locale)}`, images: [{ url: '/catalog/cutouts/product-row-7.webp', alt: 'Automotive seat assembly' }] },
    ...contentMetadata,
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const categories = await fetchCategoriesData()
  const current = categories.find((item) => item.slug === first(params.category))
  const page = Number.parseInt(first(params.page) ?? '1', 10) || 1
  const { items, total, totalPages, page: safePage } = await fetchProductsData({ category: current?.slug, page })
  const base = current ? `/products?category=${current.slug}&` : '/products?'
  const editablePage = await getEditablePage('/products')
  const intro = current ? undefined : editablePage.module('intro')
  const copy = editablePage.module('copy')?.values

  return (
    <>
      <PageHeader
        eyebrow={siteCopy(intro?.values, 'eyebrow', 'Products')}
        title={current ? current.name : siteCopy(intro?.values, 'title', 'Seat assemblies, frames and molded foam')}
        description={
          current
            ? current.description
            : siteCopy(intro?.values, 'description', 'Choose a product family, then open a product to inspect its specifications and send an inquiry.')
        }
        styles={intro?.styles}
        contentVersion={intro ? editablePage.version : undefined}
        crumbs={current ? [{ label: 'Products', href: '/products' }, { label: current.name }] : [{ label: 'Products' }]}
        schemaPath={current ? `/products?category=${current.slug}` : '/products'}
      />

      <section aria-labelledby="product-list-heading" className="mx-auto max-w-[88rem] px-5 py-12 md:px-10 md:py-16">
        <div className="flex flex-col gap-6">
          <h2 id="product-list-heading" className="text-2xl font-semibold tracking-tight">
            {current ? current.name : siteCopy(copy, 'all_products', 'All products')}
            <span className="ml-3 font-mono text-sm font-normal text-ink-soft">{total}</span>
          </h2>
          <ProductFilters categories={categories} active={current?.slug} />
        </div>

        {items.length > 0 ? (
          <>
            <ul key={`${current?.slug ?? 'all'}-${safePage}`} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i % 3} />
              ))}
            </ul>
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={`${base}page=${n}`}
                    aria-current={n === safePage ? 'page' : undefined}
                    className={`inline-flex size-11 items-center justify-center rounded-sm border text-sm font-semibold transition-colors ${
                      n === safePage ? 'border-jx bg-jx text-white' : 'border-line bg-white hover:border-ink'
                    }`}
                  >
                    {n}
                  </Link>
                ))}
              </nav>
            )}
          </>
        ) : (
          <div className="mt-8 flex flex-col items-center border border-dashed border-line bg-white px-6 py-16 text-center">
            <PackageSearch aria-hidden className="size-10 text-ink-soft" />
            <h3 className="mt-4 text-lg font-semibold">{siteCopy(copy, 'empty_title', 'No products in this family yet')}</h3>
            <p className="mt-2 max-w-md text-sm text-ink-soft">
              {siteCopy(copy, 'empty_description', 'Tell us what you are looking for and we will respond with what fits.')}
            </p>
            <Link href="/contact" className={`${buttonPrimary} mt-6`}>
              {siteCopy(copy, 'empty_cta', 'Send your requirements')}
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
