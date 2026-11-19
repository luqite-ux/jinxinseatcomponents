import type { Metadata } from 'next'
import Image from 'next/image'
import { CertificateViewer } from '@/components/quality/certificate-viewer'
import { CtaBand } from '@/components/site/cta-band'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { manufacturingAreas } from '@/lib/manufacturing'
import { siteCopy, siteImage } from '@/lib/site-content/copy'
import { getEditablePage } from '@/lib/site-content/page-data'
import { siteContentMetadata } from '@/lib/site-content/site-content'

const fallbackMetadata: Metadata = {
  title: 'Manufacturing',
  description:
    'Design and production of seat components: seat frames, molded foam and seat assemblies from Zhoushan Jinxin Auto Parts, certified to IATF 16949:2016.',
  alternates: { canonical: '/manufacturing' },
}

export async function generateMetadata(): Promise<Metadata> {
  return { ...fallbackMetadata, ...(await siteContentMetadata('/manufacturing', 'en')) }
}

export default async function ManufacturingPage() {
  const page = await getEditablePage('/manufacturing')
  const intro = page.module('intro')
  const copy = page.module('copy')?.values
  const sourceAreas = Array.isArray(copy?.areas) ? copy.areas : undefined
  const areaIds = ['frames', 'foam', 'assembly']
  const areas = manufacturingAreas.map((area, index) => {
    const row = sourceAreas?.find((item: unknown) => item && typeof item === 'object' && (item as Record<string, unknown>).id === areaIds[index]) as Record<string, unknown> | undefined
    if (sourceAreas && !row) throw new Error(`Published manufacturing area missing: ${areaIds[index]}`)
    return { ...area, title: siteCopy(row, 'title', area.title), description: siteCopy(row, 'description', area.description), image: siteImage(row, 'image', area.image) }
  })
  const floorImage = siteImage(copy, 'floor_image', { src: '/facility/press-line.png', alt: 'Row of stamping presses with yellow robotic arms on the Jinxin factory floor' })
  const certificateImage = siteImage(copy, 'certificate_image', { src: '/quality/iatf-16949-certificate.jpg', alt: 'IATF 16949:2016 certificate issued by DQS to Zhoushan Jinxin Auto Parts Co., Ltd. for the design and production of seat components' })
  return (
    <>
      <PageHeader
        eyebrow={siteCopy(intro?.values, 'eyebrow', 'Manufacturing')}
        title={siteCopy(intro?.values, 'title', 'From structure to assembly')}
        description={siteCopy(intro?.values, 'description', 'Seat frames, molded foam and complete seat assemblies, designed and produced for seating programs.')}
        styles={intro?.styles}
        contentVersion={intro ? page.version : undefined}
        crumbs={[{ label: 'Manufacturing' }]}
      />

      <section aria-labelledby="areas-heading" className="mx-auto max-w-[88rem] px-5 py-14 md:px-10 md:py-20">
        <SectionHeading id="areas-heading" eyebrow={siteCopy(copy, 'scope_eyebrow', 'Product scope')} title={siteCopy(copy, 'scope_title', 'What we make')} />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {areas.map((area, i) => (
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
            eyebrow={siteCopy(copy, 'floor_eyebrow', 'Factory floor')}
            title={siteCopy(copy, 'floor_title', 'Press line with robotic loading')}
            description={siteCopy(copy, 'floor_description', 'A row of stamping presses served by robotic arms, photographed at our facility in Daishan County.')}
          />
          <Reveal index={1}>
            <figure>
              <Image
                src={floorImage.src}
                alt={floorImage.alt}
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
            eyebrow={siteCopy(copy, 'quality_eyebrow', 'Quality')}
            title={siteCopy(copy, 'quality_title', 'IATF 16949:2016 certified')}
            description={siteCopy(copy, 'quality_description', 'Our quality management system is certified by DQS to IATF 16949:2016 for the design and production of seat components.')}
          />
          <Reveal index={1} className="flex justify-center lg:justify-end">
            <CertificateViewer image={certificateImage} buttonLabel={siteCopy(copy, 'certificate_button', 'View full certificate')} dialogTitle={siteCopy(copy, 'certificate_title', 'IATF 16949:2016 certificate')} />
          </Reveal>
        </div>
      </section>

      <CtaBand title={siteCopy(copy, 'cta_title', 'Discuss a component or assembly')} text={siteCopy(copy, 'cta_text', 'Send your drawing or sample reference and we will review the fit.')} />
    </>
  )
}
