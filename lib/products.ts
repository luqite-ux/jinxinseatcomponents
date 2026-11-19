import { defaultLocale, pickLocalized, text, type Localized } from '@/lib/i18n'
import sourceCatalog from '@/lib/product-catalog.json'

export type CategorySlug = 'seat-assemblies' | 'seat-frames' | 'molded-foam'
  | 'ambulance-seats' | 'golf-cart-seats' | 'atv-seats' | 'commercial-seats' | 'special-seats'
  | 'lumbar-cushions' | 'pet-foam' | 'headrest-foam' | 'seat-foam' | 'integral-skin-foam'
  | 'seat-frames-sub' | 'headrest-rods' | 'headrest-frames' | 'armrest-frames'

export type CategoryRecord = {
  slug: CategorySlug
  parentSlug?: CategorySlug
  name: Localized
  tagline: Localized
  description: Localized
  image: { src: string; width: number; height: number; alt: Localized }
}

export type ProductImageRecord = {
  src: string
  width: number
  height: number
  alt: Localized
}

export type ProductRecord = {
  id: string
  slug: string
  categorySlug: CategorySlug
  subcategorySlug?: CategorySlug
  name: Localized
  summary: Localized
  images: ProductImageRecord[]
  specifications: { label: Localized; value: Localized }[]
  /** Only populated when the source row supports application information. */
  applications?: Localized<string[]>
  sourceRow?: number
  featured?: boolean
  sortOrder: number
}

export type Category = {
  slug: CategorySlug
  parentSlug?: CategorySlug
  name: string
  tagline: string
  description: string
  image: { src: string; width: number; height: number; alt: string }
}

export type Product = {
  id: string
  slug: string
  updatedAt?: string
  categorySlug: CategorySlug
  parentCategorySlug?: CategorySlug
  categoryName: string
  name: string
  summary: string
  images: { src: string; width: number; height: number; alt: string }[]
  specifications: { label: string; value: string }[]
  sourceParametersRaw?: string
  applications: string[]
  featured: boolean
}

const rootCategoryRecords: CategoryRecord[] = [
  {
    slug: 'seat-assemblies',
    name: { en: 'Seat Assemblies' },
    tagline: { en: 'Complete seat configurations' },
    description: {
      en: 'Complete seat configurations, from folding and auxiliary seats to front seats with adjustable headrests.',
    },
    image: {
      src: '/products/front-seat-assembly.jpg',
      width: 1067,
      height: 1600,
      alt: { en: 'Front seat assembly with perforated tan upholstery and adjustable headrest' },
    },
  },
  {
    slug: 'seat-frames',
    name: { en: 'Seat Frames' },
    tagline: { en: 'Seat structural components' },
    description: {
      en: 'Seat frames, slide rails and stamped structural parts that sit beneath the upholstery.',
    },
    image: {
      src: '/products/seat-frame-with-slide-rails.jpg',
      width: 1600,
      height: 1067,
      alt: { en: 'Seat frame with slide rails, tubular cross members and wire suspension elements' },
    },
  },
  {
    slug: 'molded-foam',
    name: { en: 'Molded Foam' },
    tagline: { en: 'Seat foam components' },
    description: {
      en: 'Molded foam cushions and pads shaped for seat bases and backs.',
    },
    image: {
      src: '/products/molded-seat-cushion-foam.jpg',
      width: 1600,
      height: 1067,
      alt: { en: 'Molded seat cushion foam with contoured edge and recessed areas' },
    },
  },
]

const subcategoryDefinitions: { slug: CategorySlug; parentSlug: CategorySlug; name: string; firstRow: number }[] = [
  { slug: 'ambulance-seats', parentSlug: 'seat-assemblies', name: 'Ambulance Seats', firstRow: 5 },
  { slug: 'golf-cart-seats', parentSlug: 'seat-assemblies', name: 'Golf Cart Seats', firstRow: 8 },
  { slug: 'atv-seats', parentSlug: 'seat-assemblies', name: 'ATV Seats', firstRow: 11 },
  { slug: 'commercial-seats', parentSlug: 'seat-assemblies', name: 'Commercial Vehicle Seats', firstRow: 13 },
  { slug: 'special-seats', parentSlug: 'seat-assemblies', name: 'Special Vehicle Seats', firstRow: 23 },
  { slug: 'lumbar-cushions', parentSlug: 'molded-foam', name: 'Lumbar Cushions', firstRow: 24 },
  { slug: 'pet-foam', parentSlug: 'molded-foam', name: 'Pet Foam', firstRow: 33 },
  { slug: 'headrest-foam', parentSlug: 'molded-foam', name: 'Headrest Foam', firstRow: 36 },
  { slug: 'seat-foam', parentSlug: 'molded-foam', name: 'Seat Foam', firstRow: 45 },
  { slug: 'integral-skin-foam', parentSlug: 'molded-foam', name: 'Integral-Skin Foam', firstRow: 55 },
  { slug: 'seat-frames-sub', parentSlug: 'seat-frames', name: 'Seat Frames', firstRow: 63 },
  { slug: 'headrest-rods', parentSlug: 'seat-frames', name: 'Headrest Rods', firstRow: 69 },
  { slug: 'headrest-frames', parentSlug: 'seat-frames', name: 'Headrest Frames', firstRow: 74 },
  { slug: 'armrest-frames', parentSlug: 'seat-frames', name: 'Armrest Frames', firstRow: 77 },
]

const categoryRecords: CategoryRecord[] = [
  ...rootCategoryRecords,
  ...subcategoryDefinitions.map(({ slug, parentSlug, name, firstRow }) => {
    const product = sourceCatalog.find((item) => item.sourceRow === firstRow)
    if (!product) throw new Error(`Missing source image for ${slug}`)
    return {
      slug, parentSlug, name: { en: name }, tagline: { en: name },
      description: { en: `Browse ${name.toLowerCase()} in the Jinxin product catalog.` },
      image: product.images[0],
    }
  }),
]

/**
 * Representative records. The full catalog is mapped into this same shape:
 * one record per product row, each with its own images and specification rows.
 */
const representativeRecords: ProductRecord[] = [
  {
    id: 'sa-front-perforated',
    slug: 'front-seat-assembly-perforated-trim',
    categorySlug: 'seat-assemblies',
    name: { en: 'Front Seat Assembly with Perforated Trim' },
    summary: {
      en: 'Complete front seat with an adjustable headrest, stitched and perforated upholstery and a seat belt buckle.',
    },
    images: [
      {
        src: '/products/front-seat-assembly.jpg',
        width: 1067,
        height: 1600,
        alt: { en: 'Front seat assembly with perforated tan upholstery, adjustable headrest and belt buckle' },
      },
    ],
    specifications: [
      { label: { en: 'Product category' }, value: { en: 'Seat assembly' } },
      { label: { en: 'Configuration' }, value: { en: 'Front seat with adjustable headrest' } },
      { label: { en: 'Upholstery' }, value: { en: 'Stitched, perforated panels' } },
      { label: { en: 'Seat belt' }, value: { en: 'Belt buckle mounted on the seat' } },
    ],
    featured: true,
    sortOrder: 1,
  },
  {
    id: 'sa-folding-armrest',
    slug: 'folding-seat-assembly-with-armrest',
    categorySlug: 'seat-assemblies',
    name: { en: 'Folding Seat Assembly with Armrest' },
    summary: {
      en: 'Folding seat with upholstered back and base, a fixed armrest and an integrated three-point seat belt.',
    },
    images: [
      {
        src: '/products/folding-seat-assembly.jpg',
        width: 1600,
        height: 1067,
        alt: { en: 'Teal folding seat assembly with armrest and three-point seat belt' },
      },
    ],
    specifications: [
      { label: { en: 'Product category' }, value: { en: 'Seat assembly' } },
      { label: { en: 'Configuration' }, value: { en: 'Folding seat with armrest' } },
      { label: { en: 'Seat belt' }, value: { en: 'Three-point belt with buckle' } },
      { label: { en: 'Upholstery' }, value: { en: 'Smooth, solid-color surface' } },
    ],
    featured: true,
    sortOrder: 2,
  },
  {
    id: 'sf-frame-slide-rails',
    slug: 'seat-frame-with-slide-rails',
    categorySlug: 'seat-frames',
    name: { en: 'Seat Frame with Slide Rails' },
    summary: {
      en: 'Seat base frame with slide rails, tubular cross members, recliner mechanism and wire suspension elements.',
    },
    images: [
      {
        src: '/products/seat-frame-with-slide-rails.jpg',
        width: 1600,
        height: 1067,
        alt: { en: 'Seat frame with slide rails, tubular cross members and wire suspension elements' },
      },
    ],
    specifications: [
      { label: { en: 'Product category' }, value: { en: 'Seat frame' } },
      { label: { en: 'Configuration' }, value: { en: 'Base frame with slide rails' } },
      { label: { en: 'Structure' }, value: { en: 'Tubular cross members and stamped side plates' } },
      { label: { en: 'Suspension' }, value: { en: 'Wire suspension elements' } },
    ],
    featured: true,
    sortOrder: 3,
  },
  {
    id: 'sf-stamped-bracket',
    slug: 'stamped-seat-bracket',
    categorySlug: 'seat-frames',
    name: { en: 'Stamped Seat Bracket' },
    summary: {
      en: 'Stamped sheet-metal seat bracket with formed cut-outs, a rolled edge and a welded pin.',
    },
    images: [
      {
        src: '/products/stamped-seat-bracket.jpg',
        width: 1600,
        height: 1067,
        alt: { en: 'Stamped sheet-metal seat bracket with cut-outs and a welded pin' },
      },
    ],
    specifications: [
      { label: { en: 'Product category' }, value: { en: 'Seat structural component' } },
      { label: { en: 'Form' }, value: { en: 'Stamped sheet-metal bracket' } },
      { label: { en: 'Features' }, value: { en: 'Formed cut-outs, rolled edge, welded pin' } },
    ],
    sortOrder: 4,
  },
  {
    id: 'mf-cushion',
    slug: 'molded-seat-cushion-foam',
    categorySlug: 'molded-foam',
    name: { en: 'Molded Seat Cushion Foam' },
    summary: {
      en: 'Molded foam seat cushion with a contoured edge, recessed channels and locating features on the underside.',
    },
    images: [
      {
        src: '/products/molded-seat-cushion-foam.jpg',
        width: 1600,
        height: 1067,
        alt: { en: 'Molded seat cushion foam with contoured edge and recessed areas' },
      },
    ],
    specifications: [
      { label: { en: 'Product category' }, value: { en: 'Molded foam component' } },
      { label: { en: 'Form' }, value: { en: 'Seat cushion foam' } },
      { label: { en: 'Features' }, value: { en: 'Contoured edge, recessed channels, locating holes' } },
    ],
    featured: true,
    sortOrder: 5,
  },
]

const productRecords: ProductRecord[] = sourceCatalog as ProductRecord[]

function localizeCategory(record: CategoryRecord, locale: string): Category {
  return {
    slug: record.slug,
    parentSlug: record.parentSlug,
    name: text(record.name, locale),
    tagline: text(record.tagline, locale),
    description: text(record.description, locale),
    image: { ...record.image, alt: text(record.image.alt, locale) },
  }
}

function localizeProduct(record: ProductRecord, locale: string): Product {
  const category = categoryRecords.find((c) => c.slug === (record.subcategorySlug ?? record.categorySlug))
  return {
    id: record.id,
    slug: record.slug,
    categorySlug: record.subcategorySlug ?? record.categorySlug,
    parentCategorySlug: record.categorySlug,
    categoryName: category ? text(category.name, locale) : '',
    name: text(record.name, locale),
    summary: text(record.summary, locale),
    images: record.images.map((image) => ({
      src: image.src,
      width: image.width,
      height: image.height,
      alt: text(image.alt, locale),
    })),
    specifications: record.specifications
      .map((row) => ({ label: text(row.label, locale), value: text(row.value, locale) }))
      .filter((row) => row.label && row.value),
    applications: pickLocalized(record.applications, locale) ?? [],
    featured: Boolean(record.featured),
  }
}

export function getCategories(locale: string = defaultLocale): Category[] {
  return categoryRecords.map((c) => localizeCategory(c, locale))
}

export function getCategory(slug: string | undefined, locale: string = defaultLocale): Category | undefined {
  const record = categoryRecords.find((c) => c.slug === slug)
  return record ? localizeCategory(record, locale) : undefined
}

export function getProducts(
  options: { category?: string; page?: number; pageSize?: number; locale?: string } = {},
) {
  const { category, page = 1, pageSize = 24, locale = defaultLocale } = options
  const filtered = productRecords
    .filter((p) => !category || p.categorySlug === category || p.subcategorySlug === category)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize).map((p) => localizeProduct(p, locale))
  return { items, total: filtered.length, page: safePage, totalPages }
}

export function getAllProductSlugs() {
  return productRecords.map((p) => p.slug)
}

export function getProduct(slug: string, locale: string = defaultLocale): Product | undefined {
  const record = productRecords.find((p) => p.slug === slug)
  return record ? localizeProduct(record, locale) : undefined
}

export function getFeaturedProducts(limit = 4, locale: string = defaultLocale): Product[] {
  return productRecords
    .filter((p) => p.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit)
    .map((p) => localizeProduct(p, locale))
}

export function getRelatedProducts(product: Product, limit = 3, locale: string = defaultLocale): Product[] {
  return productRecords
    .filter((p) => (p.subcategorySlug ?? p.categorySlug) === product.categorySlug && p.slug !== product.slug)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit)
    .map((p) => localizeProduct(p, locale))
}
