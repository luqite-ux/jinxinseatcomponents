import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { buttonPrimary } from '@/lib/site'

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section aria-labelledby="cta-band-heading" className="border-t border-line bg-mist/60">
      <div className="mx-auto flex max-w-[88rem] flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-10 md:py-16">
        <Reveal>
          <h2 id="cta-band-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-ink-soft">{text}</p>
        </Reveal>
        <Reveal index={1}>
          <Link href="/contact" className={buttonPrimary}>
            Send an inquiry
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
