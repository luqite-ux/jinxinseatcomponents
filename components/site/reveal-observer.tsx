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
    let mutations: MutationObserver | undefined
    let frame = 0
    try {
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

      // Client-side navigation (pagination, category filters) mounts new blocks after
      // this effect has run. Re-scan the document so those blocks join the same observer
      // instead of staying hidden.
      const register = () => {
        const viewport = window.innerHeight
        for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))) {
          const rect = el.getBoundingClientRect()
          if (rect.top < viewport * 0.92 && rect.bottom > 0) el.classList.add('is-visible')
          else observer?.observe(el)
        }
      }
      const schedule = () => {
        if (frame) return
        frame = window.requestAnimationFrame(() => {
          frame = 0
          register()
        })
      }

      register()
      mutations = new MutationObserver((records) => {
        for (const record of records) {
          if (record.addedNodes.length > 0) {
            schedule()
            return
          }
        }
      })
      mutations.observe(document.body, { childList: true, subtree: true })
      root.setAttribute('data-reveal', 'ready')
    } catch {
      root.removeAttribute('data-reveal')
    }

    return () => {
      mutations?.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
