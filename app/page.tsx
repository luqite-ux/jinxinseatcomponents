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

export const metadata: Metadata = {
  title: { absolute: 'Zhoushan Jinxin Auto Parts | Automotive Seat Assemblies, Frames and Molded Foam' },
  description:
    'Zhoushan Jinxin Auto Parts Co., Ltd. makes automotive seat assemblies, seat frames and molded foam components. Browse products and send an inquiry.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
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
