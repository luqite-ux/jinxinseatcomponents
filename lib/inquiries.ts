import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(120),
  email: z.string().trim().email('Please enter a valid business email.').max(200),
  company: z.string().trim().min(1, 'Please enter your company.').max(200),
  subject: z.string().trim().min(1, 'Please tell us what this is about.').max(200),
  message: z.string().trim().min(10, 'Please describe your requirements (at least 10 characters).').max(5000),
  phone: z.string().trim().max(60).optional().or(z.literal('')),
  quantity: z.string().trim().max(120).optional().or(z.literal('')),
  drawingContext: z.string().trim().max(1000).optional().or(z.literal('')),
  productSlug: z.string().trim().max(200).optional().or(z.literal('')),
})

export type InquiryInput = z.infer<typeof inquirySchema>

export class InquiryNotConfiguredError extends Error {
  constructor() {
    super('Inquiry storage is not connected.')
    this.name = 'InquiryNotConfiguredError'
  }
}

/** Persist a verified inquiry for this site's tenant. CAPTCHA is consumed by the route first. */
export async function saveInquiry(input: InquiryInput): Promise<{ id: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!url || !key || !tenantId) throw new InquiryNotConfiguredError()
  const message = [
    input.message,
    input.productSlug ? `Product slug: ${input.productSlug}` : '',
    input.quantity ? `Quantity: ${input.quantity}` : '',
    input.drawingContext ? `Drawing/sample: ${input.drawingContext}` : '',
  ].filter(Boolean).join('\n\n')
  const response = await fetch(`${url}/rest/v1/inquiries?select=id`, {
    method: 'POST',
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      prefer: 'return=representation',
    },
    body: JSON.stringify({
      tenant_id: tenantId,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      company: input.company,
      subject: input.subject,
      message,
      status: 'new',
    }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Inquiry storage returned HTTP ${response.status}`)
  const rows = await response.json() as { id: string }[]
  if (!rows[0]?.id) throw new Error('Inquiry storage returned no row ID')
  return { id: rows[0].id }
}
