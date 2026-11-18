import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import { SiteHeader } from '@/components/site/site-header'
import { SiteFooter } from '@/components/site/site-footer'
import { RevealObserver } from '@/components/site/reveal-observer'
import { site } from '@/lib/site'
import { PREVIEW_COOKIE } from '@/lib/site-content/preview-protection'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Automotive Seat Assemblies, Frames and Molded Foam | Jinxin',
    template: '%s | Zhoushan Jinxin Auto Parts',
  },
  description:
    'Zhoushan Jinxin Auto Parts Co., Ltd. makes automotive seat assemblies, seat frames and molded foam components. Browse the product range and send your requirements.',
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: 'Automotive Seating, From Structure to Assembly',
    description: 'Seat assemblies, seat frames and molded foam components from Zhoushan Jinxin Auto Parts.',
    url: site.url,
    images: [{ url: '/catalog/product-row-7.jpg', alt: 'Customer supplied automotive seat assembly photograph' }],
  },
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#f8f6f3',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isPreview = (await cookies()).has(PREVIEW_COOKIE)
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {isPreview && (
          <div className="flex items-center justify-between gap-4 bg-jx-deep px-5 py-2 text-sm text-white md:px-10">
            <span>Content preview · changes are not public</span>
            <form action="/api/site-content/exit-preview" method="post">
              <button type="submit" className="rounded-sm border border-white/80 px-3 py-1 font-semibold hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Exit preview
              </button>
            </form>
          </div>
        )}
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <RevealObserver />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {process.env.NODE_ENV === 'production' && !isPreview && <Analytics />}
      </body>
    </html>
  )
}
