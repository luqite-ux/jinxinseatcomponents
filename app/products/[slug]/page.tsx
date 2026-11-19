import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { ProductGallery } from '@/components/products/product-gallery'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { getAllProductSlugs } from '@/lib/products'
import { fetchProductBySlug, fetchRelatedProducts } from '@/lib/products-db'
import { buttonPrimary, buttonSecondary, site } from '@/lib/site'

type Params = Promise<{ slug: string }>
export const revalidate = 60
export const dynamicParams = true

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      title: product.name,
      description: product.summary,
      url: `${site.url}/products/${product.slug}`,
      images: product.images[0] ? [{ url: product.images[0].src, alt: product.images[0].alt }] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) notFound()

  const related = await fetchRelatedProducts(product)
  const inquiryHref = `/contact?product=${encodeURIComponent(product.slug)}&subject=${encodeURIComponent(product.name)}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${site.url}/products/${product.slug}#product`,
    name: product.name,
    description: product.summary,
    image: product.images.map((i) => i.src.startsWith('http') ? i.src : `${site.url}${i.src}`),
    category: product.categoryName,
    brand: { '@type': 'Brand', name: site.shortName },
    manufacturer: { '@type': 'Organization', name: site.name, url: site.url },
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${site.url}/products/${product.slug}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${site.url}/products` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${site.url}/products/${product.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />
      <PageHeader
        eyebrow={product.categoryName}
        title={product.name}
        crumbs={[
          { label: 'Products', href: '/products' },
          { label: product.categoryName, href: `/products?category=${product.categorySlug}` },
          { label: product.name },
        ]}
        backdrop={false}
      />

      <section aria-label="Product overview" className="bg-white">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-10 md:px-10 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <ProductGallery images={product.images} />
          </Reveal>

          <div>
            <Reveal index={1}>
              <p className="text-lg leading-relaxed text-ink-soft">{product.summary}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={inquiryHref} className={buttonPrimary}>
                  Request a quote for this product
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <Link href={`/products?category=${product.categorySlug}`} className={buttonSecondary}>
                  More {product.categoryName}
                </Link>
              </div>
            </Reveal>

            <Reveal index={2} as="div" className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight">Specifications</h2>
              {product.specifications.length > 0 ? (
                <table className="mt-4 w-full border-collapse border-y border-line text-left text-sm">
                  <caption className="sr-only">{product.name} specifications</caption>
                  <tbody>
                    {product.specifications.map((row) => (
                      <tr key={row.label} className="border-b border-line last:border-b-0">
                        <th scope="row" className="w-2/5 bg-mist px-4 py-3 align-top font-medium">
                          {row.label}
                        </th>
                        <td className="px-4 py-3 align-top text-ink-soft">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">Specifications for this product are available on request.</p>
              )}
            </Reveal>

            {product.applications.length > 0 && (
              <Reveal index={3} as="div" className="mt-10">
                <h2 className="text-xl font-semibold tracking-tight">Application and use</h2>
                <ul className="mt-4 space-y-2.5">
                  {product.applications.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-ink-soft">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-jx" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-line bg-mist/60">
          <div className="mx-auto max-w-[88rem] px-5 py-14 md:px-10 md:py-20">
            <SectionHeading id="related-heading" eyebrow="Related" title={`More ${product.categoryName}`} />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <ProductCard key={item.id} product={item} index={i} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
