export function ServiceExpiredPage({ locale = 'en' }: { locale?: string }) {
  const zh = locale.toLowerCase().startsWith('zh')
  return <main className="min-h-screen bg-[#f8f6f3] px-6 text-ink flex items-center justify-center">
    <section className="w-full max-w-xl rounded-2xl border border-ink/15 bg-white p-8 text-center shadow-xl">
      <p className="text-sm uppercase tracking-[0.25em] text-jx-deep">Service Notice</p>
      <h1 className="mt-4 text-3xl font-semibold">{zh ? '您的网站服务已到期' : 'Website Service Has Expired'}</h1>
      <p className="mt-4 text-ink-soft">{zh ? '如需恢复访问，请联系客服人员办理续费。' : 'Please contact your service representative to renew and restore access.'}</p>
      <a className="mt-8 inline-flex rounded-lg border border-ink/30 px-5 py-2.5 text-sm hover:bg-mist" href="/admin/login">{zh ? '管理员登录' : 'Administrator Login'}</a>
    </section>
  </main>
}
