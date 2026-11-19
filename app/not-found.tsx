import Link from '@/components/site/locale-link'
import { buttonPrimary, buttonSecondary } from '@/lib/site'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-jx-deep">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">This page could not be found</h1>
      <p className="mt-3 text-ink-soft">The page may have moved. Try the product catalog or return to the homepage.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={buttonPrimary}>
          Home
        </Link>
        <Link href="/products" className={buttonSecondary}>
          Products
        </Link>
      </div>
    </div>
  )
}
