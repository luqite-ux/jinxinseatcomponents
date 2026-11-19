'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteTypographyStyle } from '@/lib/site-content/typography'

type Slide = {
  id: string
  label: string
  eyebrow: string
  title: string
  copy: string
  cta: { label: string; href: string }
  image: string
  mobileImage?: string
  mobileImageAlt?: string
  imageAlt: string
  align: 'left' | 'right'
  mobilePosition: string
  desktopPosition: string
}

const fallbackSlides: Slide[] = [
  {
    id: 'seating',
    label: 'Seat assemblies',
    eyebrow: 'Assemblies / Frames / Foam',
    title: 'Automotive Seating, From Structure to Assembly',
    copy: 'Complete seat assemblies, seat frames and molded foam components from one supplier. Browse the range and send us your requirements.',
    cta: { label: 'Explore Products', href: '/products' },
    image: '/catalog/cutouts/product-row-7.webp',
    imageAlt: 'Customer supplied photograph of an ambulance auxiliary seat assembly',
    align: 'left',
    mobilePosition: '88% 50%',
    desktopPosition: '72% 50%',
  },
  {
    id: 'foam',
    label: 'Molded foam',
    eyebrow: 'Molded foam components',
    title: 'Molded Foam for Seat Applications',
    copy: 'Explore the molded foam range for seat bases and backs. Send your drawing or sample and we will talk through the fit.',
    cta: { label: 'Explore Foam Components', href: '/products?category=molded-foam' },
    image: '/catalog/cutouts/product-row-45.webp',
    imageAlt: 'Customer supplied photograph of a molded seat foam component',
    align: 'right',
    mobilePosition: '12% 50%',
    desktopPosition: '25% 50%',
  },
  {
    id: 'frames',
    label: 'Seat frames',
    eyebrow: 'Seat structural components',
    title: 'Explore the Structure Beneath the Seat',
    copy: 'Look through the seat frame line, from complete frames to the brackets and members that carry the seat.',
    cta: { label: 'Explore Seat Frames', href: '/products?category=seat-frames' },
    image: '/catalog/cutouts/product-row-65.webp',
    imageAlt: 'Customer supplied photograph of a seat frame component',
    align: 'left',
    mobilePosition: '84% 50%',
    desktopPosition: '78% 50%',
  },
]

const AUTOPLAY_MS = 7000

type HeroContent = { slides?: Array<Record<string, unknown>> }
type HeroStyles = Record<string, Record<string, unknown>>

function publishedSlides(content: HeroContent): Slide[] {
  if (!Array.isArray(content.slides) || content.slides.length !== fallbackSlides.length) throw new Error('Published hero slides are incomplete')
  return content.slides.map((row) => {
    const baseline = fallbackSlides.find((slide) => slide.id === row.id)
    const desktop = row.desktop_image as { url?: unknown; alt?: unknown } | undefined
    const mobile = row.mobile_image as { url?: unknown; alt?: unknown } | undefined
    const ctaHref = row.cta_href
    if (!baseline || typeof row.label !== 'string' || typeof row.eyebrow !== 'string' || typeof row.title !== 'string' || typeof row.body !== 'string' || typeof row.cta_label !== 'string' || typeof ctaHref !== 'string' || typeof desktop?.url !== 'string' || typeof mobile?.url !== 'string' || typeof desktop.alt !== 'string' || typeof mobile.alt !== 'string') throw new Error('Published hero slide has invalid fields')
    return { ...baseline, label: row.label, eyebrow: row.eyebrow, title: row.title, copy: row.body,
      cta: { label: row.cta_label, href: ctaHref }, image: desktop.url, mobileImage: mobile.url, imageAlt: desktop.alt, mobileImageAlt: mobile.alt }
  })
}

export function HeroCarousel({ content, styles }: { content?: HeroContent; styles?: HeroStyles } = {}) {
  const slides = content ? publishedSlides(content) : fallbackSlides
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)
    const onChange = () => setReducedMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const playing = !userPaused && !interacting && !reducedMotion

  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS)
    return () => window.clearTimeout(id)
  }, [playing, index])

  const go = (next: number) => setIndex((next + slides.length) % slides.length)

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    }
  }

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') return
    touchStart.current = { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Featured product ranges"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
      className="relative bg-paper"
    >
      <h1 className="sr-only">Automotive seat assemblies, seat frames and molded foam from Zhoushan Jinxin Auto Parts</h1>

      <div
        className="grid touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (touchStart.current = null)}
        aria-live={playing ? 'off' : 'polite'}
      >
        {slides.map((slide, i) => {
          const active = i === index
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}: ${slide.label}`}
              data-active={active}
              inert={!active}
              className={cn(
                'hero-slide relative col-start-1 row-start-1 flex flex-col transition-opacity duration-700 md:block md:min-h-[clamp(520px,42vw,700px)]',
                active ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0',
              )}
            >
              <div
                className={cn('hero-media relative h-[280px] overflow-hidden bg-[#f8f6f3] md:absolute md:inset-0 md:h-auto', slide.align === 'right' && 'hero-media-right')}
                style={
                  {
                    '--pos-m': slide.mobilePosition,
                    '--pos-d': slide.desktopPosition,
                  } as CSSProperties
                }
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="hero-art hidden object-contain [object-position:var(--pos-d)] md:block"
                />
                <Image
                  src={slide.mobileImage ?? slide.image}
                  alt={slide.mobileImageAlt ?? slide.imageAlt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="hero-art object-contain [object-position:var(--pos-m)] md:hidden"
                />
              </div>

              <div
                className={cn(
                  'relative mx-auto flex w-full max-w-[88rem] px-5 py-8 md:min-h-[clamp(520px,42vw,700px)] md:items-center md:px-10 md:py-16',
                  slide.align === 'right' && 'md:justify-end',
                )}
              >
                <div
                  className={cn(
                    'w-full text-ink md:max-w-[min(34rem,46%)]',
                    slide.align === 'right' && 'md:border-l md:border-jx/30 md:pl-8',
                  )}
                >
                  <p
                    style={{ '--hero-i': 0, ...siteTypographyStyle(styles, `slides.${slide.id}.eyebrow`, { 'site-mono': 'var(--font-geist-mono)' }) } as CSSProperties}
                    className="hero-in hq-typography flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-jx-deep"
                  >
                    {slide.align === 'left' && <span aria-hidden className="h-px w-8 bg-jx" />}
                    {slide.eyebrow}
                  </p>
                  <h2
                    style={{ '--hero-i': 1, ...siteTypographyStyle(styles, `slides.${slide.id}.title`, { 'site-sans': 'var(--font-geist-sans)' }) } as CSSProperties}
                    className="hero-in hq-typography mt-4 text-balance text-[2rem] font-semibold leading-[1.08] tracking-tight md:text-5xl lg:text-[54px]"
                  >
                    {slide.title}
                  </h2>
                  <p
                    style={{ '--hero-i': 2, ...siteTypographyStyle(styles, `slides.${slide.id}.body`, { 'site-sans': 'var(--font-geist-sans)' }) } as CSSProperties}
                    className="hero-in hq-typography mt-4 max-w-prose text-pretty text-base leading-relaxed text-ink-soft md:text-lg"
                  >
                    {slide.copy}
                  </p>
                  <div style={{ '--hero-i': 3 } as CSSProperties} className="hero-in mt-7">
                    <Link
                      href={slide.cta.href}
                      className="group inline-flex min-h-12 items-center gap-2 rounded-sm bg-jx px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-jx-deep"
                    >
                      {slide.cta.label}
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-10">
          <ol className="grid grid-cols-3 gap-2 md:flex md:gap-6">
            {slides.map((slide, i) => (
              <li key={slide.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show slide ${i + 1}: ${slide.label}`}
                  aria-current={i === index ? 'true' : undefined}
                  className="group block min-h-11 w-full text-left"
                >
                  <span className="relative block h-0.5 w-full overflow-hidden bg-line">
                    <span
                      aria-hidden
                      key={`${i === index}-${index}`}
                      style={
                        i === index && playing ? { animation: `progress-fill ${AUTOPLAY_MS}ms linear forwards` } : undefined
                      }
                      className={cn(
                        'absolute inset-0 origin-left bg-jx',
                        i === index ? (playing ? '' : 'scale-x-100') : 'scale-x-0 group-hover:scale-x-100 group-hover:bg-ink/30',
                        'transition-transform duration-300',
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      'mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] transition-colors md:text-xs',
                      i === index ? 'text-ink' : 'text-ink-soft group-hover:text-ink',
                    )}
                  >
                    <span className="hidden md:inline">0{i + 1} </span>
                    {slide.label}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="inline-flex size-11 items-center justify-center rounded-sm border border-line bg-white transition-colors hover:border-ink hover:bg-mist active:scale-95"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? 'Start automatic slide rotation' : 'Pause automatic slide rotation'}
              aria-pressed={userPaused}
              disabled={reducedMotion}
              className="inline-flex size-11 items-center justify-center rounded-sm border border-line bg-white transition-colors hover:border-ink hover:bg-mist active:scale-95 disabled:opacity-40"
            >
              {userPaused || reducedMotion ? (
                <Play aria-hidden className="size-4" />
              ) : (
                <Pause aria-hidden className="size-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="inline-flex size-11 items-center justify-center rounded-sm border border-line bg-white transition-colors hover:border-ink hover:bg-mist active:scale-95"
            >
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
