// src/components/ui/Badge.tsx
import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/utils' // Ajusta esta ruta si es necesario

type BadgeProps = PropsWithChildren & {
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span 
      className={cn(
        "inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-red-700",
        className
      )}
    >
      {children}
    </span>
  )
}