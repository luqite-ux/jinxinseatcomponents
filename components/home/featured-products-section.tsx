import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { fetchFeaturedProducts } from '@/lib/products-db'
import { buttonSecondary } from '@/lib/site'
import { siteCopy, type EditableSectionProps } from '@/lib/site-content/copy'

export async function FeaturedProductsSection({ content, styles }: EditableSectionProps = {}) {
  const products = await fetchFeaturedProducts(4)
  return (
    <section id="featured-products" aria-labelledby="featured-products-heading" className="border-y border-line bg-mist/60">
      <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="featured-products-heading"
            eyebrow={siteCopy(content, 'eyebrow', 'Featured products')}
            title={siteCopy(content, 'title', 'Look closely at the parts')}
            description={siteCopy(content, 'description', 'Every product page lists its own specification table and a direct route to a quote request.')}
            styles={styles}
          />
          <Reveal index={2}>
            <Link href="/products" className={buttonSecondary}>
              View all products
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
