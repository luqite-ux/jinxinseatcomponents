import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/components/site/locale-link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/site/page-header'
import { getPublishedArticle } from '@/lib/articles-db'
import { buttonSecondary, site } from '@/lib/site'
import { getLocaleAlternates, getRequestLocale } from '@/lib/site-locales'
import { localePath } from '@/lib/i18n'

type Params = Promise<{ slug: string }>

export const dynamicParams = true
export const revalidate = 60

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) return { title: 'Article not found' }
  const locale = await getRequestLocale()
  return {
    title: article.title,
    description: article.excerpt,
    alternates: await getLocaleAlternates(`/news/${article.slug}`),
    openGraph: {
      type: 'article', title: article.title, description: article.excerpt,
      url: `${site.url}${localePath(`/news/${article.slug}`, locale)}`,
      publishedTime: article.publishedAt,
      images: article.coverImage ? [{ url: article.coverImage.src, alt: article.coverImage.alt }] : undefined,
    },
  }
}

export default async function NewsArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()
  const locale = await getRequestLocale()
  const articleUrl = `${site.url}${localePath(`/news/${article.slug}`, locale)}`
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: article.title, description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.coverImage?.src,
    publisher: { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.name },
    mainEntityOfPage: articleUrl,
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    '@id': `${articleUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}${localePath('/', locale)}` },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${site.url}${localePath('/news', locale)}` },
      { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />
      <PageHeader
        eyebrow="News"
        title={article.title}
        description={article.excerpt}
        crumbs={[{ label: 'News', href: '/news' }, { label: article.title }]}
        backdrop={false}
      />
      <article className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <time dateTime={article.publishedAt} className="font-mono text-sm text-ink-soft">
          {article.publishedAt.slice(0, 10)}
        </time>
        {article.coverImage && (
          <Image
            src={article.coverImage.src}
            alt={article.coverImage.alt}
            width={article.coverImage.width}
            height={article.coverImage.height}
            sizes="(min-width: 768px) 48rem, 94vw"
            className="mt-6 h-auto w-full border border-line"
          />
        )}
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-soft">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <Link href="/news" className={`${buttonSecondary} mt-12`}>
          <ArrowLeft aria-hidden className="size-4" />
          Back to News
        </Link>
      </article>
    </>
  )
}
