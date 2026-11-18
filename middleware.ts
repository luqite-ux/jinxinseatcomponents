import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from '@/lib/service-status'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = pathname === '/admin/login' || pathname.startsWith('/admin/login/') || pathname === '/admin/logout'
  if (!isPublic && (pathname === '/admin' || pathname.startsWith('/admin/')) && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('reason', 'unauthorized')
    return NextResponse.redirect(url)
  }
  if (!isServiceGuardExcludedPath(pathname) && !(await isWebsiteServiceAvailable(request))) {
    const response = NextResponse.rewrite(new URL('/service-expired', request.url))
    response.headers.set('Cache-Control', 'private, no-store, max-age=0')
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    return response
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin', '/admin/:path*'] }
