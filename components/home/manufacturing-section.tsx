import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { manufacturingAreas } from '@/lib/manufacturing'
import { buttonSecondary } from '@/lib/site'

export function ManufacturingSection() {
  return (
    <section id="manufacturing" aria-labelledby="manufacturing-heading" className="border-y border-line bg-mist/60">
      <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="manufacturing-heading"
            eyebrow="Manufacturing"
            title="Design and production of seat components"
            description="Structure, foam and complete assemblies are handled across one product scope."
          />
          <Reveal index={2}>
            <Link href="/manufacturing" className={buttonSecondary}>
              Manufacturing overview
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Reveal>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {manufacturingAreas.map((area, i) => (
            <Reveal as="li" key={area.title} index={i} className="list-none">
              <div className="flex h-full flex-col border border-line bg-white">
                <div className="relative aspect-[4/3] bg-[#f1eee9]">
                  <Image
                    src={area.image.src}
                    alt={area.image.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 92vw"
                    className="object-contain p-4 mix-blend-multiply"
                  />
                </div>
                <div className="flex flex-1 flex-col border-t border-line p-5">
                  <area.icon aria-hidden className="size-6 text-jx" />
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{area.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
