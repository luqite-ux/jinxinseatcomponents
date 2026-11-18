'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import { InquiryCaptchaField } from '@/components/inquiry-captcha-field'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const fieldBase =
  'w-full rounded-sm border bg-white px-3.5 py-3 text-base text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-soft/60 focus:border-ink focus:outline-none focus:ring-2 focus:ring-jx/30 aria-[invalid=true]:border-destructive md:text-sm'

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {required ? (
          <span className="text-jx-deep" aria-hidden>
            {' '}
            *
          </span>
        ) : (
          <span className="ml-1 text-xs font-normal text-ink-soft">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm({
  defaultSubject = '',
  productSlug = '',
}: {
  defaultSubject?: string
  productSlug?: string
}) {
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [captchaRefresh, setCaptchaRefresh] = useState(0)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    setStatus('submitting')
    setErrors({})
    setMessage('')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = (await response.json().catch(() => null)) as {
        ok: boolean
        message?: string
        fieldErrors?: Record<string, string>
      } | null

      if (response.ok && result?.ok) {
        setStatus('success')
        formRef.current?.reset()
        return
      }
      setErrors(result?.fieldErrors ?? {})
      setMessage(result?.message ?? 'Something went wrong while sending your inquiry. Please try again.')
      setCaptchaRefresh((current) => current + 1)
      setStatus('error')
    } catch {
      setMessage('We could not reach the server. Check your connection and try again.')
      setCaptchaRefresh((current) => current + 1)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="border border-line bg-white p-8 md:p-10">
        <CheckCircle2 aria-hidden className="size-9 text-jx" />
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">Inquiry received</h2>
        <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
          Thank you. We will review your requirements and reply to the business email you provided.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 rounded-sm border border-ink/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-ink hover:bg-mist"
        >
          Send another inquiry
        </button>
      </div>
    )
  }

  const submitting = status === 'submitting'
  const describe = (name: string, hint?: boolean) =>
    errors[name] ? `${id(name)}-error` : hint ? `${id(name)}-hint` : undefined

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="border border-line bg-white p-6 md:p-8" aria-busy={submitting}>
      <input type="hidden" name="productSlug" defaultValue={productSlug} />
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id('name')} label="Name" required error={errors.name}>
          <input
            id={id('name')}
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe('name')}
            className={cn(fieldBase, errors.name ? 'border-destructive' : 'border-line')}
          />
        </Field>
        <Field id={id('email')} label="Business email" required error={errors.email}>
          <input
            id={id('email')}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe('email')}
            className={cn(fieldBase, errors.email ? 'border-destructive' : 'border-line')}
          />
        </Field>
        <Field id={id('company')} label="Company" required error={errors.company}>
          <input
            id={id('company')}
            name="company"
            autoComplete="organization"
            required
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describe('company')}
            className={cn(fieldBase, errors.company ? 'border-destructive' : 'border-line')}
          />
        </Field>
        <Field id={id('phone')} label="Phone" error={errors.phone}>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describe('phone')}
            className={cn(fieldBase, errors.phone ? 'border-destructive' : 'border-line')}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id={id('subject')} label="Product or subject" required error={errors.subject}>
            <input
              id={id('subject')}
              name="subject"
              defaultValue={defaultSubject}
              required
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={describe('subject')}
              className={cn(fieldBase, errors.subject ? 'border-destructive' : 'border-line')}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id={id('message')} label="Requirements" required error={errors.message}>
            <textarea
              id={id('message')}
              name="message"
              rows={6}
              required
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describe('message')}
              className={cn(fieldBase, 'resize-y', errors.message ? 'border-destructive' : 'border-line')}
            />
          </Field>
        </div>
        <Field id={id('quantity')} label="Quantity" error={errors.quantity}>
          <input
            id={id('quantity')}
            name="quantity"
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={describe('quantity')}
            className={cn(fieldBase, errors.quantity ? 'border-destructive' : 'border-line')}
          />
        </Field>
        <Field
          id={id('drawingContext')}
          label="Drawing or sample context"
          hint="For example, a drawing number or a sample you can share."
          error={errors.drawingContext}
        >
          <input
            id={id('drawingContext')}
            name="drawingContext"
            aria-invalid={Boolean(errors.drawingContext)}
            aria-describedby={describe('drawingContext', true)}
            className={cn(fieldBase, errors.drawingContext ? 'border-destructive' : 'border-line')}
          />
        </Field>
      </div>

      <InquiryCaptchaField refreshKey={captchaRefresh} className="mt-6" />

      {status === 'error' && message && (
        <div role="alert" className="mt-6 flex gap-3 border border-destructive/40 bg-[#fdf1f0] p-4 text-sm text-destructive">
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>
            {message}
            {message.includes('email us') ? null : (
              <>
                {' '}
                You can also write to{' '}
                <a href={`mailto:${site.email}`} className="font-semibold underline">
                  {site.email}
                </a>
                .
              </>
            )}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-soft">Fields marked * are required.</p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-jx px-7 py-3 text-sm font-semibold text-white transition-[background-color,transform] hover:bg-jx-deep active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send aria-hidden className="size-4" />
              Send inquiry
            </>
          )}
        </button>
      </div>
    </form>
  )
}
