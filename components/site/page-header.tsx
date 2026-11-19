import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { StructureBackdrop } from '@/components/site/structure-backdrop'
import { siteTypographyStyle } from '@/lib/site-content/typography'

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
  backdrop = true,
  styles,
  contentVersion,
}: {
  eyebrow: string
  title: string
  description?: string
  crumbs?: { label: string; href?: string }[]
  backdrop?: boolean
  styles?: Record<string, Record<string, unknown>>
  contentVersion?: string
}) {
  return (
    <header {...(contentVersion ? { 'data-hq-content-version': contentVersion } : {})} className="relative overflow-hidden border-b border-line bg-paper">
      {backdrop && (
        <StructureBackdrop className="right-[-18%] top-0 h-full w-[85%] opacity-40 md:right-[-2%] md:w-[48%] md:opacity-100" />
      )}
      <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-8 md:px-10 md:pb-20 md:pt-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
            <li>
              <Link href="/" className="transition-colors hover:text-jx-deep">
                Home
              </Link>
            </li>
            {crumbs.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight aria-hidden className="size-3.5" />
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-colors hover:text-jx-deep">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-10 max-w-2xl">
          <Reveal as="p" style={siteTypographyStyle(styles, 'eyebrow', { 'site-mono': 'var(--font-geist-mono)' })} className="hq-typography flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-jx-deep">
            <span aria-hidden className="h-px w-8 bg-jx" />
            {eyebrow}
          </Reveal>
          <Reveal index={1}>
            <h1 style={siteTypographyStyle(styles, 'title', { 'site-sans': 'var(--font-geist-sans)' })} className="hq-typography mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal index={2} as="p" style={siteTypographyStyle(styles, 'description', { 'site-sans': 'var(--font-geist-sans)' })} className="hq-typography mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
              {description}
            </Reveal>
          )}
        </div>
      </div>
    </header>
  )
}
