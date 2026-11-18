import Image from 'next/image'
import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { CurrentYear } from '@/components/site/current-year'
import { getCategories } from '@/lib/products'
import { navItems, site } from '@/lib/site'

export function SiteFooter() {
  const categories = getCategories().filter((category) => !category.parentSlug)

  return (
    <footer className="border-t border-line bg-mist">
      <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label={`${site.name} - Home`}>
            <Image src="/brand/jx-logo.png" alt="" width={56} height={45} className="h-10 w-auto" />
            <span className="text-base font-semibold tracking-tight">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            Automotive seat assemblies, seat frames and molded foam components.
          </p>
          <p className="mt-2 text-sm text-ink-soft" lang="zh-Hans">
            {site.nameZh}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-jx-deep">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Product families">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">Products</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="transition-colors hover:text-jx-deep"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="transition-colors hover:text-jx-deep">
                All products
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-jx-deep" />
              <a href={`mailto:${site.email}`} className="break-all transition-colors hover:text-jx-deep">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-jx-deep" />
              <address className="not-italic leading-relaxed text-ink-soft">
                {site.address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[88rem] px-5 py-5 text-xs text-ink-soft md:px-10">
          &copy; <CurrentYear /> Zhoushan Jinxin Auto Parts Co., Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
