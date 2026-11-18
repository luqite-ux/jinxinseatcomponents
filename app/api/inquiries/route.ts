import { NextResponse } from 'next/server'
import { InquiryNotConfiguredError, inquirySchema, saveInquiry } from '@/lib/inquiries'
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from '@/lib/inquiry-captcha'

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'The request could not be read.' }, { status: 400 })
  }

  const fields = typeof payload === 'object' && payload !== null ? payload as Record<string, unknown> : {}
  try {
    const context = createSupabaseCaptchaContextFromEnv()
    const secret = process.env.CAPTCHA_SECRET?.trim()
    if (!secret) throw new InquiryNotConfiguredError()
    const captcha = await verifyCaptchaSubmission({
      ...context,
      secret,
      scope: String(fields.captchaScope ?? ''),
      token: String(fields.captchaToken ?? ''),
      answer: String(fields.captchaAnswer ?? ''),
    })
    if (!captcha.ok) {
      return NextResponse.json({ ok: false, message: 'Please enter the current 4-character image code.', fieldErrors: { captchaAnswer: 'Invalid or expired code.' } }, { status: 422 })
    }
  } catch {
    return NextResponse.json({ ok: false, message: 'Image verification is temporarily unavailable. Please email us directly.' }, { status: 503 })
  }

  // Consume a challenge before handling any valid JSON submission, including honeypot and field errors.
  if (fields.website) {
    return NextResponse.json({ ok: false, message: 'The request could not be accepted.' }, { status: 422 })
  }

  const parsed = inquirySchema.safeParse(payload)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return NextResponse.json(
      { ok: false, message: 'Please check the highlighted fields.', fieldErrors },
      { status: 422 },
    )
  }

  try {
    const { id } = await saveInquiry(parsed.data)
    return NextResponse.json({ ok: true, id })
  } catch (error) {
    if (error instanceof InquiryNotConfiguredError) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Your inquiry could not be submitted online right now. Please email us directly at info@jinxinseatcomponents.com.',
        },
        { status: 503 },
      )
    }
    return NextResponse.json(
      { ok: false, message: 'Something went wrong while sending your inquiry. Please try again in a moment.' },
      { status: 500 },
    )
  }
}
