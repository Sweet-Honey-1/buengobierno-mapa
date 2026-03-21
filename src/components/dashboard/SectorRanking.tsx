import { Card } from '../ui/Card'
import type { RankingItem } from '../../types/domain'

export function SectorRanking({ ranking }: { ranking: RankingItem[] }) {
  const max = ranking[0]?.value ?? 1

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-red-700">Sectores dominantes</h2>
        <span className="text-xs text-neutral-500">Ranking nacional</span>
      </div>

      <div className="space-y-4">
        {ranking.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-neutral-700">{item.label}</span>
              <span className="font-semibold text-red-700">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-red-50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-red-600"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}