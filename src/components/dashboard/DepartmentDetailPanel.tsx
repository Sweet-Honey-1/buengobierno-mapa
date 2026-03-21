import { Card } from '../ui/Card'
import type { DepartmentCode, DepartmentDashboard } from '../../types/domain'
import { departmentMeta } from '../../data/peruDepartments'
import { humanizeCanonLocation } from '../../lib/utils'

export function DepartmentDetailPanel({
  selectedDepartment,
  detail,
}: {
  selectedDepartment: DepartmentCode | null
  detail: DepartmentDashboard | null
}) {
  return (
    <Card className="p-5">
      <div className="mb-5">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Detalle territorial</div>
        <h2 className="mt-2 text-2xl font-black text-red-700">
          {selectedDepartment ? departmentMeta[selectedDepartment].label : 'Selecciona un departamento'}
        </h2>
      </div>

      {!detail ? (
        <p className="text-sm text-neutral-500">No hay datos suficientes para este departamento.</p>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-red-600 to-yellow-500 p-5 text-white">
            <div className="text-sm text-red-50/90">Sector dominante</div>
            <div className="mt-2 text-2xl font-black">{detail.dominantSectorLabel}</div>
            <div className="mt-3 text-sm text-red-50/90">Puntaje agregado: {detail.totalScore}</div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-500">Top sectores</h3>
            <div className="space-y-2">
              {detail.topSectors.map((sector) => (
                <div key={sector.label} className="flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3">
                  <span className="text-sm font-medium text-neutral-800">{sector.label}</span>
                  <span className="text-sm font-bold text-red-700">{sector.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-500">Ubicaciones más intensas</h3>
            <div className="space-y-2">
              {detail.topLocations.map((location) => (
                <div key={location.label} className="flex items-center justify-between rounded-2xl bg-yellow-50 px-4 py-3">
                  <span className="text-sm text-neutral-800">{humanizeCanonLocation(location.label)}</span>
                  <span className="text-sm font-bold text-red-700">{location.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-500">Términos clave</h3>
            <div className="flex flex-wrap gap-2">
              {detail.topTerms.map((term) => (
                <span key={term.label} className="rounded-full border border-red-200 bg-white px-3 py-2 text-sm text-red-700">
                  {term.label} · {term.value}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}