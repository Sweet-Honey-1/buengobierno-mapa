// src/App.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'


import { fetchDashboard } from './lib/api'
import type { DepartmentCode } from './types/domain'
import { ReportForm } from './components/forms/ReportForm'
import { Topbar } from './components/layout/Topbar'
import { PeruDepartmentMap } from './components/map/PeruDepartmentMap'

export default function App() {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode | null>(null)

  const { 
    data: dashboardData, 
    isLoading, 
    isError, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 5,
  })

  const departments = dashboardData?.departments ?? {}
  const summary = dashboardData?.summary

  const currentMetrics = selectedDepartment ? departments[selectedDepartment] : null

  return (
    // Cambiado overflow-hidden a overflow-y-auto para permitir scroll en toda la página
    <div className="flex flex-col min-h-screen w-full bg-[#f8f9fa] font-sans text-neutral-900 overflow-y-auto">
      
      {/* HEADER */}
      <div className="px-4 pt-4 md:px-8 md:pt-8 shrink-0 z-10">
        {/* Usamos el Topbar original sin modal */}
        <Topbar 
          selectedDepartment={selectedDepartment}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />
      </div>

      {/* CONTENIDO PRINCIPAL: Mapa + Sidebar */}
      <div className="flex flex-col md:flex-row p-4 md:p-8 gap-6 min-h-[60vh]">
        
        {/* SECCIÓN DEL MAPA LEAFLET */}
        <div className="w-full md:w-2/3 min-h-125 relative z-0 flex items-center justify-center">
          <PeruDepartmentMap 
            departments={departments}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
          />
        </div>

        {/* SECCIÓN DE INTERFAZ / PANEL LATERAL */}
        <div className="w-full md:w-1/3 min-h-125 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 flex flex-col">
          <div className="p-6 md:p-8 flex-1">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full space-y-4">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                 <p className="text-red-700 font-medium">Cargando métricas...</p>
               </div>
            ) : isError ? (
               <div className="text-center bg-red-50 p-6 rounded-2xl border border-red-200 mt-10">
                 <p className="text-red-600 font-bold mb-2">Error de conexión</p>
                 <p className="text-red-500 text-sm">No se pudo cargar la información del dashboard.</p>
               </div>
            ) : currentMetrics && selectedDepartment ? (
              <div className="animate-fade-in transition-all duration-300">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                  Reporte Territorial
                </p>
                <h2 className="text-3xl font-black text-neutral-900 mb-6">
                  {currentMetrics.name}
                </h2>
                
                <div className="bg-linear-to-br from-red-50 to-orange-50 rounded-2xl p-5 border border-red-100 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-neutral-600 text-sm font-semibold">Volumen de Reportes</span>
                    <span className="text-red-700 font-black text-2xl">{currentMetrics.totalScore}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-xs uppercase tracking-wider block mb-1">Sector Dominante</span>
                    <span className="bg-white px-3 py-1.5 rounded-lg text-red-700 text-sm font-bold border border-red-200 inline-block shadow-sm">
                      {currentMetrics.dominantSectorLabel}
                    </span>
                  </div>
                </div>

                {currentMetrics.topSectors && currentMetrics.topSectors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 mb-3">Sectores más afectados</h3>
                    <ul className="space-y-2">
                      {currentMetrics.topSectors.map((sector, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-neutral-600 truncate pr-4">{sector.label.replaceAll('_', ' ')}</span>
                          <span className="font-semibold text-neutral-900">{sector.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentMetrics.topTerms && currentMetrics.topTerms.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-neutral-800 border-b pb-2 mb-3">Términos frecuentes</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentMetrics.topTerms.map((term, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs font-medium border border-neutral-200">
                          {term.label} ({term.value})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col transition-all duration-300">
                <h2 className="text-xl font-bold text-neutral-800 mb-4 pb-2 border-b">
                  Resumen Nacional
                </h2>
                
                {summary ? (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {summary.stats.map((stat, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border ${stat.accent === 'red' ? 'bg-red-50 border-red-100 text-red-800' : stat.accent === 'yellow' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' : 'bg-neutral-50 border-neutral-100 text-neutral-800'}`}>
                        <span className="block text-xs uppercase tracking-wider opacity-70 mb-1">{stat.label}</span>
                        <span className="text-xl font-black">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm">Selecciona una región en el mapa para ver sus detalles territoriales.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN DEL FORMULARIO DE REPORTES (Justo debajo del mapa) */}
      <div className="px-4 pb-12 md:px-8 max-w-5xl mx-auto w-full">
        <ReportForm />
      </div>

    </div>
  )
}