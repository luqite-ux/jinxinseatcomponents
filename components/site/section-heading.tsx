import { Reveal } from '@/components/site/reveal'
import { cn } from '@/lib/utils'
import { siteTypographyStyle } from '@/lib/site-content/typography'

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
  styles,
}: {
  eyebrow: string
  title: string
  description?: string
  id?: string
  className?: string
  styles?: Record<string, Record<string, unknown>>
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      <Reveal as="p" style={siteTypographyStyle(styles, 'eyebrow', { 'site-mono': 'var(--font-geist-mono)' })} className="hq-typography flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-jx-deep">
        <span aria-hidden className="h-px w-8 bg-jx" />
        {eyebrow}
      </Reveal>
      <Reveal index={1} as="div">
        <h2 id={id} style={siteTypographyStyle(styles, 'title', { 'site-sans': 'var(--font-geist-sans)' })} className="hq-typography mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal index={2} as="p" style={siteTypographyStyle(styles, 'description', { 'site-sans': 'var(--font-geist-sans)' })} className="hq-typography mt-4 text-pretty text-base leading-relaxed text-ink-soft md:text-lg">
          {description}
        </Reveal>
      )}
    </div>
  )
}
