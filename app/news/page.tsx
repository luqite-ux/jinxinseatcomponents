import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { getPublishedArticles } from '@/lib/articles-db'
import { buttonPrimary, buttonSecondary } from '@/lib/site'

export const metadata: Metadata = {
  title: 'News',
  description: 'News from Zhoushan Jinxin Auto Parts Co., Ltd.',
  alternates: { canonical: '/news' },
}

export const revalidate = 60

export default async function NewsPage() {
  const articles = await getPublishedArticles()

  return (
    <>
      <PageHeader
        eyebrow="News"
        title="News"
        description="Company updates and product announcements."
        crumbs={[{ label: 'News' }]}
      />
      <section aria-label="Articles" className="mx-auto max-w-[88rem] px-5 py-12 md:px-10 md:py-20">
        {articles.length === 0 ? (
          <Reveal className="mx-auto flex max-w-xl flex-col items-center border border-dashed border-line bg-white px-6 py-16 text-center">
            <Newspaper aria-hidden className="size-10 text-ink-soft" />
            <h2 className="mt-5 text-xl font-semibold tracking-tight">No articles published yet</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              News will appear here when we publish it. In the meantime, browse our products or get in touch.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className={buttonPrimary}>
                Browse products
              </Link>
              <Link href="/contact" className={buttonSecondary}>
                Contact us
              </Link>
            </div>
          </Reveal>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <Reveal as="li" key={article.slug} index={i % 3} className="h-full list-none">
                <Link
                  href={`/news/${article.slug}`}
                  className="group flex h-full flex-col border border-line bg-white transition-[border-color,box-shadow] hover:border-ink/40"
                >
                  {article.coverImage && (
                    <Image
                      src={article.coverImage.src}
                      alt={article.coverImage.alt}
                      width={article.coverImage.width}
                      height={article.coverImage.height}
                      sizes="(min-width: 1024px) 30vw, 92vw"
                      className="aspect-video w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <time dateTime={article.publishedAt} className="font-mono text-xs text-ink-soft">
                      {article.publishedAt.slice(0, 10)}
                    </time>
                    <h2 className="mt-2 line-clamp-2 text-lg font-semibold tracking-tight group-hover:text-jx-deep">{article.title}</h2>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
