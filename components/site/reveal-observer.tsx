'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      root.removeAttribute('data-reveal')
      return
    }

    let observer: IntersectionObserver | undefined
    try {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))
      const viewport = window.innerHeight
      const pending: HTMLElement[] = []

      for (const el of candidates) {
        const rect = el.getBoundingClientRect()
        if (rect.top < viewport * 0.92 && rect.bottom > 0) el.classList.add('is-visible')
        else pending.push(el)
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer?.unobserve(entry.target)
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      )
      pending.forEach((el) => observer?.observe(el))
      root.setAttribute('data-reveal', 'ready')
    } catch {
      root.removeAttribute('data-reveal')
    }

    return () => observer?.disconnect()
  }, [pathname])

  return null
}
