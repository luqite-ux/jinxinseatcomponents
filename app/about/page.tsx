import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, MapPin, Mail } from 'lucide-react'
import { CtaBand } from '@/components/site/cta-band'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { buttonSecondary, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Zhoushan Jinxin Auto Parts Co., Ltd. designs and produces automotive seat components: seat assemblies, seat frames and molded foam.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Seat components, designed and produced in Zhoushan"
        description={`${site.name} makes automotive seat assemblies, seat frames and molded foam components.`}
        crumbs={[{ label: 'About' }]}
      />

      <section aria-labelledby="who-heading" className="mx-auto max-w-[88rem] px-5 py-14 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              id="who-heading"
              eyebrow="The company"
              title="One supplier across structure, foam and assembly"
            />
            <Reveal index={3} as="div" className="mt-6 space-y-4 leading-relaxed text-ink-soft">
              <p>
                We focus on the parts that make up an automotive seat: the structural frame, the molded foam that
                shapes comfort, and the complete assemblies that bring them together.
              </p>
              <p>
                Our quality management system is certified to IATF 16949:2016 for the design and production of seat
                components.
              </p>
            </Reveal>
            <Reveal index={4} className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className={buttonSecondary}>
                Browse products
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="/manufacturing" className={buttonSecondary}>
                Manufacturing
              </Link>
            </Reveal>
          </div>

          <Reveal index={1}>
            <dl className="divide-y divide-line border border-line bg-white">
              <div className="flex gap-4 p-5">
                <Building2 aria-hidden className="mt-0.5 size-5 shrink-0 text-jx" />
                <div>
                  <dt className="text-sm font-semibold">Company</dt>
                  <dd className="mt-1 text-sm text-ink-soft">{site.name}</dd>
                  <dd className="text-sm text-ink-soft" lang="zh-Hans">
                    {site.nameZh}
                  </dd>
                </div>
              </div>
              <div className="flex gap-4 p-5">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-jx" />
                <div>
                  <dt className="text-sm font-semibold">Address</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {site.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              </div>
              <div className="flex gap-4 p-5">
                <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-jx" />
                <div>
                  <dt className="text-sm font-semibold">Email</dt>
                  <dd className="mt-1 text-sm">
                    <a href={`mailto:${site.email}`} className="break-all text-ink-soft hover:text-jx-deep">
                      {site.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="experience-heading" className="border-t border-line bg-white">
        <div className="mx-auto max-w-[88rem] px-5 py-14 md:px-10 md:py-20">
          <SectionHeading
            id="experience-heading"
            eyebrow="Customer experience"
            title="Past supply experience across the automotive sector"
            description="Our company presentation names Dongfeng Commercial Vehicle, Lear, GAC Gonow, Geely and Shanghai Daimay among historical customers served. This is a record of past supply experience, not a statement of current partnership or endorsement."
          />
        </div>
      </section>

      <section aria-labelledby="site-heading" className="border-y border-line bg-mist/60">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <Image
              src="/facility/press-line.png"
              alt="Row of stamping presses with yellow robotic arms on the Jinxin factory floor"
              width={823}
              height={452}
              sizes="(min-width: 1024px) 55vw, 94vw"
              className="h-auto w-full border border-line bg-white p-2"
            />
          </Reveal>
          <SectionHeading
            id="site-heading"
            eyebrow="Our facility"
            title="Made in Daishan County"
            description="Production takes place at our site in Dongsha Town, Daishan County, Zhoushan, Zhejiang."
          />
        </div>
      </section>

      <CtaBand title="Talk to our team" text="Tell us about your seating requirements and we will respond by email." />
    </>
  )
}
