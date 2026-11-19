import { Mail, MessagesSquare, ScanSearch } from 'lucide-react'
import { Reveal } from '@/components/site/reveal'
import { SectionHeading } from '@/components/site/section-heading'
import { siteCopy, type EditableSectionProps } from '@/lib/site-content/copy'

const steps = [
  {
    id: 'send',
    icon: Mail,
    title: 'Send your requirements',
    text: 'Share the product, drawing number or sample reference, and the quantity you have in mind.',
  },
  {
    id: 'review',
    icon: ScanSearch,
    title: 'We review the fit',
    text: 'We look at your request against the products and components we make.',
  },
  {
    id: 'discuss',
    icon: MessagesSquare,
    title: 'Discuss the details',
    text: 'We talk through specifications and next steps directly with you.',
  },
]

export function CooperationSection({ content, styles }: EditableSectionProps = {}) {
  const sourceSteps = Array.isArray(content?.steps) ? content.steps : undefined
  const visibleSteps = steps.map((step) => {
    const row = sourceSteps?.find((item: unknown) => item && typeof item === 'object' && (item as Record<string, unknown>).id === step.id) as Record<string, unknown> | undefined
    if (sourceSteps && !row) throw new Error(`Published cooperation step missing: ${step.id}`)
    return { ...step, title: siteCopy(row, 'title', step.title), text: siteCopy(row, 'text', step.text) }
  })
  return (
    <section id="cooperation" aria-labelledby="cooperation-heading" className="bg-paper">
      <div className="mx-auto max-w-[88rem] px-5 py-16 md:px-10 md:py-24">
        <SectionHeading
          id="cooperation-heading"
          eyebrow={siteCopy(content, 'eyebrow', 'Cooperation')}
          title={siteCopy(content, 'title', 'How working together starts')}
          description={siteCopy(content, 'description', 'A short, direct process: tell us what you need and we will discuss whether and how we can fit it.')}
          styles={styles}
        />
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {visibleSteps.map((step, i) => (
            <Reveal as="li" key={step.id} index={i} className="list-none">
              <div className="h-full border border-line bg-white p-6">
                <span className="inline-flex size-12 items-center justify-center border border-jx/30 bg-jx/5 text-jx-deep">
                  <step.icon aria-hidden className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
