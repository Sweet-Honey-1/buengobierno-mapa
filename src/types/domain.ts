// src/types/domain.ts
export type DepartmentCode =
  | 'AMAZONAS'
  | 'ANCASH'
  | 'APURIMAC'
  | 'AREQUIPA'
  | 'AYACUCHO'
  | 'CAJAMARCA'
  | 'CALLAO'
  | 'CUSCO'
  | 'HUANCAVELICA'
  | 'HUANUCO'
  | 'ICA'
  | 'JUNIN'
  | 'LALIBERTAD'
  | 'LAMBAYEQUE'
  | 'LIMA'
  | 'LORETO'
  | 'MADREDEDIOS'
  | 'MOQUEGUA'
  | 'PASCO'
  | 'PIURA'
  | 'PUNO'
  | 'SANMARTIN'
  | 'TACNA'
  | 'TUMBES'
  | 'UCAYALI'

export type ProvinceOption = {
  provincia: string
  departamento: string
  value: string
  label: string
  provincia_nombre: string
  departamento_nombre: string
}

export type ApiSectorRanking = {
  etiqueta: string
  entidad: string
  puntaje: number
}

export type ApiMappedResponse = {
  mapeo_geografico: {
    total_registros_procesados: number
    ranking_sectores: Record<string, ApiSectorRanking>
    ranking_terminos: Record<string, number>
    frases_recurrentes: Record<string, number>
    palabras_clave_por_ubicacion: Record<string, Record<string, number>>
    sectores_por_ubicacion: Record<string, Record<string, number>>
    sectores_por_departamento: Record<string, Record<string, number>>
    sectores_por_provincia: Record<string, Record<string, number>>
    muestra_clasificada: Array<{
      nombre: string
      ubicacion_canonica: string
      provincia: string
      departamento: string
      texto: string
      categoria: string
      categoria_id: string
      confianza: number
      frases_dolencia: string[]
      terminos_relevantes: string[]
      provincia_legible: string
      departamento_legible: string
    }>
  }
}

export type SummaryStat = {
  label: string
  value: string | number
  accent: 'red' | 'yellow' | 'neutral'
}

export type RankingItem = {
  label: string
  value: number
  meta?: string
}

export type DepartmentDashboard = {
  code: DepartmentCode
  name: string
  totalScore: number
  dominantSector: string
  dominantSectorLabel: string
  topSectors: RankingItem[]
  topLocations: RankingItem[]
  topTerms: RankingItem[]
}

export type DashboardViewModel = {
  summary: {
    totalReports: number
    topSectors: RankingItem[]
    topPhrases: RankingItem[]
    topTerms: RankingItem[]
    stats: SummaryStat[]
  }
  departments: Partial<Record<DepartmentCode, DepartmentDashboard>>
}

export type SubmissionPayload = {
  nombre: string
  ubicacion: string
  dolencia: string
}