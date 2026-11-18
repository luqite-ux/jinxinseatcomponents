export type FaqItem = { id: string; question: string; answer: string }

type PublicContent = {
  items?: { content_key: string; data?: { items?: { id: string; is_active: boolean; title: string; text: string; sort_order: number }[] } }[]
}

export async function getProcurementFaq(): Promise<FaqItem[]> {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/\/$/, '')
  if (!tenantId || !adminUrl) return []
  try {
    const response = await fetch(`${adminUrl}/api/content/${tenantId}?kind=faq&locale=en`, { next: { revalidate: 60 } })
    if (!response.ok) return []
    const payload = await response.json() as PublicContent
    const entry = payload.items?.find((item) => item.content_key === 'home-procurement-faq')
    return (entry?.data?.items ?? [])
      .filter((item) => item.is_active && item.title?.trim() && item.text?.trim())
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({ id: item.id, question: item.title, answer: item.text }))
  } catch {
    return []
  }
}
