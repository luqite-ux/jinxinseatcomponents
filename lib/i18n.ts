export const locales = ['en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export type Localized<T = string> = Partial<Record<string, T>>

export function resolveLocale(input?: string | null): string {
  if (!input) return defaultLocale
  const base = input.toLowerCase().split('-')[0]
  return (locales as readonly string[]).includes(base) ? base : defaultLocale
}

function isEmpty(value: unknown) {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

/** Request locale -> default locale -> first nonempty value. */
export function pickLocalized<T>(value: Localized<T> | undefined, locale: string = defaultLocale): T | undefined {
  if (!value) return undefined
  for (const candidate of [value[locale], value[defaultLocale]]) {
    if (!isEmpty(candidate)) return candidate as T
  }
  for (const candidate of Object.values(value)) {
    if (!isEmpty(candidate)) return candidate as T
  }
  return undefined
}

export function text(value: Localized<string> | undefined, locale: string = defaultLocale) {
  return pickLocalized(value, locale) ?? ''
}
