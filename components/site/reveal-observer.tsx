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
    let additions: MutationObserver | undefined
    try {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))
      const viewport = window.innerHeight
      const register = (el: HTMLElement) => {
        if (el.classList.contains('is-visible')) return
        const rect = el.getBoundingClientRect()
        if (rect.top < viewport * 0.92 && rect.bottom > 0) el.classList.add('is-visible')
        else observer?.observe(el)
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
      candidates.forEach(register)
      if (typeof MutationObserver === 'undefined') throw new Error('MutationObserver unavailable')
      additions = new MutationObserver((records) => {
        for (const record of records) for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue
          if (node.matches('[data-reveal]')) register(node)
          node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(register)
        }
      })
      additions.observe(document.body, { childList: true, subtree: true })
      root.setAttribute('data-reveal', 'ready')
    } catch {
      additions?.disconnect()
      observer?.disconnect()
      root.removeAttribute('data-reveal')
    }

    return () => { additions?.disconnect(); observer?.disconnect() }
  }, [pathname])

  return null
}
