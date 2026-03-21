// src/components/ReportForm.tsx
import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useProvinceOptions } from '../../hooks/useProvinceOptions'
import { submitReport } from '../../lib/api'


export function ReportForm() {
  const queryClient = useQueryClient()
  const { data: provinceOptions = [], isLoading } = useProvinceOptions()

  const [nombre, setNombre] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [dolencia, setDolencia] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: submitReport,
    onSuccess: async () => {
      setMessage('Tu reporte fue enviado correctamente y quedó pendiente de procesamiento.')
      setNombre('')
      setUbicacion('')
      setDolencia('')
      // Ajustado para coincidir con la queryKey de App.tsx
      await queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
    },
    onError: (error: any) => {
      setMessage(error?.message || 'No se pudo enviar el reporte.')
    },
  })

  const canSubmit = useMemo(() => {
    return nombre.trim().length >= 2 && ubicacion && dolencia.trim().length >= 10
  }, [nombre, ubicacion, dolencia])

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-red-700">Registrar dolencia ciudadana</h2>
        <p className="mt-1 text-sm text-neutral-500">
          El formulario se guarda en Supabase. Luego FastAPI lo procesa y actualiza el dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">Nombre</label>
          <input
            className="w-full rounded-2xl border border-red-200 px-4 py-3 outline-none focus:border-red-400 bg-neutral-50 focus:bg-white transition-colors"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">Provincia</label>
          <select
            className="w-full rounded-2xl border border-red-200 px-4 py-3 outline-none focus:border-red-400 bg-neutral-50 focus:bg-white transition-colors"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Selecciona una provincia</option>
            {provinceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-neutral-700">Dolencia</label>
        <textarea
          className="min-h-30 w-full rounded-2xl border border-red-200 px-4 py-3 outline-none focus:border-red-400 bg-neutral-50 focus:bg-white transition-colors resize-y"
          value={dolencia}
          onChange={(e) => setDolencia(e.target.value)}
          placeholder="Describe el problema en tu zona"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-t border-neutral-100 pt-5">
        <p className="text-sm text-neutral-500">
          Ubicación canónica: <span className="font-semibold text-red-700">{ubicacion || '—'}</span>
        </p>

        <button
          className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
          disabled={!canSubmit || mutation.isPending}
          onClick={() =>
            mutation.mutate({
              nombre,
              ubicacion,
              dolencia,
            })
          }
        >
          {mutation.isPending ? 'Enviando...' : 'Enviar reporte'}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${mutation.isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {message}
        </div>
      )}
    </div>
  )
}