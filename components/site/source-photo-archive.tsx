import Image from 'next/image'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'

export type SourcePhoto = { id: string; title: string; image: { src: string; alt: string } }

export function SourcePhotoArchive({ id, eyebrow, title, description, photos, fit, aspect = 'landscape' }: {
  id: string
  eyebrow: string
  title: string
  description: string
  photos: SourcePhoto[]
  fit: 'contain' | 'cover'
  aspect?: 'landscape' | 'portrait'
}) {
  if (photos.length === 0) return null
  const tile = (photo: SourcePhoto, index: number) => (
    <Reveal as="li" key={photo.id} index={index} className="list-none">
      <figure className="h-full overflow-hidden rounded-xl border border-line bg-white">
        <div className={`relative bg-white ${aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
          <Image src={photo.image.src} alt={photo.image.alt} fill loading={index < 6 ? 'eager' : 'lazy'} sizes="(min-width: 1024px) 29vw, (min-width: 640px) 46vw, 92vw" className={fit === 'cover' ? 'object-cover' : 'object-contain'} />
        </div>
        <figcaption className="border-t border-line px-4 py-3 text-sm font-medium text-ink">{photo.title}</figcaption>
      </figure>
    </Reveal>
  )
  return (
    <section aria-labelledby={id} className="border-t border-line bg-mist/50">
      <div className="mx-auto max-w-[88rem] px-5 py-14 md:px-10 md:py-20">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} description={description} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.slice(0, 6).map(tile)}</ul>
        {photos.length > 6 && (
          <details className="mt-6 rounded-xl border border-line bg-white px-5 py-4">
            <summary className="cursor-pointer font-medium text-ink">View all {photos.length} photographs</summary>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.slice(6).map((photo, index) => tile(photo, index + 6))}</ul>
          </details>
        )}
      </div>
    </section>
  )
}
