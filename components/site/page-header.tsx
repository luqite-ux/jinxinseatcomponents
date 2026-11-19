import Link from '@/components/site/locale-link'
import { ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { StructureBackdrop } from '@/components/site/structure-backdrop'
import { siteTypographyStyle } from '@/lib/site-content/typography'
import { site } from '@/lib/site'
import { getRequestLocale } from '@/lib/site-locales'
import { getSiteContent } from '@/lib/site-content/site-content'
import { localePath } from '@/lib/i18n'

export async function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
  backdrop = true,
  styles,
  contentVersion,
  schemaPath,
}: {
  eyebrow: string
  title: string
  description?: string
  crumbs?: { label: string; href?: string }[]
  backdrop?: boolean
  styles?: Record<string, Record<string, unknown>>
  contentVersion?: string
  schemaPath?: string
}) {
  const locale = await getRequestLocale()
  const snapshot = await getSiteContent(locale)
  const navigation = snapshot?.pages.find(page => page.path === '/')?.modules.find(module => module.type === 'navigation')?.values.links
  const labels = new Map<string, string>(Array.isArray(navigation)
    ? navigation.flatMap(row => row && typeof row === 'object' && typeof row.href === 'string' && typeof row.label === 'string'
      ? [[row.href.split('?')[0], row.label] as [string, string]] : [])
    : [])
  const homeLabel = labels.get('/') ?? 'Home'
  const localizedCrumbs = crumbs.map(crumb => ({ ...crumb, label: labels.get((crumb.href ?? schemaPath ?? '').split('?')[0]) ?? crumb.label }))
  const breadcrumbLd = schemaPath && crumbs.length ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabel, item: `${site.url}${localePath('/', locale)}` },
      ...localizedCrumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 2, name: crumb.label, item: `${site.url}${localePath(crumb.href ?? schemaPath, locale)}` })),
    ],
  } : null
  return (
    <header {...(contentVersion ? { 'data-hq-content-version': contentVersion } : {})} className="relative overflow-hidden border-b border-line bg-paper">
      {breadcrumbLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />}
      {backdrop && (
        <StructureBackdrop className="right-[-18%] top-0 h-full w-[85%] opacity-40 md:right-[-2%] md:w-[48%] md:opacity-100" />
      )}
      <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-8 md:px-10 md:pb-20 md:pt-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
            <li>
              <Link href="/" className="transition-colors hover:text-jx-deep">
                {homeLabel}
              </Link>
            </li>
            {localizedCrumbs.map((crumb) => (
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
