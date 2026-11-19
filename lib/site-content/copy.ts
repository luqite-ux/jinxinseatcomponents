export type EditableSectionProps = { content?: Record<string, unknown>; styles?: Record<string, Record<string, unknown>> }

export function siteCopy(values: Record<string, unknown> | undefined, key: string, fallback: string): string {
  if (!values) return fallback
  const value = values[key]
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Published site content field is invalid: ${key}`)
  return value
}
