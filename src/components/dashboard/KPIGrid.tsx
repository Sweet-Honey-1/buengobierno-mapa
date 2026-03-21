import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Card } from '../ui/Card'
import type { SummaryStat } from '../../types/domain'

export function KPIGrid({ summary }: { summary: { stats: SummaryStat[] } }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(
      ref.current.children,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
    )
  }, [summary])

  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summary.stats.map((stat) => (
        <Card key={stat.label} className="p-5">
          <div className="text-sm font-medium text-neutral-500">{stat.label}</div>
          <div className={stat.accent === 'yellow' ? 'mt-2 text-3xl font-black text-yellow-600' : 'mt-2 text-3xl font-black text-red-700'}>
            {stat.value}
          </div>
        </Card>
      ))}
    </div>
  )
}