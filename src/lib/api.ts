// src/lib/api.ts
import type {
  ApiMappedResponse,
  DashboardViewModel,
  DepartmentCode,
  ProvinceOption,
  RankingItem,
  SubmissionPayload,
} from '../types/domain'
import { supabase } from './supabase'
import { departmentMeta } from '../data/peruDepartments'

const HF_API_BASE = import.meta.env.VITE_FASTAPI_BASE_URL as string | undefined

function toTopItems(record: Record<string, number>, limit = 8): RankingItem[] {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }))
}

export function toReadableDepartmentCode(raw: string): DepartmentCode | null {
  const normalized = raw.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
  if (normalized in departmentMeta) return normalized as DepartmentCode;
  
  // Casos especiales para el GeoJSON
  if (normalized === 'MADREDEDIOS') return 'MADREDEDIOS';
  if (normalized === 'LALIBERTAD') return 'LALIBERTAD';
  if (normalized === 'SANMARTIN') return 'SANMARTIN';
  
  return null;
}

export async function wakeFastApi(): Promise<void> {
  if (!HF_API_BASE) return
  await fetch(`${HF_API_BASE}/`, { method: 'GET' }).catch(() => undefined)
}

export async function fetchProvinceOptions(): Promise<ProvinceOption[]> {
  const { data, error } = await supabase
    .from('geo_provincias')
    .select('provincia, departamento, value, label, provincia_nombre, departamento_nombre')
    .order('label', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function submitReport(payload: SubmissionPayload): Promise<void> {
  const { error } = await supabase.from('answers_raw').insert({
    nombre: payload.nombre?.trim() || 'anónimo',
    ubicacion: payload.ubicacion,
    dolencia: payload.dolencia.trim(),
    status: 'pending',
    source: 'spa',
  })

  if (error) throw error
}

export async function fetchDashboard(): Promise<DashboardViewModel> {
  const { data: cacheRow, error } = await supabase
    .from('dashboard_cache')
    .select('payload')
    .eq('cache_key', 'latest')
    .maybeSingle()

  if (error) throw error

  const payload = (cacheRow?.payload ?? null) as ApiMappedResponse | null

  if (!payload) {
    return {
      summary: {
        totalReports: 0,
        topSectors: [],
        topPhrases: [],
        topTerms: [],
        stats: [
          { label: 'Reportes procesados', value: 0, accent: 'red' },
          { label: 'Departamentos con señal', value: 0, accent: 'yellow' },
          { label: 'Sector dominante', value: 'Sin datos', accent: 'red' },
          { label: 'Frase más repetida', value: 'Sin datos', accent: 'yellow' },
        ],
      },
      departments: {},
    }
  }

  const mapped = payload.mapeo_geografico

  const topSectors = Object.entries(mapped.ranking_sectores)
    .sort((a, b) => b[1].puntaje - a[1].puntaje)
    .slice(0, 8)
    .map(([sectorId, info]) => ({
      label: info.etiqueta,
      value: info.puntaje,
      meta: sectorId,
    }))

  const topPhrases = toTopItems(mapped.frases_recurrentes, 8)
  const topTerms = toTopItems(mapped.ranking_terminos, 8)

  const departments: Partial<Record<DepartmentCode, any>> = {}

  Object.entries(mapped.sectores_por_departamento).forEach(([departmentRaw, sectorRecord]) => {
    const code = toReadableDepartmentCode(departmentRaw)
    if (!code) return

    const sortedSectors = Object.entries(sectorRecord)
      .sort((a, b) => b[1] - a[1])
      .map(([sectorId, value]) => ({
        label: sectorId,
        value,
      }))

    const dominant = sortedSectors[0]

    const topLocations = Object.entries(mapped.sectores_por_ubicacion)
      .filter(([loc]) => loc.endsWith(`-${departmentRaw}`))
      .map(([loc, sectors]) => ({
        label: loc,
        value: Object.values(sectors).reduce((acc, n) => acc + n, 0),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    const topTermsForDepartment = Object.entries(mapped.palabras_clave_por_ubicacion)
      .filter(([loc]) => loc.endsWith(`-${departmentRaw}`))
      .flatMap(([, terms]) => Object.entries(terms))
      .reduce<Record<string, number>>((acc, [term, value]) => {
        acc[term] = (acc[term] ?? 0) + value
        return acc
      }, {})

    departments[code] = {
      code,
      name: departmentMeta[code].label,
      totalScore: Object.values(sectorRecord).reduce((acc, n) => acc + n, 0),
      dominantSector: dominant?.label ?? 'sin_datos',
      dominantSectorLabel: dominant?.label?.replaceAll('_', ' ') ?? 'Sin datos',
      topSectors: sortedSectors.slice(0, 6),
      topLocations,
      topTerms: toTopItems(topTermsForDepartment, 6),
    }
  })

  const departmentCount = Object.keys(departments).length

  return {
    summary: {
      totalReports: mapped.total_registros_procesados,
      topSectors,
      topPhrases,
      topTerms,
      stats: [
        { label: 'Reportes procesados', value: mapped.total_registros_procesados, accent: 'red' },
        { label: 'Departamentos con señal', value: departmentCount, accent: 'yellow' },
        { label: 'Sector dominante', value: topSectors[0]?.label ?? 'Sin datos', accent: 'red' },
        { label: 'Frase más repetida', value: topPhrases[0]?.label ?? 'Sin datos', accent: 'yellow' },
      ],
    },
    departments,
  }
}