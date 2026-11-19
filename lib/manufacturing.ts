import { Boxes, Cog, Armchair, type LucideIcon } from 'lucide-react'

export type ManufacturingArea = {
  title: string
  description: string
  icon: LucideIcon
  image: { src: string; alt: string }
}

export const manufacturingAreas: ManufacturingArea[] = [
  {
    title: 'Seat frames and structural parts',
    description: 'Complete seat frames with slide rails, and the stamped brackets and members that carry the seat.',
    icon: Cog,
    image: {
      src: '/catalog/cutouts/product-row-65.webp',
      alt: 'Seat frame with slide rails and recliner mechanism',
    },
  },
  {
    title: 'Molded foam components',
    description: 'Molded foam for seat cushions and backs, produced to the shape of the seat it supports.',
    icon: Boxes,
    image: {
      src: '/catalog/cutouts/product-row-45.webp',
      alt: 'Molded seat cushion foam component',
    },
  },
  {
    title: 'Seat assembly',
    description: 'Frame, foam and trim brought together into complete seat configurations.',
    icon: Armchair,
    image: {
      src: '/catalog/cutouts/product-row-17.webp',
      alt: 'Completed front seat assembly with tan leather trim',
    },
  },
]
