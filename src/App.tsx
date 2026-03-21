// src/App.tsx
import { useMemo, useState } from 'react'
import { Shell } from './components/layout/Shell'
import { KPIGrid } from './components/dashboard/KPIGrid'
import { SectorRanking } from './components/dashboard/SectorRanking'
import { PhrasesList } from './components/dashboard/PhrasesList'
import { DepartmentDetailPanel } from './components/dashboard/DepartmentDetailPanel'
import { PeruDepartmentMap } from './components/map/PeruDepartmentMap'
import { ReportForm } from './components/forms/ReportForm'
import { LoadingState } from './components/ui/LoadingState'
import { EmptyState } from './components/ui/EmptyState'
import { useDashboardData } from './hooks/useDashboardData'
import type { DepartmentCode } from './types/domain'

export default function App() {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode | null>('LIMA')
  const { dashboard, isLoading, isFetching, refetch } = useDashboardData()

  const departmentDetail = useMemo(() => {
    if (!dashboard || !selectedDepartment) return null
    return dashboard.departments[selectedDepartment] ?? null
  }, [dashboard, selectedDepartment])

  return (
    <Shell
      selectedDepartment={selectedDepartment}
      onRefresh={refetch}
      isRefreshing={isFetching}
    >
      {isLoading ? (
        <LoadingState label="Cargando mapeo social del Perú..." />
      ) : !dashboard ? (
        <EmptyState
          title="Sin datos disponibles"
          description="Aún no hay resultados listos para mostrar en el dashboard."
        />
      ) : (
        <div className="space-y-6">
          <KPIGrid summary={dashboard.summary} />

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            {/* El mapa ya está adaptado con Leaflet y usa tu Card UI internamente */}
            <PeruDepartmentMap
              departments={dashboard.departments}
              selectedDepartment={selectedDepartment}
              onSelectDepartment={setSelectedDepartment}
            />

            <DepartmentDetailPanel
              selectedDepartment={selectedDepartment}
              detail={departmentDetail}
            />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr_1fr]">
            <SectorRanking ranking={dashboard.summary.topSectors} />
            <PhrasesList title="Frases más recurrentes" items={dashboard.summary.topPhrases} />
            <PhrasesList title="Términos más relevantes" items={dashboard.summary.topTerms} />
          </section>

          <ReportForm />
        </div>
      )}
    </Shell>
  )
}