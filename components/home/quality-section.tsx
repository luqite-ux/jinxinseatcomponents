import { FileCheck2, ScanSearch } from 'lucide-react'
import { CertificateViewer } from '@/components/quality/certificate-viewer'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'

export function QualitySection() {
  return (
    <section id="quality" aria-labelledby="quality-heading" className="bg-paper">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeading
            id="quality-heading"
            eyebrow="Quality"
            title="IATF 16949:2016 quality management"
            description="Our quality management system is certified by DQS to IATF 16949:2016, covering the design and production of seat components."
          />
          <ul className="mt-8 space-y-5">
            <Reveal as="li" index={0} className="flex gap-4 list-none">
              <FileCheck2 aria-hidden className="mt-0.5 size-6 shrink-0 text-jx" />
              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="block font-semibold text-ink">Scope of certification</span>
                Design and production of seat components, with product design included.
              </p>
            </Reveal>
            <Reveal as="li" index={1} className="flex gap-4 list-none">
              <ScanSearch aria-hidden className="mt-0.5 size-6 shrink-0 text-jx" />
              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="block font-semibold text-ink">Read the document itself</span>
                Open the certificate to see its registration details, dates and issuing body.
              </p>
            </Reveal>
          </ul>
        </div>
        <Reveal index={2} className="flex justify-center lg:justify-end">
          <CertificateViewer />
        </Reveal>
      </div>
    </section>
  )
}
