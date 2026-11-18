import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { StructureBackdrop } from '@/components/site/structure-backdrop'
import { buttonPrimary, site } from '@/lib/site'

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden border-t border-line bg-white">
      <StructureBackdrop className="right-[-30%] top-0 h-full w-[90%] opacity-30 md:right-0 md:w-[45%] md:opacity-100" />
      <div className="relative mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <div className="max-w-xl">
          <Reveal as="p" className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-jx-deep">
            <span aria-hidden className="h-px w-8 bg-jx" />
            Contact
          </Reveal>
          <Reveal index={1}>
            <h2 id="contact-heading" className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Tell us what your seat needs
            </h2>
          </Reveal>
          <Reveal index={2} as="p" className="mt-4 text-lg leading-relaxed text-ink-soft">
            Send an inquiry for a specific product or describe your requirements.
          </Reveal>
          <Reveal index={3} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/contact" className={buttonPrimary}>
              Send an inquiry
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-jx-deep">
              <Mail aria-hidden className="size-4 text-jx" />
              {site.email}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
