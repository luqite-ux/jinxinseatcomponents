'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type GalleryImage = { src: string; width: number; height: number; alt: string }

export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState(0)
  const current = images[selected] ?? images[0]
  if (!current) return null

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden border border-line bg-white md:aspect-[5/4]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-in fade-in object-contain p-4 duration-300 md:p-8"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5" aria-label="Product images">
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === selected ? 'true' : undefined}
                className={cn(
                  'relative block aspect-square w-full overflow-hidden border bg-white transition-[border-color,opacity]',
                  i === selected ? 'border-jx' : 'border-line opacity-80 hover:border-ink/50 hover:opacity-100',
                )}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain p-1.5"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
