import type { PropsWithChildren } from 'react'
import type { DepartmentCode } from '../../types/domain'
import { Topbar } from './Topbar'
import { useWakeApi } from '../../hooks/useWakeApi'

export function Shell({
  children,
  selectedDepartment,
  onRefresh,
  isRefreshing,
}: PropsWithChildren<{
  selectedDepartment: DepartmentCode | null
  onRefresh: () => void
  isRefreshing?: boolean
}>) {
  useWakeApi()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(254,240,138,0.35),transparent_32%),linear-gradient(180deg,#fff7ed_0%,#ffffff_55%,#fff1f2_100%)] px-4 py-6 text-neutral-900 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Topbar selectedDepartment={selectedDepartment} onRefresh={onRefresh} isRefreshing={isRefreshing} />
        {children}
      </div>
    </main>
  )
}