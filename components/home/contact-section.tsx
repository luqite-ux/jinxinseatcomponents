import Link from '@/components/site/locale-link'
import { ArrowRight, Mail } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { StructureBackdrop } from '@/components/site/structure-backdrop'
import { buttonPrimary, site } from '@/lib/site'
import { siteCopy, type EditableSectionProps } from '@/lib/site-content/copy'
import { siteTypographyStyle } from '@/lib/site-content/typography'

export function ContactSection({ content, styles }: EditableSectionProps = {}) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden border-t border-line bg-white">
      <StructureBackdrop className="right-[-30%] top-0 h-full w-[90%] opacity-30 md:right-0 md:w-[45%] md:opacity-100" />
      <div className="relative mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <div className="max-w-xl">
          <Reveal as="p" style={siteTypographyStyle(styles, 'eyebrow', { 'site-mono': 'var(--font-geist-mono)' })} className="hq-typography flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-jx-deep">
            <span aria-hidden className="h-px w-8 bg-jx" />
            {siteCopy(content, 'eyebrow', 'Contact')}
          </Reveal>
          <Reveal index={1}>
            <h2 id="contact-heading" style={siteTypographyStyle(styles, 'title', { 'site-sans': 'var(--font-geist-sans)' })} className="hq-typography mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {siteCopy(content, 'title', 'Tell us what your seat needs')}
            </h2>
          </Reveal>
          <Reveal index={2} as="p" style={siteTypographyStyle(styles, 'description', { 'site-sans': 'var(--font-geist-sans)' })} className="hq-typography mt-4 text-lg leading-relaxed text-ink-soft">
            {siteCopy(content, 'description', 'Send an inquiry for a specific product or describe your requirements.')}
          </Reveal>
          <Reveal index={3} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/contact" className={buttonPrimary}>
              {siteCopy(content, 'cta_label', 'Send an inquiry')}
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
