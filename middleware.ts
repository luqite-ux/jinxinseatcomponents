import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'
import { isServiceGuardExcludedPath, isWebsiteServiceAvailable } from '@/lib/service-status'
import { PREVIEW_COOKIE, protectPreviewResponse } from '@/lib/site-content/preview-protection'
import { defaultLocale, supportedLocaleCodes } from '@/lib/i18n'

function localizedDestination(pathname: string) {
  const match = /^\/([a-z]{2})(?=\/|$)/.exec(pathname)
  if (!match || !(supportedLocaleCodes as readonly string[]).includes(match[1])) return null
  const destination = pathname.slice(match[0].length) || '/'
  if (!/^\/(?:$|products(?:\/[^/]+)?$|news(?:\/[^/]+)?$|applications$|manufacturing$|about$|contact$)/.test(destination)) return null
  return { locale: match[1], destination }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const localized = localizedDestination(pathname)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hq-locale', localized?.locale ?? defaultLocale)
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
    protectPreviewResponse(response.headers, request.cookies.has(PREVIEW_COOKIE))
    return response
  }
  const response = localized
    ? NextResponse.rewrite(new URL(localized.destination + request.nextUrl.search, request.url), { request: { headers: requestHeaders } })
    : NextResponse.next({ request: { headers: requestHeaders } })
  protectPreviewResponse(response.headers, request.cookies.has(PREVIEW_COOKIE))
  return response
}

export const config = { matcher: ['/:path*'] }
