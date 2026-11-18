import { Reveal } from '@/components/site/reveal'
import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  id?: string
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      <Reveal as="p" className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-jx-deep">
        <span aria-hidden className="h-px w-8 bg-jx" />
        {eyebrow}
      </Reveal>
      <Reveal index={1} as="div">
        <h2 id={id} className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal index={2} as="p" className="mt-4 text-pretty text-base leading-relaxed text-ink-soft md:text-lg">
          {description}
        </Reveal>
      )}
    </div>
  )
}
