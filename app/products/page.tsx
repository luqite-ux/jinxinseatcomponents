import type { Metadata } from 'next'
import Link from 'next/link'
import { PackageSearch } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/product-filters'
import { PageHeader } from '@/components/site/page-header'
import { getCategories, getCategory } from '@/lib/products'
import { fetchProductsData } from '@/lib/products-db'

export const revalidate = 60
import { buttonPrimary } from '@/lib/site'

type SearchParams = Promise<{ category?: string | string[]; page?: string | string[] }>

const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category } = await searchParams
  const current = getCategory(first(category))
  return {
    title: current ? current.name : 'Products',
    description: current
      ? `${current.name}: ${current.description}`
      : 'Seat assemblies, seat frames and molded foam components from Zhoushan Jinxin Auto Parts.',
    alternates: { canonical: current ? `/products?category=${current.slug}` : '/products' },
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const categories = getCategories()
  const current = getCategory(first(params.category))
  const page = Number.parseInt(first(params.page) ?? '1', 10) || 1
  const { items, total, totalPages, page: safePage } = await fetchProductsData({ category: current?.slug, page })
  const base = current ? `/products?category=${current.slug}&` : '/products?'

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={current ? current.name : 'Seat assemblies, frames and molded foam'}
        description={
          current
            ? current.description
            : 'Choose a product family, then open a product to inspect its specifications and send an inquiry.'
        }
        crumbs={current ? [{ label: 'Products', href: '/products' }, { label: current.name }] : [{ label: 'Products' }]}
      />

      <section aria-labelledby="product-list-heading" className="mx-auto max-w-[88rem] px-5 py-12 md:px-10 md:py-16">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 id="product-list-heading" className="text-2xl font-semibold tracking-tight">
            {current ? current.name : 'All products'}
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
            <h3 className="mt-4 text-lg font-semibold">No products in this family yet</h3>
            <p className="mt-2 max-w-md text-sm text-ink-soft">
              Tell us what you are looking for and we will respond with what fits.
            </p>
            <Link href="/contact" className={`${buttonPrimary} mt-6`}>
              Send your requirements
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
