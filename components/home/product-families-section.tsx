import { CategoryCard } from '@/components/products/category-card'
import { SectionHeading } from '@/components/site/section-heading'
import { getCategories } from '@/lib/products'

export function ProductFamiliesSection() {
  const categories = getCategories().filter((category) => !category.parentSlug)
  return (
    <section id="product-families" aria-labelledby="product-families-heading" className="bg-paper">
      <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <SectionHeading
          id="product-families-heading"
          eyebrow="Product families"
          title="Three families, one seat"
          description="Start with the family that matches your program, then open individual products to inspect specifications."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {categories.map((category, i) => (
            <CategoryCard key={category.slug} category={category} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
