import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { site } from '@/lib/site'

export function FacilitySection() {
  return (
    <section id="facility" aria-labelledby="facility-heading" className="border-y border-line bg-mist/60">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            id="facility-heading"
            eyebrow="Facility"
            title="Where the parts are made"
            description="A press line with robotic loading, photographed on our factory floor in Daishan County, Zhoushan."
          />
          <Reveal index={3} className="mt-8 flex gap-3 text-sm">
            <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-jx" />
            <address className="not-italic leading-relaxed text-ink-soft">
              {site.address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </Reveal>
        </div>
        <Reveal index={1}>
          <figure className="border border-line bg-white p-2">
            <Image
              src="/facility/press-line.png"
              alt="Row of stamping presses with yellow robotic arms on the Jinxin factory floor"
              width={823}
              height={452}
              sizes="(min-width: 1024px) 55vw, 94vw"
              className="h-auto w-full"
            />
            <figcaption className="px-2 pb-1 pt-3 text-xs text-ink-soft">Press line with robotic loading arms.</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
