import type { Metadata } from 'next'
import { Mail, MapPin, FileText, Phone } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { fetchProductBySlug } from '@/lib/products-db'
import { site } from '@/lib/site'
import { siteCopy } from '@/lib/site-content/copy'
import { getEditablePage } from '@/lib/site-content/page-data'
import { siteContentMetadata } from '@/lib/site-content/site-content'

const fallbackMetadata: Metadata = {
  title: 'Contact',
  description:
    'Send your seat assembly, seat frame or molded foam requirements to Zhoushan Jinxin Auto Parts and discuss fit with our team.',
  alternates: { canonical: '/contact' },
}

export async function generateMetadata(): Promise<Metadata> {
  return { ...fallbackMetadata, ...(await siteContentMetadata('/contact', 'en')) }
}

type SearchParams = Promise<{ product?: string | string[]; subject?: string | string[] }>
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v)

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const productSlug = first(params.product) ?? ''
  const product = productSlug ? await fetchProductBySlug(productSlug) : undefined
  const subject = product?.name ?? first(params.subject)?.slice(0, 200) ?? ''
  const page = await getEditablePage('/contact')
  const intro = page.module('intro')
  const copy = page.module('copy')?.values

  return (
    <>
      <PageHeader
        eyebrow={siteCopy(intro?.values, 'eyebrow', 'Contact')}
        title={siteCopy(intro?.values, 'title', 'Send us your requirements')}
        description={siteCopy(intro?.values, 'description', 'Tell us what you need and we will review it with you. Include a drawing or sample reference if you have one.')}
        styles={intro?.styles}
        contentVersion={intro ? page.version : undefined}
        crumbs={[{ label: 'Contact' }]}
        schemaPath="/contact"
      />
      <section aria-label="Inquiry" className="mx-auto max-w-[88rem] px-5 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal>
            <ContactForm defaultSubject={subject} productSlug={product?.slug ?? ''} />
          </Reveal>
          <aside aria-label="Company details" className="space-y-8">
            <Reveal index={1}>
              <h2 className="text-xl font-semibold tracking-tight">{site.name}</h2>
              <p className="mt-1 text-sm text-ink-soft" lang="zh-Hans">
                {site.nameZh}
              </p>
            </Reveal>
            <Reveal index={2} as="ul" className="space-y-5 text-sm">
              <li className="flex gap-3">
                <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-jx" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href={`mailto:${site.email}`} className="break-all text-ink-soft transition-colors hover:text-jx-deep">
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-jx" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href={site.phoneHref} className="text-ink-soft transition-colors hover:text-jx-deep">
                    {site.phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-jx" />
                <div>
                  <p className="font-semibold">Address</p>
                  <address className="not-italic leading-relaxed text-ink-soft">
                    {site.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </li>
            </Reveal>
            <Reveal index={3} className="border-l-2 border-jx bg-mist/70 p-5">
              <FileText aria-hidden className="size-5 text-jx" />
              <h3 className="mt-3 font-semibold">{siteCopy(copy, 'hints_title', 'What helps us respond faster')}</h3>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-soft">
                <li>{siteCopy(copy, 'hints_product', 'The product or family you are interested in')}</li>
                <li>{siteCopy(copy, 'hints_drawing', 'Drawing number, sample or reference photos')}</li>
                <li>{siteCopy(copy, 'hints_quantity', 'Expected quantity, if known')}</li>
              </ul>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  )
}
