import Link from '@/components/site/locale-link'
import type { Category } from '@/lib/products'
import { cn } from '@/lib/utils'

export function ProductFilters({ categories, active }: { categories: Category[]; active?: string }) {
  const roots = categories.filter((category) => !category.parentSlug)
  const groups = roots.map((root) => ({ root, children: categories.filter((category) => category.parentSlug === root.slug) }))
  const link = (slug: string, name: string) => {
    const selected = (active ?? '') === slug
    return (
      <Link
        key={slug || 'all'} href={slug ? `/products?category=${slug}` : '/products'} scroll={false}
        aria-current={selected ? 'page' : undefined}
        className={cn(
          'inline-flex min-h-11 shrink-0 items-center rounded-sm border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97]',
          selected ? 'border-jx bg-jx text-white' : 'border-line bg-white text-ink hover:border-ink hover:bg-mist',
        )}
      >{name}</Link>
    )
  }

  return (
    <nav aria-label="Filter products by family" className="w-full space-y-3">
      <div className="flex flex-wrap gap-2 pb-1">
        {link('', 'All products')}
        {roots.map((root) => link(root.slug, root.name))}
      </div>
      <div className="grid gap-2 border-t border-line pt-3 lg:grid-cols-3 lg:gap-5">
        {groups.map(({ root, children }) => (
          <div key={root.slug} className="min-w-0">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">{root.name}</p>
            <div className="flex flex-wrap gap-2 pb-1">
              {children.map((child) => link(child.slug, child.name))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  )
}
