'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

function StructureFallback({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" fill="none" className={className} aria-hidden focusable="false">
      <g stroke="#2b2f38" strokeOpacity="0.4" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M222 128 C214 190 206 260 204 330" />
        <path d="M290 122 C284 190 280 260 276 338" />
        <path d="M218 200 L286 194 M213 262 L283 258 M208 322 L279 320" strokeOpacity="0.22" />
        <path d="M204 330 C260 352 340 352 420 336 L452 328" />
        <path d="M276 338 C340 354 400 356 452 346" />
        <path d="M204 330 L196 366 C260 394 340 396 430 374 L452 346" />
        <path d="M196 366 L196 440 M388 382 L388 440" strokeOpacity="0.3" />
        <path d="M150 440 L480 440 M138 458 L492 458" />
        <path d="M150 440 L138 458 M480 440 L492 458" strokeOpacity="0.3" />
        <path d="M250 330 C256 300 270 284 300 280" strokeOpacity="0.2" />
      </g>
      <path
        d="M232 62 L284 58 L290 122 L222 128 Z"
        stroke="#d3241a"
        strokeOpacity="0.85"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <g fill="#d3241a" fillOpacity="0.85">
        <circle cx="204" cy="330" r="3.5" />
        <circle cx="276" cy="338" r="3.5" />
        <circle cx="452" cy="346" r="3.5" />
      </g>
    </svg>
  )
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function StructureBackdrop({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !canUseWebGL()) return

    let disposed = false
    let dispose: (() => void) | undefined
    const lowPower = window.matchMedia('(max-width: 767px)').matches

    import('@/components/site/structure-scene')
      .then(({ mountStructureScene }) => {
        if (disposed) return
        const handle = mountStructureScene(canvas, { lowPower })
        dispose = handle.dispose
        setLive(true)
      })
      .catch(() => setLive(false))

    return () => {
      disposed = true
      dispose?.()
    }
  }, [])

  return (
    <div aria-hidden className={cn('pointer-events-none absolute overflow-hidden', className)}>
      <StructureFallback
        className={cn('absolute inset-0 size-full transition-opacity duration-700', live ? 'opacity-0' : 'opacity-100')}
      />
      <canvas
        ref={canvasRef}
        className={cn('absolute inset-0 size-full transition-opacity duration-700', live ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  )
}
