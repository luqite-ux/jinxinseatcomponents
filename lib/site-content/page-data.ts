import 'server-only'
import { getSiteContent } from './site-content'

export async function getEditablePage(path: string, locale = 'en') {
  const snapshot = await getSiteContent(locale)
  const page = snapshot?.pages.find((entry) => entry.path === path)
  const module = (type: string) => page?.modules.find((entry) => entry.type === type)
  return { version: page ? snapshot?.version : undefined, module }
}
