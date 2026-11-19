import { CategoryCard } from '@/components/products/category-card'
import { SectionHeading } from '@/components/site/section-heading'
import { fetchCategoriesData } from '@/lib/products-db'
import { siteCopy, type EditableSectionProps } from '@/lib/site-content/copy'

export async function ProductFamiliesSection({ content, styles }: EditableSectionProps = {}) {
  const categories = (await fetchCategoriesData()).filter((category) => !category.parentSlug)
  return (
    <section id="product-families" aria-labelledby="product-families-heading" className="bg-paper">
      <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <SectionHeading
          id="product-families-heading"
          eyebrow={siteCopy(content, 'eyebrow', 'Product families')}
          title={siteCopy(content, 'title', 'Three families, one seat')}
          description={siteCopy(content, 'description', 'Start with the family that matches your program, then open individual products to inspect specifications.')}
          styles={styles}
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
