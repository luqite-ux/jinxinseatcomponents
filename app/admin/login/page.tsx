export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16 text-ink">
    <h1 className="text-3xl font-semibold">Jinxin administration</h1>
    <p className="mt-3 text-ink-soft">Sign in to manage your products, news and inquiries.</p>
    {error && <p role="alert" className="mt-6 border border-red-300 bg-red-50 p-3 text-red-800">Sign in failed. Check your credentials and try again.</p>}
    <form action="/api/auth/login" method="post" className="mt-8 space-y-5">
      <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="username" maxLength={254} className="mt-2 block min-h-12 w-full border border-ink/40 bg-white px-3 text-ink" /></label>
      <label className="block text-sm font-medium">Password<input name="password" type="password" required autoComplete="current-password" maxLength={256} className="mt-2 block min-h-12 w-full border border-ink/40 bg-white px-3 text-ink" /></label>
      <button type="submit" className="min-h-12 w-full bg-jx px-5 py-3 font-semibold text-white hover:bg-jx-deep">Sign in</button>
    </form>
  </main>
}
