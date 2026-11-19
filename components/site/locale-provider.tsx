'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { defaultLocale } from '@/lib/i18n'

const LocaleContext = createContext<string>(defaultLocale)
const EnabledLocaleContext = createContext<readonly string[]>([defaultLocale])
export function LocaleProvider({ locale, enabled, children }: { locale: string; enabled: readonly string[]; children: ReactNode }) {
  return <EnabledLocaleContext.Provider value={enabled}><LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider></EnabledLocaleContext.Provider>
}
export function useSiteLocale() { return useContext(LocaleContext) }
export function useEnabledLocales() { return useContext(EnabledLocaleContext) }
