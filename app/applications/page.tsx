import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CtaBand } from '@/components/site/cta-band'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { applicationExamples } from '@/lib/applications'
import { buttonSecondary } from '@/lib/site'
import { siteCopy, siteImage } from '@/lib/site-content/copy'
import { getEditablePage } from '@/lib/site-content/page-data'
import { siteContentMetadata } from '@/lib/site-content/site-content'

const fallbackMetadata: Metadata = {
  title: 'Applications',
  description:
    'Seat configurations from Zhoushan Jinxin Auto Parts, including front seating and folding seating with belt, and the frames and foam behind them.',
  alternates: { canonical: '/applications' },
}

export async function generateMetadata(): Promise<Metadata> {
  return { ...fallbackMetadata, ...(await siteContentMetadata('/applications', 'en')) }
}

export default async function ApplicationsPage() {
  const page = await getEditablePage('/applications')
  const intro = page.module('intro')
  const copy = page.module('copy')?.values
  const sourceExamples = Array.isArray(copy?.examples) ? copy.examples : undefined
  const examples = applicationExamples.map((example) => {
    const row = sourceExamples?.find((item: unknown) => item && typeof item === 'object' && (item as Record<string, unknown>).id === example.slug) as Record<string, unknown> | undefined
    if (sourceExamples && !row) throw new Error(`Published application missing: ${example.slug}`)
    return { ...example, title: siteCopy(row, 'title', example.title), summary: siteCopy(row, 'summary', example.summary), cta: siteCopy(row, 'cta', example.cta), href: siteCopy(row, 'href', example.href), image: siteImage(row, 'image', example.image) }
  })
  const gallery = Array.isArray(copy?.gallery)
    ? copy.gallery.map((item: unknown, index: number) => {
        const row = item && typeof item === 'object' ? item as Record<string, unknown> : {}
        return {
          id: typeof row.id === 'string' ? row.id : String(index),
          title: siteCopy(row, 'title', 'Customer supplied photograph'),
          image: siteImage(row, 'image', { src: '/products/front-seat-assembly.jpg', alt: 'Customer supplied seat photograph' }),
        }
      })
    : []
  return (
    <>
      <PageHeader
        eyebrow={siteCopy(intro?.values, 'eyebrow', 'Applications')}
        title={siteCopy(intro?.values, 'title', 'Seat configurations we build')}
        description={siteCopy(intro?.values, 'description', 'See complete seats in use positions, then follow through to the frames and foam components that make them up.')}
        styles={intro?.styles}
        contentVersion={intro ? page.version : undefined}
        crumbs={[{ label: 'Applications' }]}
      />
      <section aria-label="Application examples" className="mx-auto max-w-[88rem] px-5 py-12 md:px-10 md:py-20">
        <ul className="space-y-6">
          {examples.map((item, i) => (
            <Reveal as="li" key={item.slug} index={0} className="list-none">
              <article
                className={`grid border border-line bg-white md:grid-cols-2 ${i % 2 ? 'md:[&>div:first-child]:order-2' : ''}`}
              >
                <div className="relative aspect-[4/3] bg-[#f1eee9] md:aspect-auto md:min-h-[26rem]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 94vw"
                    className="object-contain p-6 mix-blend-multiply"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-12">
                  <item.icon aria-hidden className="size-7 text-jx" />
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">{item.title}</h2>
                  <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{item.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={item.href} className={buttonSecondary}>
                      {item.cta}
                      <ArrowRight aria-hidden className="size-4" />
                    </Link>
                    <Link href="/products?category=seat-frames" className={buttonSecondary}>
                      Seat frames
                    </Link>
                    <Link href="/products?category=molded-foam" className={buttonSecondary}>
                      Molded foam
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>
      {gallery.length > 0 && (
        <section aria-labelledby="supplied-gallery-heading" className="border-t border-line bg-mist/50">
          <div className="mx-auto max-w-[88rem] px-5 py-14 md:px-10 md:py-20">
            <SectionHeading
              id="supplied-gallery-heading"
              eyebrow="Photo collection"
              title={siteCopy(copy, 'gallery_title', 'More from the supplied photo collection')}
              description={siteCopy(copy, 'gallery_description', 'Additional customer supplied photographs.')}
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item, index) => (
                <Reveal as="li" key={item.id} index={index} className="list-none">
                  <figure className="h-full overflow-hidden rounded-xl border border-line bg-white">
                    <div className="relative aspect-[4/3] bg-white">
                      <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 1024px) 29vw, (min-width: 640px) 46vw, 92vw" className="object-contain" />
                    </div>
                    <figcaption className="border-t border-line px-4 py-3 text-sm font-medium text-ink">{item.title}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand title={siteCopy(copy, 'cta_title', 'Have a seat position in mind?')} text={siteCopy(copy, 'cta_text', 'Describe the application and we will review which products fit.')} />
    </>
  )
}
