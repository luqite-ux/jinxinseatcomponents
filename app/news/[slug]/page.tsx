import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/site/page-header'
import { getPublishedArticle } from '@/lib/articles-db'
import { buttonSecondary } from '@/lib/site'

type Params = Promise<{ slug: string }>

export const dynamicParams = true
export const revalidate = 60

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) return { title: 'Article not found' }
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
  }
}

export default async function NewsArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) notFound()

  return (
    <>
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
