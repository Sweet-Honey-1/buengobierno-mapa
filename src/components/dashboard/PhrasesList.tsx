import { Card } from '../ui/Card'
import type { RankingItem } from '../../types/domain'

export function PhrasesList({ title, items }: { title: string; items: RankingItem[] }) {
  return (
    <Card className="p-5">
      <h2 className="mb-4 text-xl font-bold text-red-700">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-start justify-between gap-4 rounded-2xl bg-yellow-50/70 px-4 py-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-red-500">#{index + 1}</div>
              <div className="text-sm font-medium text-neutral-800">{item.label}</div>
            </div>
            <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-red-700 shadow-sm">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}