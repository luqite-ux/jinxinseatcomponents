import type { Metadata } from 'next'
import { ApplicationsSection } from '@/components/home/applications-section'
import { ContactSection } from '@/components/home/contact-section'
import { CooperationSection } from '@/components/home/cooperation-section'
import { FacilitySection } from '@/components/home/facility-section'
import { FaqSection } from '@/components/home/faq-section'
import { FeaturedProductsSection } from '@/components/home/featured-products-section'
import { HeroCarousel } from '@/components/home/hero-carousel'
import { ManufacturingSection } from '@/components/home/manufacturing-section'
import { ProductFamiliesSection } from '@/components/home/product-families-section'
import { QualitySection } from '@/components/home/quality-section'
import { site } from '@/lib/site'
import { getSiteContent, siteContentMetadata } from '@/lib/site-content/site-content'
import { getRequestLocale } from '@/lib/site-locales'

const fallbackMetadata: Metadata = {
  title: { absolute: 'Zhoushan Jinxin Auto Parts | Automotive Seat Assemblies, Frames and Molded Foam' },
  description:
    'Zhoushan Jinxin Auto Parts Co., Ltd. makes automotive seat assemblies, seat frames and molded foam components. Browse products and send an inquiry.',
  alternates: { canonical: '/' },
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await siteContentMetadata('/')
  return { ...fallbackMetadata, ...content, ...(content.title ? { title: { absolute: content.title } } : {}) }
}

export default async function HomePage() {
  const locale = await getRequestLocale()
  const snapshot = await getSiteContent(locale)
  const modules = snapshot?.pages.find((page) => page.path === '/')?.modules
  const moduleFor = (type: string) => modules?.find((module) => module.type === type)
  const section = (type: string) => ({ content: moduleFor(type)?.values, styles: moduleFor(type)?.styles })
  const hero = moduleFor('hero')
  const organizationId = `${site.url}/#organization`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: site.name,
        url: site.url,
        logo: `${site.url}/brand/jx-logo.png`,
        email: site.email,
        telephone: site.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 16 Fuyu Road, Dongsha Town',
          addressLocality: 'Daishan County, Zhoushan',
          addressRegion: 'Zhejiang',
          postalCode: '316216',
          addressCountry: 'CN',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        name: site.name,
        url: site.url,
        publisher: { '@id': organizationId },
        inLanguage: locale,
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div {...(hero ? { 'data-hq-content-version': snapshot?.version } : {})}>
        <HeroCarousel content={hero?.values} styles={hero?.styles} />
      </div>
      <ProductFamiliesSection {...section('product_families')} />
      <FeaturedProductsSection {...section('featured_products')} />
      <ApplicationsSection {...section('applications')} />
      <ManufacturingSection {...section('manufacturing')} />
      <QualitySection {...section('quality')} />
      <FacilitySection {...section('facility')} />
      <CooperationSection {...section('cooperation')} />
      <FaqSection {...section('faq')} />
      <ContactSection {...section('contact')} />
    </>
  )
}
