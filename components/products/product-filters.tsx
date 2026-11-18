import Link from 'next/link'
import type { Category } from '@/lib/products'
import { cn } from '@/lib/utils'

export function ProductFilters({ categories, active }: { categories: Category[]; active?: string }) {
  const items = [{ slug: '', name: 'All products', href: '/products' }].concat(
    categories.map((c) => ({ slug: c.slug, name: c.name, href: `/products?category=${c.slug}` })),
  )

  return (
    <nav aria-label="Filter products by family" className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <ul className="flex gap-2 pb-1">
        {items.map((item) => {
          const selected = (active ?? '') === item.slug
          return (
            <li key={item.slug || 'all'} className="shrink-0">
              <Link
                href={item.href}
                scroll={false}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-sm border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97]',
                  selected
                    ? 'border-jx bg-jx text-white'
                    : 'border-line bg-white text-ink hover:border-ink hover:bg-mist',
                )}
              >
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
