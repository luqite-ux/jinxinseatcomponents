import { Armchair, Layers, type LucideIcon } from 'lucide-react'

export type ApplicationExample = {
  slug: string
  title: string
  summary: string
  cta: string
  href: string
  icon: LucideIcon
  image: { src: string; alt: string }
}

export const applicationExamples: ApplicationExample[] = [
  {
    slug: 'front-seating',
    title: 'Front seating',
    summary:
      'Front seat assemblies with headrest, backrest and cushion, supported by seat frames and molded foam.',
    cta: 'Browse seat assemblies',
    href: '/products?category=seat-assemblies',
    icon: Armchair,
    image: {
      src: '/products/front-seat-assembly.jpg',
      alt: 'Front seat assembly with tan perforated leather upholstery',
    },
  },
  {
    slug: 'folding-seating',
    title: 'Folding seating with belt',
    summary: 'Folding seat configurations with an integrated seat belt and an armrest, shown as a complete assembly.',
    cta: 'Browse seat assemblies',
    href: '/products?category=seat-assemblies',
    icon: Layers,
    image: {
      src: '/products/folding-seat-assembly.jpg',
      alt: 'Folding seat assembly with teal upholstery, armrest and seat belt',
    },
  },
]
