import { Plus } from 'lucide-react'
import { getProcurementFaq } from '@/lib/faq-db'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'

export async function FaqSection() {
  const items = await getProcurementFaq()
  if (!items.length) return null
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  }
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-t border-line bg-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <SectionHeading id="faq-heading" eyebrow="Ordering" title="Questions before you order" description="Practical details from the company's supplied FAQ." />
        <div className="mt-10 grid items-start gap-3 md:grid-cols-2 md:gap-4">
          {items.map((item, index) => (
            <Reveal key={item.id} index={index % 4}>
              <details className="group border border-line bg-white open:border-jx/40">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <Plus aria-hidden className="size-5 shrink-0 text-jx transition-transform group-open:rotate-45" />
                </summary>
                <p className="border-t border-line px-5 py-4 text-sm leading-relaxed text-ink-soft">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
