import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import type { Product } from '@/lib/products'

export function ProductImageFrame({
  src,
  alt,
  sizes,
  priority,
  className = 'aspect-square',
}: {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain"
      />
    </div>
  )
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const image = product.images[0]
  return (
    <Reveal as="li" index={index} className="list-none">
      <Link
        href={`/products/${product.slug}`}
        className="group flex h-full flex-col border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-ink/40 hover:shadow-[0_18px_36px_-24px_rgba(23,25,30,0.45)]"
      >
        {image && (
          <ProductImageFrame
            src={image.src}
            alt={image.alt}
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 92vw"
          />
        )}
        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-jx-deep">{product.categoryName}</p>
          <h3 className="text-lg font-semibold leading-snug tracking-tight">{product.name}</h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{product.summary}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-ink">
            View specifications
            <ArrowUpRight
              aria-hidden
              className="size-4 text-jx transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}
