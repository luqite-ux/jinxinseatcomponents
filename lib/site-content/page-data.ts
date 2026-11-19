import 'server-only'
import { getSiteContent } from './site-content'
import { getRequestLocale } from '@/lib/site-locales'

export async function getEditablePage(path: string, locale?: string) {
  const snapshot = await getSiteContent(locale ?? await getRequestLocale())
  const page = snapshot?.pages.find((entry) => entry.path === path)
  const module = (type: string) => page?.modules.find((entry) => entry.type === type)
  return { version: page ? snapshot?.version : undefined, module }
}
