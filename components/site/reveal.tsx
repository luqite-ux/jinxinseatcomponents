import type { CSSProperties, ReactNode } from 'react'

type RevealTag = 'div' | 'section' | 'li' | 'article' | 'header' | 'p' | 'figure' | 'ul' | 'footer'

export function Reveal({
  as = 'div',
  index = 0,
  className,
  style,
  children,
}: {
  as?: RevealTag
  index?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const Tag = as as 'div'
  return (
    <Tag data-reveal="" style={{ '--reveal-i': index, ...style } as CSSProperties} className={className}>
      {children}
    </Tag>
  )
}
