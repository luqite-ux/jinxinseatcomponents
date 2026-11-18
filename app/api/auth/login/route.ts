import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, TENANT_COOKIE } from '@/lib/admin-session'
import { adminRequest, backendConfig } from '@/lib/supabase/server'

export const runtime = 'nodejs'

type AdminUser = { id: string; tenant_id: string; password_hash: string; is_active: boolean }

export async function POST(request: Request) {
  const base = new URL(request.url)
  if (request.headers.get('origin') !== base.origin) return new Response('Forbidden', { status: 403 })
  try {
    const form = await request.formData()
    const email = String(form.get('email') ?? '').trim().toLowerCase()
    const password = String(form.get('password') ?? '')
    if (!email || !password || password.length > 256) throw new Error('Invalid credentials')
    const { tenantId } = backendConfig()
    const users = await adminRequest('admin_users', { select: 'id,tenant_id,password_hash,is_active', email: `eq.${email}`, tenant_id: `eq.${tenantId}`, limit: '1' }) as AdminUser[]
    const user = users[0]
    if (!user || !user.is_active || user.tenant_id !== tenantId || !(await bcrypt.compare(password, user.password_hash))) throw new Error('Invalid credentials')
    const token = randomBytes(32).toString('base64url')
    const expiresAt = new Date(Date.now() + 7 * 86400000)
    await adminRequest('admin_user_sessions', {}, 'POST', { admin_user_id: user.id, token, expires_at: expiresAt.toISOString() })
    const response = NextResponse.redirect(new URL('/admin', base), 303)
    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', expires: expiresAt }
    response.cookies.set(SESSION_COOKIE, token, options)
    response.cookies.set(TENANT_COOKIE, tenantId, options)
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch {
    return NextResponse.redirect(new URL('/admin/login?error=login_failed', base), 303)
  }
}
