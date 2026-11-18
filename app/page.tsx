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

export const metadata: Metadata = {
  title: { absolute: 'Zhoushan Jinxin Auto Parts | Automotive Seat Assemblies, Frames and Molded Foam' },
  description:
    'Zhoushan Jinxin Auto Parts Co., Ltd. makes automotive seat assemblies, seat frames and molded foam components. Browse products and send an inquiry.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
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
        inLanguage: 'en',
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroCarousel />
      <ProductFamiliesSection />
      <FeaturedProductsSection />
      <ApplicationsSection />
      <ManufacturingSection />
      <QualitySection />
      <FacilitySection />
      <CooperationSection />
      <FaqSection />
      <ContactSection />
    </>
  )
}
