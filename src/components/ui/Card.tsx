import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-red-200/50 bg-white shadow-[0_20px_70px_rgba(127,29,29,0.08)]',
        'backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}