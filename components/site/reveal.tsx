import type { CSSProperties, ReactNode } from 'react'

type RevealTag = 'div' | 'section' | 'li' | 'article' | 'header' | 'p' | 'figure' | 'ul' | 'footer'

export function Reveal({
  as = 'div',
  index = 0,
  className,
  children,
}: {
  as?: RevealTag
  index?: number
  className?: string
  children: ReactNode
}) {
  const Tag = as as 'div'
  return (
    <Tag data-reveal="" style={{ '--reveal-i': index } as CSSProperties} className={className}>
      {children}
    </Tag>
  )
}
