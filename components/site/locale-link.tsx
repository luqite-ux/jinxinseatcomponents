'use client'

import Link from 'next/link'
import { forwardRef, type ComponentProps } from 'react'
import { localePath } from '@/lib/i18n'
import { useSiteLocale } from './locale-provider'

const LocaleLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link>>(function LocaleLink({ href, ...props }, ref) {
  const locale = useSiteLocale()
  return <Link ref={ref} href={typeof href === 'string' ? localePath(href, locale) : href} {...props} />
})

export default LocaleLink
