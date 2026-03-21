// src/components/Topbar.tsx
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'


import type { DepartmentCode } from '../../types/domain'
import { departmentMeta } from '../../data/peruDepartments'

export function Topbar({
  selectedDepartment,
  onRefresh,
  isRefreshing,
}: {
  selectedDepartment: DepartmentCode | null
  onRefresh: () => void
  isRefreshing?: boolean
}) {
  return (
    <header className="flex flex-col gap-4 rounded-4xl bg-linear-to-r from-red-700 via-red-600 to-yellow-500 p-6 text-white shadow-[0_30px_90px_rgba(153,27,27,0.28)] md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <Badge className="bg-white/20 text-red-500 hover:bg-white/30">Mapa social interactivo</Badge>
        <div>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Perú en tiempo casi real
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-red-50/90 md:text-base">
            Visualiza las dolencias ciudadanas por departamento, detecta sectores dominantes y recoge nuevos reportes desde una sola SPA.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
          <div className="text-xs uppercase tracking-[0.2em] text-yellow-100">Departamento activo</div>
          <div className="mt-1 text-lg font-bold">
            {selectedDepartment ? departmentMeta[selectedDepartment].label : 'Ninguno'}
          </div>
        </div>
        <Button onClick={onRefresh} className="bg-red text-red-700 0 font-bold">
          {isRefreshing ? 'Actualizando...' : 'Actualizar dashboard'}
        </Button>
      </div>
    </header>
  )
}