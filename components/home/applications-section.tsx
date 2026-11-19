import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { applicationExamples } from '@/lib/applications'
import { buttonSecondary } from '@/lib/site'
import { siteCopy, siteImage, type EditableSectionProps } from '@/lib/site-content/copy'

export function ApplicationsSection({ content, styles }: EditableSectionProps = {}) {
  const sourceExamples = Array.isArray(content?.examples) ? content.examples : undefined
  const examples = applicationExamples.map((example) => {
    const row = sourceExamples?.find((item: unknown) => item && typeof item === 'object' && (item as Record<string, unknown>).id === example.slug) as Record<string, unknown> | undefined
    if (sourceExamples && !row) throw new Error(`Published application missing: ${example.slug}`)
    return { ...example, title: siteCopy(row, 'title', example.title), summary: siteCopy(row, 'summary', example.summary), cta: siteCopy(row, 'cta', example.cta), href: siteCopy(row, 'href', example.href), image: siteImage(row, 'image', example.image) }
  })
  return (
    <section id="applications" aria-labelledby="applications-heading" className="bg-paper">
      <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="applications-heading"
            eyebrow={siteCopy(content, 'eyebrow', 'Applications')}
            title={siteCopy(content, 'title', 'Seats for different positions')}
            description={siteCopy(content, 'description', 'From front seating to folding seats with belts, see the configurations we build and the parts behind them.')}
            styles={styles}
          />
          <Reveal index={2}>
            <Link href="/applications" className={buttonSecondary}>
              {siteCopy(content, 'all_cta', 'See applications')}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {examples.map((item, i) => (
            <Reveal as="li" key={item.slug} index={i} className="list-none">
              <Link
                href={item.href}
                className="group grid h-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-ink/40 hover:shadow-[0_18px_36px_-24px_rgba(23,25,30,0.45)]"
              >
                <div className="relative min-h-56 bg-[#f1eee9]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 768px) 20vw, 40vw"
                    className="object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col p-5 md:p-6">
                  <item.icon aria-hidden className="size-6 text-jx" />
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.summary}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold">
                    {item.cta}
                    <ArrowRight aria-hidden className="size-4 text-jx transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
