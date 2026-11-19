export type EditableSectionProps = { content?: Record<string, unknown>; styles?: Record<string, Record<string, unknown>> }

export function siteCopy(values: Record<string, unknown> | undefined, key: string, fallback: string): string {
  if (!values) return fallback
  const value = values[key]
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Published site content field is invalid: ${key}`)
  return value
}

export function siteImage(values: Record<string, unknown> | undefined, key: string, fallback: { src: string; alt: string }) {
  if (!values) return fallback
  const image = values[key]
  if (!image || typeof image !== 'object' || typeof (image as Record<string, unknown>).url !== 'string' || typeof (image as Record<string, unknown>).alt !== 'string') throw new Error(`Published site image is invalid: ${key}`)
  return { src: (image as { url: string }).url, alt: (image as { alt: string }).alt }
}
