import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductImageFrame } from '@/components/products/product-card'
import { Reveal } from '@/components/site/reveal'
import type { Category } from '@/lib/products'

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <Reveal as="li" index={index} className="list-none">
      <Link
        href={`/products?category=${category.slug}`}
        className="group flex h-full flex-col border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-ink/40 hover:shadow-[0_18px_36px_-24px_rgba(23,25,30,0.45)]"
      >
        <ProductImageFrame
          src={category.image.src}
          alt={category.image.alt}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="aspect-[4/3]"
        />
        <div className="flex flex-1 flex-col gap-2 border-t border-line p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">{category.tagline}</p>
          <h3 className="text-xl font-semibold tracking-tight">{category.name}</h3>
          <p className="text-sm leading-relaxed text-ink-soft">{category.description}</p>
          <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold">
            Browse {category.name}
            <ArrowRight
              aria-hidden
              className="size-4 text-jx transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}
