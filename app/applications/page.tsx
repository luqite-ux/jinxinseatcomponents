import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CtaBand } from '@/components/site/cta-band'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { applicationExamples } from '@/lib/applications'
import { buttonSecondary } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Applications',
  description:
    'Seat configurations from Zhoushan Jinxin Auto Parts, including front seating and folding seating with belt, and the frames and foam behind them.',
  alternates: { canonical: '/applications' },
}

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="Seat configurations we build"
        description="See complete seats in use positions, then follow through to the frames and foam components that make them up."
        crumbs={[{ label: 'Applications' }]}
      />
      <section aria-label="Application examples" className="mx-auto max-w-[88rem] px-5 py-12 md:px-10 md:py-20">
        <ul className="space-y-6">
          {applicationExamples.map((item, i) => (
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
      <CtaBand title="Have a seat position in mind?" text="Describe the application and we will review which products fit." />
    </>
  )
}
