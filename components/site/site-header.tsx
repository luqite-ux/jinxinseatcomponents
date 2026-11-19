'use client'

import Image from 'next/image'
import Link from '@/components/site/locale-link'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, Menu } from 'lucide-react'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { navItems as defaultNavItems, site, type NavItem } from '@/lib/site'
import { cn } from '@/lib/utils'
import { siteTypographyStyle } from '@/lib/site-content/typography'
import { localePath } from '@/lib/i18n'
import { useEnabledLocales, useSiteLocale } from './locale-provider'

function isActive(pathname: string, href: string) {
  const path = href.split('?')[0]
  return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
}

export function SiteHeader({ items, styles }: { items?: NavItem[]; styles?: Record<string, Record<string, unknown>> }) {
  const navItems = items ?? defaultNavItems
  const linkStyle = (item: NavItem) => item.id ? siteTypographyStyle(styles, `links.${item.id}.label`, { 'site-sans': 'var(--font-geist-sans)' }) : undefined
  const pathname = usePathname()
  const locale = useSiteLocale()
  const enabledLocales = useEnabledLocales()
  const activePath = locale === 'en' ? pathname : pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/'
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-6 px-5 md:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} - Home`}>
          <Image src="/brand/jx-logo.png" alt="" width={44} height={35} priority className="h-8 w-auto" />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-tight">Zhoushan Jinxin</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">Auto Parts</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(activePath, item.href)
              if (item.children) {
                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      style={linkStyle(item)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'hq-typography relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-jx-deep',
                        active && 'text-jx-deep',
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden
                        className="size-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-x-3 -bottom-px h-0.5 origin-left scale-x-0 bg-jx transition-transform duration-200 group-hover:scale-x-100',
                          active && 'scale-x-100',
                        )}
                      />
                    </Link>
                    <div className="invisible absolute left-0 top-full w-72 translate-y-1 border border-line bg-white p-2 opacity-0 shadow-[0_18px_40px_-20px_rgba(23,25,30,0.35)] transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-sm px-3 py-2.5 transition-colors hover:bg-mist"
                            >
                              <span className="block text-sm font-semibold">{child.label}</span>
                              <span className="block text-xs text-ink-soft">{child.description}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )
              }
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    style={linkStyle(item)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'hq-typography group/link relative block px-3 py-2 text-sm font-medium transition-colors hover:text-jx-deep',
                      active && 'text-jx-deep',
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-x-3 -bottom-px h-0.5 origin-left scale-x-0 bg-jx transition-transform duration-200 group-hover/link:scale-x-100',
                        active && 'scale-x-100',
                      )}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {enabledLocales.length > 1 && (
            <nav aria-label="Language" className="flex items-center gap-1 text-xs font-semibold uppercase">
              {enabledLocales.map(code => (
                <NextLink key={code} href={localePath(activePath, code)} hrefLang={code}
                  aria-current={code === locale ? 'page' : undefined}
                  className={cn('rounded-sm px-2 py-2 hover:text-jx-deep', code === locale ? 'text-jx-deep' : 'text-ink-soft')}>
                  {code}
                </NextLink>
              ))}
            </nav>
          )}
          <Link
            href="/contact"
            className="hidden rounded-sm bg-jx px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-jx-deep sm:inline-flex"
          >
            Request a Quote
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-sm border border-line bg-white transition-colors hover:bg-mist lg:hidden"
                aria-label="Open menu"
              >
                <Menu aria-hidden className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto bg-paper p-0">
              <SheetHeader className="border-b border-line p-5">
                <SheetTitle className="text-left text-base">Menu</SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="p-3">
                <ul>
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          style={linkStyle(item)}
                          aria-current={isActive(activePath, item.href) ? 'page' : undefined}
                          className={cn(
                            'hq-typography flex min-h-12 items-center rounded-sm px-3 text-base font-medium transition-colors hover:bg-mist',
                            isActive(activePath, item.href) && 'text-jx-deep',
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                      {item.children && (
                        <ul className="mb-2 ml-3 border-l border-line">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <SheetClose asChild>
                                <Link
                                  href={child.href}
                                  className="flex min-h-11 items-center px-4 text-sm text-ink-soft transition-colors hover:text-jx-deep"
                                >
                                  {child.label}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
                <SheetClose asChild>
                  <Link
                    href="/contact"
                    className="mt-4 flex min-h-12 items-center justify-center rounded-sm bg-jx text-sm font-semibold text-white"
                  >
                    Request a Quote
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
