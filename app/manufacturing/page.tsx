import type { Metadata } from 'next'
import Image from 'next/image'
import { CertificateViewer } from '@/components/quality/certificate-viewer'
import { CtaBand } from '@/components/site/cta-band'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { manufacturingAreas } from '@/lib/manufacturing'

export const metadata: Metadata = {
  title: 'Manufacturing',
  description:
    'Design and production of seat components: seat frames, molded foam and seat assemblies from Zhoushan Jinxin Auto Parts, certified to IATF 16949:2016.',
  alternates: { canonical: '/manufacturing' },
}

export default function ManufacturingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Manufacturing"
        title="From structure to assembly"
        description="Seat frames, molded foam and complete seat assemblies, designed and produced for seating programs."
        crumbs={[{ label: 'Manufacturing' }]}
      />

      <section aria-labelledby="areas-heading" className="mx-auto max-w-[88rem] px-5 py-14 md:px-10 md:py-20">
        <SectionHeading id="areas-heading" eyebrow="Product scope" title="What we make" />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {manufacturingAreas.map((area, i) => (
            <Reveal as="li" key={area.title} index={i} className="list-none">
              <div className="h-full border border-line bg-white">
                <div className="relative aspect-[4/3] bg-[#f1eee9]">
                  <Image
                    src={area.image.src}
                    alt={area.image.alt}
                    fill
                    sizes="(min-width: 768px) 30vw, 92vw"
                    className="object-contain p-4 mix-blend-multiply"
                  />
                </div>
                <div className="border-t border-line p-5">
                  <area.icon aria-hidden className="size-6 text-jx" />
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{area.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="floor-heading" className="border-y border-line bg-mist/60">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
          <SectionHeading
            id="floor-heading"
            eyebrow="Factory floor"
            title="Press line with robotic loading"
            description="A row of stamping presses served by robotic arms, photographed at our facility in Daishan County."
          />
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
            </figure>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="quality-heading" className="mx-auto max-w-[88rem] px-5 py-14 md:px-10 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <SectionHeading
            id="quality-heading"
            eyebrow="Quality"
            title="IATF 16949:2016 certified"
            description="Our quality management system is certified by DQS to IATF 16949:2016 for the design and production of seat components."
          />
          <Reveal index={1} className="flex justify-center lg:justify-end">
            <CertificateViewer />
          </Reveal>
        </div>
      </section>

      <CtaBand title="Discuss a component or assembly" text="Send your drawing or sample reference and we will review the fit." />
    </>
  )
}
