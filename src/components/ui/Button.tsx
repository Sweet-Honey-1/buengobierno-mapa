import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '../../lib/utils'

export function Button({ children, className, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition',
        'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}